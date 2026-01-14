import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Complaint from '@/models/Complaint';
import { verifyToken } from '@/lib/auth';
import { getTokenFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Connect to database with error handling
    try {
      await connectDB();
      console.log('[Complaints Get] ✅ Database connected');
    } catch (dbError: any) {
      console.error('[Complaints Get] ❌ Database connection failed:', {
        error: dbError.message,
        code: dbError.code,
      });
      return NextResponse.json(
        { error: 'Database connection failed', details: dbError.message },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const complaintId = searchParams.get('id');
    const email = searchParams.get('email');
    const isAdmin = searchParams.get('admin') === 'true';

    // For admin access, check authentication
    if (isAdmin) {
      const token = getTokenFromRequest(request.headers);
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const payload = verifyToken(token);
      if (!payload || payload.role !== 'Admin') {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
      }
    }

    // Get single complaint by ID
    if (complaintId) {
      const complaint = await Complaint.findById(complaintId);
      if (!complaint) {
        return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
      }

      // If not admin, only return if email matches
      if (!isAdmin && complaint.email !== email?.toLowerCase()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }

      // Explicitly return complaint with imageUrl to ensure it's included
      const complaintData = {
        _id: complaint._id,
        name: complaint.name,
        email: complaint.email,
        complaintText: complaint.complaintText,
        location: complaint.location,
        imageUrl: complaint.imageUrl || null,
        category: complaint.category,
        priority: complaint.priority,
        department: complaint.department,
        status: complaint.status,
        isDuplicate: complaint.isDuplicate,
        duplicateOf: complaint.duplicateOf,
        createdAt: complaint.createdAt,
      };

      return NextResponse.json({ success: true, complaint: complaintData }, { status: 200 });
    }

    // Get all complaints (admin only) or by email
    if (isAdmin) {
      const category = searchParams.get('category');
      const priority = searchParams.get('priority');
      const status = searchParams.get('status');
      const hasImage = searchParams.get('hasImage');
      const isDuplicate = searchParams.get('isDuplicate');
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '50');

      const filter: any = {};

      if (category) filter.category = category;
      if (priority) filter.priority = priority;
      if (status) filter.status = status;
      if (hasImage === 'true') {
        filter.imageUrl = { 
          $exists: true, 
          $nin: [null, '']
        };
      }
      if (hasImage === 'false') {
        filter.$or = [
          { imageUrl: { $exists: false } },
          { imageUrl: null },
          { imageUrl: '' }
        ];
      }
      if (isDuplicate === 'true') filter.isDuplicate = true;
      if (isDuplicate === 'false') filter.isDuplicate = false;

      // Query complaints with error handling
      let complaints;
      let total;
      
      try {
        complaints = await Complaint.find(filter)
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip((page - 1) * limit)
          .lean(); // Use lean() for better performance
        
        total = await Complaint.countDocuments(filter);
        
        console.log('[Complaints Get] 📊 Query results:', {
          found: complaints.length,
          total,
          page,
          limit,
          filter,
        });
      } catch (queryError: any) {
        console.error('[Complaints Get] ❌ Database query failed:', {
          error: queryError.message,
          code: queryError.code,
          filter,
        });
        return NextResponse.json(
          { error: 'Failed to query complaints', details: queryError.message },
          { status: 500 }
        );
      }

      // COMPREHENSIVE DEBUG: Log raw database results
      console.log('=== ADMIN API DEBUG START ===');
      console.log('Raw MongoDB results count:', complaints.length);
      if (complaints.length > 0) {
        console.log('First complaint from DB (raw):', JSON.stringify(complaints[0], null, 2));
        console.log('First complaint imageUrl:', complaints[0].imageUrl);
        console.log('First complaint imageUrl type:', typeof complaints[0].imageUrl);
        console.log('First complaint all keys:', Object.keys(complaints[0]));
      }

      // Explicitly map complaints to ensure imageUrl is included
      // This prevents any potential issues with Mongoose serialization
      const complaintsWithImageUrl = complaints.map((complaint: any) => {
        // Debug each complaint
        const hasImage = !!complaint.imageUrl;
        if (hasImage) {
          console.log(`[Admin API] Complaint ${complaint._id} has imageUrl:`, {
            imageUrl: complaint.imageUrl,
            type: typeof complaint.imageUrl,
            length: complaint.imageUrl?.length,
          });
        }
        
        return {
          _id: complaint._id,
          name: complaint.name,
          email: complaint.email,
          complaintText: complaint.complaintText,
          location: complaint.location,
          imageUrl: complaint.imageUrl || null, // Explicitly include imageUrl, set to null if missing
          category: complaint.category,
          priority: complaint.priority,
          department: complaint.department,
          status: complaint.status,
          isDuplicate: complaint.isDuplicate,
          duplicateOf: complaint.duplicateOf,
          createdAt: complaint.createdAt,
        };
      });

      // Debug log: Check if any complaints have images
      const withImages = complaintsWithImageUrl.filter((c) => c.imageUrl).length;
      console.log(`[Admin API] Returning ${complaintsWithImageUrl.length} complaints, ${withImages} with images`);
      console.log('=== ADMIN API DEBUG END ===');

      return NextResponse.json(
        {
          success: true,
          complaints: complaintsWithImageUrl,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
        { status: 200 }
      );
    } else if (email) {
      // Get complaints by email (for citizens)
      const complaints = await Complaint.find({ email: email.toLowerCase() })
        .sort({ createdAt: -1 })
        .limit(50);

      return NextResponse.json({ success: true, complaints }, { status: 200 });
    }

    return NextResponse.json(
      { error: 'Complaint ID or email required' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error getting complaints:', error);
    return NextResponse.json(
      { error: 'Failed to get complaints', details: error.message },
      { status: 500 }
    );
  }
}

