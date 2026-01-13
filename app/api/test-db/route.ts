import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Complaint from '@/models/Complaint';

export async function GET(request: NextRequest) {
  try {
    console.log('[Test DB] 🔍 Testing MongoDB connection...');
    
    // Connect to database
    await connectDB();
    console.log('[Test DB] ✅ Connected to MongoDB');

    // Count total complaints
    const totalComplaints = await Complaint.countDocuments();
    console.log('[Test DB] 📊 Total complaints in database:', totalComplaints);

    // Get sample complaints
    const sampleComplaints = await Complaint.find().limit(5).lean();
    console.log('[Test DB] 📋 Sample complaints:', sampleComplaints.length);

    // Get database stats
    const dbStats = {
      totalComplaints,
      sampleComplaints: sampleComplaints.map((c: any) => ({
        id: c._id,
        name: c.name,
        email: c.email,
        category: c.category,
        status: c.status,
        createdAt: c.createdAt,
        hasImage: !!c.imageUrl,
      })),
    };

    return NextResponse.json(
      {
        success: true,
        message: 'MongoDB connection successful',
        ...dbStats,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Test DB] ❌ Error:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
    });

    return NextResponse.json(
      {
        success: false,
        error: 'MongoDB connection failed',
        details: error.message,
        code: error.code,
      },
      { status: 500 }
    );
  }
}

