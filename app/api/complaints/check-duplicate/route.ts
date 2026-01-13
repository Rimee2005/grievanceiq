import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Complaint from '@/models/Complaint';
import { calculateSimilarity } from '@/lib/ai-processor';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { text, email, category, location } = await request.json();

    if (!text || !email) {
      return NextResponse.json(
        { error: 'Text and email are required' },
        { status: 400 }
      );
    }

    // Find recent complaints from same email
    const recentComplaints = await Complaint.find({
      email: email.toLowerCase(),
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // Last 7 days
    })
      .sort({ createdAt: -1 })
      .limit(10);

    let isDuplicate = false;
    let duplicateOf: string | null = null;
    let maxSimilarity = 0;

    for (const recentComplaint of recentComplaints) {
      const similarity = calculateSimilarity(text, recentComplaint.complaintText);
      
      if (similarity > maxSimilarity) {
        maxSimilarity = similarity;
      }

      // If similarity is high and same category, mark as duplicate
      if (similarity > 0.6 && (!category || recentComplaint.category === category)) {
        // Also check location if provided
        if (!location || !recentComplaint.location || 
            location.toLowerCase() === recentComplaint.location.toLowerCase()) {
          isDuplicate = true;
          duplicateOf = recentComplaint._id.toString();
          break;
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        isDuplicate,
        duplicateOf,
        similarity: maxSimilarity,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error checking duplicate:', error);
    return NextResponse.json(
      { error: 'Failed to check duplicate', details: error.message },
      { status: 500 }
    );
  }
}

