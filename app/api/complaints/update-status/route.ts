import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Complaint from '@/models/Complaint';
import { verifyToken } from '@/lib/auth';
import { getTokenFromRequest } from '@/lib/auth';
import { sendStatusUpdateEmail } from '@/lib/email';

export async function PATCH(request: NextRequest) {
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

    const { complaintId, status } = await request.json();

    if (!complaintId || !status) {
      return NextResponse.json(
        { error: 'Complaint ID and status are required' },
        { status: 400 }
      );
    }

    if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Get the complaint first to check old status
    const oldComplaint = await Complaint.findById(complaintId);
    if (!oldComplaint) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    const oldStatus = oldComplaint.status;

    // Update the complaint
    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { status },
      { new: true }
    );

    if (!complaint) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    // Send email notification if status changed
    if (oldStatus !== status) {
      console.log('[Status Update] 📧 Preparing to send email notification...', {
        email: complaint.email,
        name: complaint.name,
        complaintId: complaint._id.toString(),
        oldStatus,
        newStatus: status,
      });

      // Send email asynchronously (don't wait for it)
      sendStatusUpdateEmail(
        complaint.email,
        complaint.name,
        complaint._id.toString(),
        oldStatus,
        status,
        complaint.complaintText
      )
        .then((success) => {
          if (success) {
            console.log('[Status Update] ✅ Email notification sent successfully to:', complaint.email);
          } else {
            console.log('[Status Update] ⚠️ Email notification not sent (check SMTP configuration)');
          }
        })
        .catch((error) => {
          console.error('[Status Update] ❌ Email notification failed:', {
            error: error.message,
            stack: error.stack,
          });
          // Don't fail the request if email fails
        });
    } else {
      console.log('[Status Update] Status unchanged, skipping email notification');
    }

    return NextResponse.json(
      { success: true, complaint },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating status:', error);
    return NextResponse.json(
      { error: 'Failed to update status', details: error.message },
      { status: 500 }
    );
  }
}

