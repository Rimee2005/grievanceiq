import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Complaint from '@/models/Complaint';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Find all complaints by email, sorted by latest first
    // SECURITY: Only returns complaints matching the provided email address
    // This ensures users can only view complaints submitted from their own email
    const complaints = await Complaint.find({ email: email.toLowerCase() })
      .sort({ createdAt: -1 })
      .lean(); // Use lean() for better performance

    // Map to ensure imageUrl is included in response
    const complaintsWithImageUrl = complaints.map((complaint) => ({
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
    }));

    return NextResponse.json(
      {
        success: true,
        complaints: complaintsWithImageUrl,
        count: complaintsWithImageUrl.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching complaints by email:', error);
    return NextResponse.json(
      { error: 'Failed to fetch complaints', details: error.message },
      { status: 500 }
    );
  }
}

