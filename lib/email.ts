/**
 * Email Notification Utility
 * Sends email notifications to users when complaint status changes
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email notification
 * Uses Nodemailer with SMTP or a service like SendGrid, Resend, etc.
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // Check if email is configured
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD;
    const smtpFrom = process.env.SMTP_FROM || smtpUser || 'noreply@grievanceiq.com';

    // If no SMTP configured, log and return false (don't throw error)
    if (!smtpHost || !smtpUser || !smtpPass) {
      console.log('[Email] ⚠️ SMTP not configured. Email not sent:', {
        to: options.to,
        subject: options.subject,
        hasHost: !!smtpHost,
        hasUser: !!smtpUser,
        hasPass: !!smtpPass,
      });
      console.log('[Email] 📝 To enable emails, add to .env.local:');
      console.log('[Email]    SMTP_HOST=smtp.gmail.com');
      console.log('[Email]    SMTP_PORT=587');
      console.log('[Email]    SMTP_USER=your-email@gmail.com');
      console.log('[Email]    SMTP_PASSWORD=your-app-password');
      return false;
    }

    console.log('[Email] 📧 Attempting to send email...', {
      to: options.to,
      subject: options.subject,
      host: smtpHost,
      port: parseInt(process.env.SMTP_PORT || '587'),
    });

    // Dynamic import of nodemailer (install if needed)
    let nodemailer;
    try {
      nodemailer = await import('nodemailer');
    } catch (error) {
      console.error('[Email] nodemailer not installed. Run: npm install nodemailer');
      return false;
    }

    // Create transporter
    const transporter = nodemailer.default.createTransport({
      host: smtpHost,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      // Additional options for Gmail
      tls: {
        rejectUnauthorized: false, // For development/testing
      },
    });

    // Verify connection before sending
    console.log('[Email] Verifying SMTP connection...');
    try {
      await transporter.verify();
      console.log('[Email] ✅ SMTP connection verified successfully');
    } catch (verifyError: any) {
      console.error('[Email] ❌ SMTP verification failed:', {
        error: verifyError.message,
        code: verifyError.code,
      });
      throw new Error(`SMTP connection failed: ${verifyError.message}`);
    }

    // Send email
    const info = await transporter.sendMail({
      from: `"GrievanceIQ" <${smtpFrom}>`,
      to: options.to,
      subject: options.subject,
      text: options.text || options.html.replace(/<[^>]*>/g, ''), // Plain text version
      html: options.html,
    });

    console.log('[Email] ✅ Email sent successfully:', {
      to: options.to,
      subject: options.subject,
      messageId: info.messageId,
    });

    return true;
  } catch (error: any) {
    console.error('[Email] ❌ Failed to send email:', {
      to: options.to,
      error: error.message,
    });
    // Don't throw - email failure shouldn't break the status update
    return false;
  }
}

/**
 * Send status update notification to user
 */
export async function sendStatusUpdateEmail(
  userEmail: string,
  userName: string,
  complaintId: string,
  oldStatus: string,
  newStatus: string,
  complaintText: string
): Promise<boolean> {
  const statusMessages: Record<string, { subject: string; message: string; color: string }> = {
    Pending: {
      subject: 'Your Complaint is Under Review',
      message: 'Your complaint has been received and is currently under review by our team.',
      color: '#f59e0b', // amber
    },
    'In Progress': {
      subject: 'Your Complaint is Being Processed',
      message: 'Great news! Your complaint is now being actively processed by the relevant department.',
      color: '#3b82f6', // blue
    },
    Resolved: {
      subject: 'Your Complaint Has Been Resolved',
      message: 'We are pleased to inform you that your complaint has been successfully resolved.',
      color: '#10b981', // green
    },
  };

  const statusInfo = statusMessages[newStatus] || {
    subject: 'Complaint Status Updated',
    message: `Your complaint status has been updated to ${newStatus}.`,
    color: '#6b7280',
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; color: white; font-weight: bold; background-color: ${statusInfo.color}; margin: 10px 0; }
        .complaint-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
        .button { display: inline-block; padding: 12px 24px; background: #1e40af; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>GrievanceIQ</h1>
          <p>Complaint Status Update</p>
        </div>
        <div class="content">
          <p>Dear ${userName},</p>
          
          <p>${statusInfo.message}</p>
          
          <div class="status-badge">Status: ${newStatus}</div>
          
          <div class="complaint-box">
            <h3 style="margin-top: 0;">Your Complaint:</h3>
            <p style="white-space: pre-wrap;">${complaintText}</p>
            <p style="font-size: 12px; color: #6b7280; margin-top: 10px;">
              Complaint ID: ${complaintId}
            </p>
          </div>
          
          ${oldStatus !== newStatus ? `<p><strong>Previous Status:</strong> ${oldStatus} → <strong>New Status:</strong> ${newStatus}</p>` : ''}
          
          <p>You can track your complaint status anytime by visiting our website and entering your email address or complaint ID.</p>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track" class="button">Track Your Complaint</a>
          </div>
          
          <p style="margin-top: 30px;">Thank you for using GrievanceIQ. We appreciate your patience.</p>
          
          <p>Best regards,<br>GrievanceIQ Team</p>
        </div>
        <div class="footer">
          <p>This is an automated notification. Please do not reply to this email.</p>
          <p>© ${new Date().getFullYear()} GrievanceIQ. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: userEmail,
    subject: statusInfo.subject,
    html,
  });
}

/**
 * Send complaint submission confirmation email to user
 */
export async function sendComplaintSubmissionEmail(
  userEmail: string,
  userName: string,
  complaintId: string,
  complaintText: string,
  category: string,
  priority: string,
  department: string,
  location?: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .success-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; color: white; font-weight: bold; background-color: #10b981; margin: 10px 0; }
        .complaint-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
        .info-box { background: #eff6ff; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .info-row:last-child { border-bottom: none; }
        .info-label { font-weight: bold; color: #6b7280; }
        .info-value { color: #1f2937; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
        .button { display: inline-block; padding: 12px 24px; background: #1e40af; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>GrievanceIQ</h1>
          <p>Complaint Received</p>
        </div>
        <div class="content">
          <p>Dear ${userName},</p>
          
          <p>Thank you for submitting your complaint through GrievanceIQ. We have successfully received your complaint and it is now in our system.</p>
          
          <div class="success-badge">✅ Complaint Submitted Successfully</div>
          
          <div class="complaint-box">
            <h3 style="margin-top: 0;">Your Complaint Details:</h3>
            <p style="white-space: pre-wrap;">${complaintText}</p>
            ${location ? `<p style="margin-top: 10px;"><strong>Location:</strong> ${location}</p>` : ''}
          </div>
          
          <div class="info-box">
            <div class="info-row">
              <span class="info-label">Complaint ID:</span>
              <span class="info-value">${complaintId}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Category:</span>
              <span class="info-value">${category}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Priority:</span>
              <span class="info-value">${priority}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Assigned Department:</span>
              <span class="info-value">${department}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Status:</span>
              <span class="info-value">Pending</span>
            </div>
            <div class="info-row">
              <span class="info-label">Submitted:</span>
              <span class="info-value">${new Date().toLocaleString()}</span>
            </div>
          </div>
          
          <p><strong>What happens next?</strong></p>
          <ul>
            <li>Your complaint has been assigned to the <strong>${department}</strong></li>
            <li>Our team will review your complaint and take appropriate action</li>
            <li>You will receive email updates when the status changes</li>
            <li>You can track your complaint anytime using your email or Complaint ID</li>
          </ul>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track" class="button">Track Your Complaint</a>
          </div>
          
          <p style="margin-top: 30px;">We appreciate your patience and will keep you informed of any updates.</p>
          
          <p>Best regards,<br>GrievanceIQ Team</p>
        </div>
        <div class="footer">
          <p>This is an automated confirmation email. Please save this email for your records.</p>
          <p>© ${new Date().getFullYear()} GrievanceIQ. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: userEmail,
    subject: 'Complaint Submitted Successfully - GrievanceIQ',
    html,
  });
}

