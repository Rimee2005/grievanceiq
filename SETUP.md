# Quick Setup Guide

## Prerequisites

- Node.js 18+ installed
- MongoDB running (local or cloud)
- npm or yarn package manager

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local` file:

```env
MONGODB_URI=mongodb://localhost:27017/grievanceiq
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Optional (for Cloudinary image uploads):**
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Optional (for Email Notifications):**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@grievanceiq.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Email Setup Options:**
- **Gmail**: Use App Password (not regular password). Enable 2FA, then generate App Password.
- **SendGrid**: Use `smtp.sendgrid.net` with port 587
- **Resend**: Use their SMTP settings
- **Mailgun**: Use their SMTP settings
- **Other SMTP**: Use your provider's SMTP settings

### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
# If MongoDB is installed locally, just start the service
mongod
```

**Option B: Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

**Option C: MongoDB Atlas (Cloud)**
- Create a free cluster at https://www.mongodb.com/cloud/atlas
- Get connection string and update `MONGODB_URI`

### 4. Run Development Server

```bash
npm run dev
```

### 5. Access the Application

- **Home**: http://localhost:3000
- **Submit Complaint**: http://localhost:3000/submit
- **Track Complaint**: http://localhost:3000/track
- **Admin Login**: http://localhost:3000/admin/login

### 6. Create Admin Account

1. Go to `/admin/login`
2. Click "Register" (or use existing account)
3. Fill in details (make sure role is "Admin")
4. Login and access the dashboard

## Testing the System

### Test Complaint Submission

1. Go to `/submit`
2. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Complaint: "There is a huge pothole on Main Street causing accidents. This is urgent!"
   - Location: Main Street, City
   - (Optional) Upload an image
3. Submit and note the Complaint ID

### Test Tracking

1. Go to `/track`
2. Enter the Complaint ID or email
3. View the complaint details and status

### Test Admin Dashboard

1. Login as admin
2. View dashboard with KPIs
3. Go to "All Complaints" to see the submitted complaint
4. Update status, view images, filter complaints
5. Check "Analytics" for charts and insights

## Image Upload Notes

- **Development**: Images are stored as base64 data URLs (works for demo)
- **Production**: Configure Cloudinary for proper image storage
- **File Size**: Max 5MB per image
- **Formats**: JPG, PNG, JPEG

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env.local`
- Verify MongoDB port (default: 27017)

### Image Upload Issues
- For local development, base64 storage works but has size limits
- For production, set up Cloudinary account and configure credentials

### Authentication Errors
- Clear browser localStorage if token issues occur
- Re-login if admin access is denied

### Build Errors
- Delete `node_modules` and `.next` folder
- Run `npm install` again
- Run `npm run dev`

## Production Deployment

1. Set proper environment variables
2. Configure Cloudinary for image storage
3. Use a production MongoDB instance
4. Set a strong `JWT_SECRET`
5. Build: `npm run build`
6. Start: `npm start`

## Support

For issues or questions, check the main README.md file.

