import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Complaint from '@/models/Complaint';
import { verifyToken } from '@/lib/auth';
import { getTokenFromRequest } from '@/lib/auth';

/**
 * Debug endpoint to check image storage in database
 * Only accessible by admins
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const token = getTokenFromRequest(request.headers);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'Admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    await connectDB();

    // Get all complaints with detailed image info
    const allComplaints = await Complaint.find({}).lean();
    
    const debugInfo = {
      totalComplaints: allComplaints.length,
      complaintsWithImageUrl: allComplaints.filter((c: any) => c.imageUrl).length,
      complaintsWithoutImageUrl: allComplaints.filter((c: any) => !c.imageUrl).length,
      sampleComplaints: allComplaints.slice(0, 5).map((c: any) => ({
        _id: c._id,
        hasImageUrl: !!c.imageUrl,
        imageUrlType: typeof c.imageUrl,
        imageUrlValue: c.imageUrl,
        imageUrlLength: c.imageUrl?.length || 0,
        imageUrlPreview: c.imageUrl ? c.imageUrl.substring(0, 100) : null,
        allFields: Object.keys(c),
      })),
      complaintsWithImages: allComplaints
        .filter((c: any) => c.imageUrl)
        .slice(0, 3)
        .map((c: any) => ({
          _id: c._id,
          imageUrl: c.imageUrl,
          imageUrlType: typeof c.imageUrl,
        })),
    };

    return NextResponse.json({ success: true, debug: debugInfo }, { status: 200 });
  } catch (error: any) {
    console.error('Error in debug endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to get debug info', details: error.message },
      { status: 500 }
    );
  }
}

