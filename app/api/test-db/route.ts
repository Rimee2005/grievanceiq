import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Complaint from '@/models/Complaint';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    console.log('[Test DB] 🔍 Testing MongoDB connection...');
    
    // Connect to database
    await connectDB();
    console.log('[Test DB] ✅ Connected to MongoDB');

    // Count total complaints
    const totalComplaints = await Complaint.countDocuments();
    console.log('[Test DB] 📊 Total complaints in database:', totalComplaints);

    // Count total users
    const totalUsers = await User.countDocuments();
    console.log('[Test DB] 👥 Total users in database:', totalUsers);

    // Get sample complaints
    const sampleComplaints = await Complaint.find().limit(5).sort({ createdAt: -1 }).lean();
    console.log('[Test DB] 📋 Sample complaints:', sampleComplaints.length);

    // Get sample users
    const sampleUsers = await User.find().limit(5).sort({ createdAt: -1 }).lean();
    console.log('[Test DB] 👤 Sample users:', sampleUsers.length);

    // Get users by role
    const adminUsers = await User.countDocuments({ role: 'Admin' });
    const citizenUsers = await User.countDocuments({ role: 'Citizen' });

    // Get complaints by status
    const pendingComplaints = await Complaint.countDocuments({ status: 'Pending' });
    const inProgressComplaints = await Complaint.countDocuments({ status: 'In Progress' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'Resolved' });

    // Get connection details
    const envUri = process.env.MONGODB_URI;
    const connectionDetails = {
      dbName: mongoose.connection.name,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      readyState: mongoose.connection.readyState,
      // Get the actual connection URI (masked)
      uri: envUri ? envUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') : 'NOT SET - Using fallback (localhost)',
      envVarLoaded: !!envUri,
      isAtlas: envUri?.includes('mongodb.net') || false,
      isLocal: mongoose.connection.host === 'localhost' || mongoose.connection.host === '127.0.0.1',
    };

    // Get database stats
    const dbStats = {
      connection: 'success',
      connectionDetails,
      database: {
        totalComplaints,
        totalUsers,
        complaintsByStatus: {
          pending: pendingComplaints,
          inProgress: inProgressComplaints,
          resolved: resolvedComplaints,
        },
        usersByRole: {
          admin: adminUsers,
          citizen: citizenUsers,
        },
      },
      sampleComplaints: sampleComplaints.map((c: any) => ({
        id: c._id,
        name: c.name,
        email: c.email,
        category: c.category,
        priority: c.priority,
        status: c.status,
        createdAt: c.createdAt,
        hasImage: !!c.imageUrl,
      })),
      sampleUsers: sampleUsers.map((u: any) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
      })),
    };

    return NextResponse.json(
      {
        success: true,
        message: 'MongoDB connection successful',
        ...dbStats,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Test DB] ❌ Error:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
    });

    return NextResponse.json(
      {
        success: false,
        error: 'MongoDB connection failed',
        details: error.message,
        code: error.code,
        troubleshooting: {
          checkConnection: 'Verify MONGODB_URI in .env.local is correct',
          checkNetwork: 'If using MongoDB Atlas, check network access and IP whitelist',
          checkLocal: 'If using local MongoDB, ensure mongod is running on port 27017',
        },
      },
      { status: 500 }
    );
  }
}

