import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { verifyToken } from '@/lib/auth';
import { getTokenFromRequest } from '@/lib/auth';

/**
 * Test email endpoint - Admin only
 * POST with { to: "email@example.com" } to test email sending
 */
export async function POST(request: NextRequest) {
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

    const { to } = await request.json();

    if (!to) {
      return NextResponse.json({ error: 'Email address (to) is required' }, { status: 400 });
    }

    console.log('[Test Email] Sending test email to:', to);

    const success = await sendEmail({
      to,
      subject: 'Test Email from GrievanceIQ',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>GrievanceIQ</h1>
              <p>Test Email</p>
            </div>
            <div class="content">
              <p>This is a test email from GrievanceIQ.</p>
              <p>If you received this email, your SMTP configuration is working correctly! ✅</p>
              <p>Time: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (success) {
      return NextResponse.json(
        { success: true, message: 'Test email sent successfully! Check your inbox.' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: 'Email not sent. Check server logs and SMTP configuration.' },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error('[Test Email] Error:', error);
    return NextResponse.json(
      { error: 'Failed to send test email', details: error.message },
      { status: 500 }
    );
  }
}

