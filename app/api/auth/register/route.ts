import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists (case-insensitive email check)
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('[Register] ⚠️ User already exists:', {
        email: email.toLowerCase(),
        existingUserId: existingUser._id,
        existingRole: existingUser.role,
      });
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }
    
    console.log('[Register] 📝 Creating new user:', {
      email: email.toLowerCase(),
      role: role || 'Citizen',
      hasName: !!name,
    });

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'Citizen',
    });

    // Save user with error handling
    try {
      await user.save();
      console.log('[Register] ✅ User saved successfully:', {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });
    } catch (saveError: any) {
      console.error('[Register] ❌ Error saving user:', {
        error: saveError.message,
        code: saveError.code,
        name: saveError.name,
        email: email.toLowerCase(),
      });
      
      // Handle duplicate key error (MongoDB unique constraint)
      if (saveError.code === 11000 || saveError.code === 11001) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        );
      }
      
      throw saveError; // Re-throw other errors
    }

    // Verify user was saved
    try {
      const verifiedUser = await User.findById(user._id);
      if (!verifiedUser) {
        console.error('[Register] ❌ CRITICAL: User was saved but cannot be retrieved!');
        throw new Error('User was saved but cannot be retrieved from database');
      }
      console.log('[Register] ✅ User verified in database');
    } catch (verifyError: any) {
      console.error('[Register] ⚠️ Error verifying saved user:', verifyError.message);
      // Don't throw - user was saved, verification is just for debugging
    }

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Failed to register user', details: error.message },
      { status: 500 }
    );
  }
}

