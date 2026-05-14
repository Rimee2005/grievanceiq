# GrievanceIQ - AI-Powered Grievance Redressal System

<div align="center">

![GrievanceIQ](https://img.shields.io/badge/GrievanceIQ-AI%20Powered-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

**An intelligent complaint management system that automatically classifies, prioritizes, and routes citizen grievances using rule-based AI/NLP processing.**

[Features](#-features) • [Installation](#-installation) • [Documentation](#-documentation) • [API Reference](#-api-reference) • [Deployment](#-deployment)

</div>

# Deployed Link: https://grievanceiq.vercel.app/

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Features Breakdown](#-features-breakdown)
- [Usage Guide](#-usage-guide)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

GrievanceIQ is a comprehensive grievance management platform designed for government agencies and public service organizations. It streamlines the complaint handling process by:

- **Automatically classifying** complaints into relevant categories
- **Intelligently prioritizing** based on urgency and content analysis
- **Detecting duplicates** to prevent redundant processing
- **Routing complaints** to appropriate departments
- **Providing analytics** for data-driven decision making

The system uses rule-based AI/NLP processing to analyze complaint text, extract keywords, assess sentiment, and make intelligent routing decisions without requiring expensive ML models.

---

## ✨ Features

### 👥 Citizen Interface

- **🏠 Home Page**: Clean, informative landing page with workflow explanation
- **📝 Submit Complaint**: 
  - User-friendly complaint submission form
  - Image upload support (JPG, PNG, JPEG)
  - Real-time form validation
  - Automatic complaint ID generation
  - Email confirmation on submission
- **🔍 Track Complaint**: 
  - Search by Complaint ID or Email
  - View complaint status and details
  - See assigned department and priority
  - Track resolution progress

### 👨‍💼 Admin Dashboard

- **📊 Dashboard Overview**: 
  - KPI cards showing key metrics
  - Total complaints, high priority count
  - Complaints with images, duplicates
  - Pending and resolved statistics
- **📋 All Complaints**: 
  - Comprehensive filterable table
  - Filter by category, priority, status, images, duplicates
  - Update complaint status
  - View and download complaint images
  - Responsive design (mobile + desktop)
- **🔴 High Priority**: Dedicated view for urgent complaints
- **🔄 Duplicate Detection**: Identify and manage duplicate complaints
- **📈 Analytics**: 
  - Visual charts and graphs
  - Category distribution
  - Priority breakdown
  - Status trends
  - Image statistics

### 🤖 AI/NLP Processing

- **📂 Category Classification**: Automatically categorizes complaints into:
  - Infrastructure
  - Sanitation
  - Healthcare
  - Education
  - Public Safety
  - Utilities
  - Administrative Delay

- **⚡ Priority Assignment**: 
  - **High**: Emergency keywords, danger indicators, very negative sentiment
  - **Medium**: Default priority for standard complaints
  - **Low**: Suggestions, inquiries, informational requests
  - **Image Boost**: Attached images automatically increase priority

- **🎯 Department Mapping**: Routes complaints to appropriate departments:
  - Municipal Department
  - Health Department
  - Education Department
  - Police Department
  - Utilities Department
  - Administrative Department

- **🔍 Duplicate Detection**: 
  - Compares with complaints from last 7 days
  - Uses Jaccard similarity on keywords
  - Considers category and location matching
  - Similarity threshold: 0.6

### 🎨 UI/UX Features

- **🌓 Dark/Light Mode**: Toggle between themes
- **🌐 Multilingual Support**: English and Hindi language support
- **📱 Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **🎨 Modern UI**: Clean, government-grade interface
- **🏷️ Color-Coded Badges**: Visual indicators for status, priority, category
- **🖼️ Image Modal**: Zoom and download functionality for complaint images
- **🔔 Toast Notifications**: Real-time user feedback
- **⏳ Loading States**: Smooth loading indicators
- **✅ Form Validation**: Client and server-side validation

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Notifications**: React Hot Toast
- **Icons**: SVG-based custom icons

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcrypt
- **Email**: Nodemailer with SMTP

### Services & Integrations
- **Image Storage**: Cloudinary (production) / Base64 (development)
- **Database**: MongoDB Atlas (cloud) or Local MongoDB
- **Email Service**: SMTP (Gmail, SendGrid, etc.)

### Development Tools
- **Language**: TypeScript
- **Linting**: ESLint with Next.js config
- **Package Manager**: npm

---

## 📦 Installation

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** (for cloning the repository)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd grievanceiq
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- Next.js and React
- MongoDB and Mongoose
- Authentication libraries
- UI components and utilities

### Step 3: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local  # If you have an example file
# Or create .env.local manually
```

**Important**: The file must be named `.env.local` (with a dot at the beginning) for Next.js to load it automatically.

### Step 4: Configure MongoDB

Choose one of the following options:

#### Option A: MongoDB Atlas (Recommended for Production)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Add your IP address to the whitelist
5. Update `MONGODB_URI` in `.env.local`

#### Option B: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service:
   ```bash
   mongod
   ```
3. Use connection string: `mongodb://localhost:27017/grievanceiq`

#### Option C: Docker

```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

### Step 5: Run Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Step 6: Create Admin Account

1. Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Click "Register" or use the toggle to switch to registration
3. Fill in:
   - Name
   - Email
   - Password
   - Role: Admin (should be pre-selected)
4. Click "Register"
5. You'll be automatically logged in and redirected to the admin dashboard

---

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

#### Required Variables

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/grievanceiq
# OR for local: mongodb://localhost:27017/grievanceiq

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

#### Optional Variables

```env
# Cloudinary (for image uploads in production)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@grievanceiq.com
NEXT_PUBLIC_APP_URL=http://localhost:3000

# App Configuration
appName=Cluster0
```

### Email Setup

#### Gmail Setup
1. Enable 2-Factor Authentication
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App Passwords
   - Generate password for "Mail"
3. Use the app password in `SMTP_PASSWORD`

#### Other SMTP Providers
- **SendGrid**: `smtp.sendgrid.net:587`
- **Resend**: Use their SMTP settings
- **Mailgun**: Use their SMTP settings
- **Custom SMTP**: Use your provider's settings

### Image Upload Configuration

#### Development Mode
- Images are stored as base64 data URLs
- No additional configuration needed
- Limited by MongoDB document size (16MB)

#### Production Mode
1. Create a Cloudinary account
2. Get your cloud name, API key, and API secret
3. Add them to `.env.local`
4. Images will be uploaded to Cloudinary

---

## 📁 Project Structure

```
grievanceiq/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin dashboard pages
│   │   ├── analytics/            # Analytics page
│   │   ├── complaints/           # All complaints page
│   │   ├── duplicates/           # Duplicate complaints page
│   │   ├── priority/             # High priority complaints page
│   │   ├── login/                # Admin login/register page
│   │   ├── layout.tsx            # Admin layout with sidebar
│   │   └── page.tsx              # Admin dashboard home
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── login/           # POST /api/auth/login
│   │   │   └── register/        # POST /api/auth/register
│   │   ├── complaints/           # Complaint endpoints
│   │   │   ├── create/          # POST /api/complaints/create
│   │   │   ├── get/             # GET /api/complaints/get
│   │   │   ├── get-by-id/       # GET /api/complaints/get-by-id
│   │   │   ├── get-by-email/    # GET /api/complaints/get-by-email
│   │   │   ├── update-status/   # PATCH /api/complaints/update-status
│   │   │   ├── analyze/         # POST /api/complaints/analyze
│   │   │   └── check-duplicate/ # POST /api/complaints/check-duplicate
│   │   ├── analytics/            # GET /api/analytics
│   │   ├── test-db/              # GET /api/test-db (database test)
│   │   └── test-email/          # POST /api/test-email (email test)
│   ├── submit/                   # Submit complaint page
│   ├── track/                     # Track complaint page
│   ├── contact/                   # Contact page
│   ├── help/                      # Help page
│   ├── privacy/                   # Privacy policy page
│   ├── terms/                     # Terms of service page
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   └── globals.css                # Global styles
├── components/                    # Reusable React components
│   ├── Navbar.tsx                # Navigation bar
│   ├── Footer.tsx                # Footer component
│   ├── Sidebar.tsx               # Admin sidebar
│   ├── StatusBadge.tsx           # Status badge component
│   ├── PriorityBadge.tsx         # Priority badge component
│   ├── CategoryBadge.tsx         # Category badge component
│   ├── ImageModal.tsx            # Image viewer modal
│   └── ChatButton.tsx            # Chat/help button
├── contexts/                      # React contexts
│   ├── LanguageContext.tsx       # Language/i18n context
│   └── ThemeContext.tsx           # Theme (dark/light) context
├── lib/                           # Utility libraries
│   ├── mongodb.ts                # MongoDB connection
│   ├── auth.ts                   # Authentication utilities
│   ├── ai-processor.ts            # AI/NLP processing logic
│   ├── image-upload.ts           # Image upload handlers
│   ├── email.ts                  # Email sending utilities
│   └── translator.ts             # Translation utilities
├── models/                        # MongoDB schemas
│   ├── Complaint.ts              # Complaint model
│   └── User.ts                   # User model
├── public/                        # Static assets
├── .env.local                     # Environment variables (not in git)
├── .gitignore                     # Git ignore file
├── next.config.js                 # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies and scripts
└── README.md                      # This file
```

---

## 📡 API Reference

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "Admin" | "Citizen"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Admin"
  },
  "token": "jwt_token_here"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Admin"
  },
  "token": "jwt_token_here"
}
```

### Complaint Endpoints

#### Create Complaint
```http
POST /api/complaints/create
Content-Type: multipart/form-data

Form Data:
- name: string
- email: string
- complaintText: string
- location: string (optional)
- image: File (optional, max 5MB)
```

**Response:**
```json
{
  "success": true,
  "complaint": {
    "id": "complaint_id",
    "category": "Infrastructure",
    "priority": "High",
    "department": "Municipal Department",
    "isDuplicate": false
  }
}
```

#### Get Complaints
```http
GET /api/complaints/get?admin=true&category=Infrastructure&priority=High&status=Pending&hasImage=true&isDuplicate=false&page=1&limit=50
Authorization: Bearer <token>
```

**Query Parameters:**
- `admin`: boolean (required for admin access)
- `category`: string (optional filter)
- `priority`: string (optional filter)
- `status`: string (optional filter)
- `hasImage`: boolean (optional filter)
- `isDuplicate`: boolean (optional filter)
- `page`: number (pagination)
- `limit`: number (items per page)

**Response:**
```json
{
  "success": true,
  "complaints": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "pages": 2
  }
}
```

#### Get Complaint by ID
```http
GET /api/complaints/get-by-id?id=complaint_id&email=user@example.com
```

#### Update Complaint Status
```http
PATCH /api/complaints/update-status
Authorization: Bearer <token>
Content-Type: application/json

{
  "complaintId": "complaint_id",
  "status": "In Progress" | "Resolved"
}
```

#### Analyze Complaint
```http
POST /api/complaints/analyze
Content-Type: application/json

{
  "complaintText": "There is a huge pothole...",
  "hasImage": false
}
```

**Response:**
```json
{
  "category": "Infrastructure",
  "priority": "High",
  "department": "Municipal Department"
}
```

#### Check for Duplicates
```http
POST /api/complaints/check-duplicate
Content-Type: application/json

{
  "email": "user@example.com",
  "complaintText": "Complaint text...",
  "category": "Infrastructure",
  "location": "Main Street"
}
```

### Analytics Endpoint

#### Get Analytics
```http
GET /api/analytics
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "analytics": {
    "kpis": {
      "totalComplaints": 100,
      "highPriority": 25,
      "withImages": 40,
      "duplicates": 10,
      "pending": 50,
      "resolved": 30
    },
    "categoryCounts": {...},
    "priorityCounts": {...},
    "statusCounts": {...},
    "imageStats": {...},
    "duplicateStats": {...}
  }
}
```

### Utility Endpoints

#### Test Database Connection
```http
GET /api/test-db
```

#### Test Email
```http
POST /api/test-email
Content-Type: application/json

{
  "to": "test@example.com",
  "subject": "Test Email",
  "text": "This is a test email"
}
```

---

## 🎯 Features Breakdown

### AI Processing Logic

#### Category Classification

The system uses keyword matching to classify complaints:

- **Infrastructure**: road, bridge, building, construction, repair, pothole, street
- **Sanitation**: garbage, waste, cleaning, trash, dump, sewage
- **Healthcare**: hospital, clinic, doctor, medicine, health, medical
- **Education**: school, teacher, student, education, learning
- **Public Safety**: crime, police, safety, security, emergency
- **Utilities**: water, electricity, power, supply, connection
- **Administrative Delay**: delay, pending, waiting, process, document

#### Priority Assignment

- **High Priority**:
  - Emergency keywords: urgent, emergency, critical, immediate
  - Danger keywords: accident, danger, risk, hazard
  - Very negative sentiment
  - Complaints with images (automatic boost)

- **Medium Priority**: Default for standard complaints

- **Low Priority**:
  - Suggestion keywords: suggest, recommend, idea
  - Inquiry keywords: question, information, query

#### Duplicate Detection Algorithm

1. Fetches recent complaints (last 7 days) from the same email
2. Extracts keywords from complaint text
3. Calculates Jaccard similarity between keyword sets
4. Checks category and location matching
5. Marks as duplicate if similarity > 0.6 and category/location match

### Status Workflow

1. **Pending**: Newly submitted complaint, awaiting review
2. **In Progress**: Complaint is being processed by the department
3. **Resolved**: Complaint has been resolved and closed

---

## 📖 Usage Guide

### For Citizens

#### Submitting a Complaint

1. Navigate to the "Submit Complaint" page
2. Fill in your details:
   - Name
   - Email (for tracking)
   - Complaint description (be specific)
   - Location (optional but helpful)
3. Upload an image if available (helps with priority)
4. Submit the form
5. Save your Complaint ID for tracking

#### Tracking a Complaint

1. Go to the "Track Complaint" page
2. Enter either:
   - Your Complaint ID, OR
   - Your email address
3. View your complaint status and updates

### For Administrators

#### Dashboard Overview

- View key metrics at a glance
- Monitor high-priority complaints
- Track resolution rates

#### Managing Complaints

1. Go to "All Complaints"
2. Use filters to find specific complaints:
   - Filter by category, priority, status
   - Filter by images or duplicates
3. Update complaint status as you process them
4. View and download complaint images
5. Identify and manage duplicate complaints

#### Analytics

- View category distribution
- Analyze priority trends
- Monitor resolution statistics
- Track image usage

---

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables for Production

Ensure all environment variables are set in your hosting platform:

- **Vercel**: Add in Project Settings → Environment Variables
- **Netlify**: Add in Site Settings → Environment Variables
- **Other Platforms**: Use their respective environment variable configuration

### MongoDB Atlas Setup

1. Create a production cluster
2. Set up database user with appropriate permissions
3. Configure IP whitelist (add your server IPs)
4. Update `MONGODB_URI` with production credentials

### Cloudinary Setup

1. Create a Cloudinary account
2. Get your cloud name, API key, and secret
3. Add to environment variables
4. Images will automatically upload to Cloudinary

### Recommended Hosting Platforms

- **Vercel** (Recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **DigitalOcean App Platform**
- **Railway**

---

## 🔧 Troubleshooting

### MongoDB Connection Issues

**Problem**: Cannot connect to MongoDB

**Solutions**:
1. Verify `MONGODB_URI` in `.env.local` is correct
2. For Atlas: Check IP whitelist includes your IP
3. For local: Ensure MongoDB service is running
4. Restart the dev server after changing `.env.local`
5. Check server logs for connection errors

**Test Connection**:
```bash
# Visit in browser
http://localhost:3000/api/test-db
```

### Environment Variables Not Loading

**Problem**: App connects to localhost instead of Atlas

**Solutions**:
1. Ensure file is named `.env.local` (with dot at beginning)
2. Restart dev server after changing environment variables
3. Check for typos in variable names
4. Verify file is in project root directory

### Image Upload Issues

**Problem**: Images not uploading or displaying

**Solutions**:
1. Check file size (max 5MB)
2. Verify file format (JPG, PNG, JPEG)
3. For production: Configure Cloudinary credentials
4. Check browser console for errors
5. Verify image URL in database

### Authentication Errors

**Problem**: Cannot login or access admin dashboard

**Solutions**:
1. Clear browser localStorage
2. Clear cookies
3. Verify JWT_SECRET is set
4. Check token expiration
5. Re-login if token is invalid

### Build Errors

**Problem**: `npm run build` fails

**Solutions**:
1. Delete `node_modules` and `.next` folder
2. Run `npm install` again
3. Check for TypeScript errors
4. Verify all environment variables are set
5. Check Next.js version compatibility

### Data Not Showing in Database

**Problem**: Data appears in Compass but not in Atlas (or vice versa)

**Solutions**:
1. Verify both are connected to the same database
2. Check connection strings match
3. Ensure `.env.local` has correct Atlas URI
4. Restart dev server after fixing connection string
5. Check database name matches in both connections

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**:
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. **Push to the branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed
- Follow the existing code style

---

## 📝 License

This project is open source and available for public governance use.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Database powered by [MongoDB](https://www.mongodb.com/)
- Icons and UI components custom-built

---

## 📞 Support

For issues, questions, or contributions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review existing issues on GitHub
3. Create a new issue with detailed information
4. Contact the development team

---

<div align="center">

**Built with ❤️ for transparent and efficient public governance**

[⬆ Back to Top](#grievanceiq---ai-powered-grievance-redressal-system)

</div>
