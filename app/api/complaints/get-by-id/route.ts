import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Complaint from '@/models/Complaint';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const complaintId = searchParams.get('id');

    if (!complaintId) {
      return NextResponse.json(
        { error: 'Complaint ID is required' },
        { status: 400 }
      );
    }

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(complaintId)) {
      return NextResponse.json(
        { error: 'Invalid complaint ID format' },
        { status: 400 }
      );
    }

    // Find complaint by ID
    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      );
    }

    // Return full complaint details including imageUrl
    return NextResponse.json(
      {
        success: true,
        complaint: {
          _id: complaint._id,
          name: complaint.name,
          email: complaint.email,
          complaintText: complaint.complaintText,
          location: complaint.location,
          imageUrl: complaint.imageUrl,
          category: complaint.category,
          priority: complaint.priority,
          department: complaint.department,
          status: complaint.status,
          isDuplicate: complaint.isDuplicate,
          duplicateOf: complaint.duplicateOf,
          createdAt: complaint.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching complaint by ID:', error);
    return NextResponse.json(
      { error: 'Failed to fetch complaint', details: error.message },
      { status: 500 }
    );
  }
}

