import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Complaint from '@/models/Complaint';
import { verifyToken } from '@/lib/auth';
import { getTokenFromRequest } from '@/lib/auth';

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

    // Get all complaints for analytics
    const complaints = await Complaint.find({});

    // Calculate statistics
    const totalComplaints = complaints.length;
    const highPriority = complaints.filter((c) => c.priority === 'High').length;
    const withImages = complaints.filter((c) => c.imageUrl).length;
    const duplicates = complaints.filter((c) => c.isDuplicate).length;
    const pending = complaints.filter((c) => c.status === 'Pending').length;
    const resolved = complaints.filter((c) => c.status === 'Resolved').length;

    // Complaints by category
    const categoryCounts: Record<string, number> = {};
    complaints.forEach((c) => {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });

    // Priority distribution
    const priorityCounts: Record<string, number> = {};
    complaints.forEach((c) => {
      priorityCounts[c.priority] = (priorityCounts[c.priority] || 0) + 1;
    });

    // Resolution status
    const statusCounts: Record<string, number> = {};
    complaints.forEach((c) => {
      statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
    });

    // Image vs no image
    const imageStats = {
      withImage: withImages,
      withoutImage: totalComplaints - withImages,
    };

    // Duplicate vs unique
    const duplicateStats = {
      duplicates: duplicates,
      unique: totalComplaints - duplicates,
    };

    return NextResponse.json(
      {
        success: true,
        analytics: {
          kpis: {
            totalComplaints,
            highPriority,
            withImages,
            duplicates,
            pending,
            resolved,
          },
          categoryCounts,
          priorityCounts,
          statusCounts,
          imageStats,
          duplicateStats,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error getting analytics:', error);
    return NextResponse.json(
      { error: 'Failed to get analytics', details: error.message },
      { status: 500 }
    );
  }
}

