# GrievanceIQ - AI-Powered Grievance Redressal System

An intelligent complaint management system that automatically classifies, prioritizes, and routes citizen grievances using rule-based AI/NLP processing.

## 🚀 Features

### Citizen Interface
- **Home Page**: Hero section with workflow explanation
- **Submit Complaint**: Form with image upload support
- **Track Complaint**: Search by ID or email to view status

### Admin Dashboard
- **Dashboard Overview**: KPI cards with key metrics
- **All Complaints**: Filterable table with status management
- **High Priority**: View urgent complaints
- **Duplicate Detection**: Identify and manage duplicate complaints
- **Analytics**: Charts and visualizations for insights

### AI/NLP Processing
- **Category Classification**: Automatically categorizes complaints (Infrastructure, Sanitation, Healthcare, etc.)
- **Priority Assignment**: High/Medium/Low based on keywords and sentiment
- **Department Mapping**: Routes to appropriate department
- **Duplicate Detection**: Identifies similar complaints using keyword matching
- **Image Priority Boost**: Attached images increase priority level

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Notifications**: React Hot Toast
- **Authentication**: JWT with bcrypt

## 📦 Installation

1. **Clone the repository**
   ```bash
   cd GrievanceIQ
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/grievanceiq
   JWT_SECRET=your-secret-key-change-in-production
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system. If using Docker:
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Admin Access

1. Navigate to `/admin/login`
2. Register a new admin account (or login if already exists)
3. Use the admin dashboard to manage complaints

## 📁 Project Structure

```
GrievanceIQ/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication routes
│   │   ├── complaints/     # Complaint CRUD operations
│   │   └── analytics/      # Analytics endpoint
│   ├── admin/              # Admin dashboard pages
│   ├── submit/             # Submit complaint page
│   ├── track/              # Track complaint page
│   └── page.tsx            # Home page
├── components/             # Reusable UI components
├── lib/                    # Utilities (AI processor, auth, image upload)
├── models/                 # MongoDB schemas
└── public/                 # Static assets
```

## 🧠 AI Processing Logic

### Category Classification
Uses keyword matching to classify complaints into:
- Infrastructure
- Sanitation
- Healthcare
- Education
- Public Safety
- Utilities
- Administrative Delay

### Priority Assignment
- **High**: Contains emergency/danger keywords or very negative sentiment
- **Medium**: Default priority
- **Low**: Contains suggestion/inquiry keywords
- **Image Boost**: Attached images increase priority by one level

### Duplicate Detection
- Compares new complaints with recent complaints (last 7 days)
- Uses Jaccard similarity on extracted keywords
- Considers category and location matching
- Similarity threshold: 0.6

## 🖼️ Image Handling

- Supports JPG, PNG, JPEG formats
- Max file size: 5MB
- Can use Cloudinary (production) or local storage (development)
- Image preview with zoom functionality
- Download capability for admins

## 📊 API Endpoints

- `POST /api/complaints/create` - Create new complaint
- `POST /api/complaints/analyze` - Analyze complaint text
- `POST /api/complaints/check-duplicate` - Check for duplicates
- `GET /api/complaints/get` - Get complaints (with filters)
- `PATCH /api/complaints/update-status` - Update complaint status
- `GET /api/analytics` - Get analytics data
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

## 🎨 UI Features

- Responsive design (mobile + desktop)
- Modern, clean government-grade UI
- Color-coded badges for status, priority, category
- Image modal with zoom and download
- Toast notifications for user feedback
- Loading states and form validation

## 🔄 Status Workflow

1. **Pending**: Newly submitted complaint
2. **In Progress**: Complaint is being processed
3. **Resolved**: Complaint has been resolved

## 🌐 Multilingual Support

The AI processor supports both English and Hindi keywords for classification and sentiment analysis.

## 🚧 Future Enhancements

- Email notifications for status changes
- SMS alerts for high-priority complaints
- Advanced ML-based classification
- Real-time chat support
- Mobile app integration
- Advanced analytics and reporting

## 📝 License

This project is open source and available for public governance use.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ for transparent and efficient public governance**

