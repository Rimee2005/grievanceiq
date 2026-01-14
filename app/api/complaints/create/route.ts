import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Complaint from '@/models/Complaint';
import { analyzeComplaint, calculateSimilarity } from '@/lib/ai-processor';
import { uploadImage } from '@/lib/image-upload';
import { sendComplaintSubmissionEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    console.log('=== COMPLAINT CREATE - START ===');
    console.log('Request content-type:', request.headers.get('content-type'));
    
    const formData = await request.formData();
    
    // Debug: Log all form data keys FIRST
    const formDataKeys = Array.from(formData.keys());
    console.log('📋 FormData keys:', formDataKeys);
    
    // Log all entries with detailed info
    const entries: any[] = [];
    for (const [key, value] of Array.from(formData.entries())) {
      if (value instanceof File) {
        entries.push([key, {
          type: 'File',
          name: value.name,
          size: value.size,
          typeMime: value.type,
          lastModified: value.lastModified,
        }]);
      } else {
        entries.push([key, {
          type: typeof value,
          value: value,
          length: (value as string)?.length,
        }]);
      }
    }
    console.log('📋 FormData entries:', JSON.stringify(entries, null, 2));
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const complaintText = formData.get('complaintText') as string;
    const location = formData.get('location') as string | null;
    const imageFile = formData.get('image') as File | null;
    
    console.log('📋 Extracted values:', {
      hasName: !!name,
      hasEmail: !!email,
      hasComplaintText: !!complaintText,
      hasLocation: !!location,
      hasImageFile: !!imageFile,
    });

    // Validate required fields
    if (!name || !email || !complaintText) {
      return NextResponse.json(
        { error: 'Name, email, and complaint text are required' },
        { status: 400 }
      );
    }

    // Upload image if provided
    let imageUrl: string | undefined;
    console.log('🖼️ IMAGE UPLOAD CHECK ===');
    console.log('Image file received:', {
      hasImageFile: !!imageFile,
      imageFileType: typeof imageFile,
      isFileInstance: imageFile instanceof File,
      imageFileSize: imageFile?.size,
      imageFileName: imageFile?.name,
      imageFileTypeMime: imageFile?.type,
      imageFileConstructor: (imageFile as any)?.constructor?.name,
    });

    if (imageFile) {
      // Check if it's actually a File object
      if (!(imageFile instanceof File)) {
        console.error('❌ imageFile is not a File object:', {
          type: typeof imageFile,
          constructor: (imageFile as any)?.constructor?.name,
          value: imageFile,
        });
      } else if (imageFile.size === 0) {
        console.log('⚠️ Image file is empty (size: 0)');
      } else {
        try {
          console.log('Attempting to upload image...', {
            fileName: imageFile.name,
            fileSize: imageFile.size,
            fileType: imageFile.type,
          });
          imageUrl = await uploadImage(imageFile);
          console.log('✅ Image upload successful!', {
            imageUrl: imageUrl?.substring(0, 100),
            imageUrlLength: imageUrl?.length,
            imageUrlType: typeof imageUrl,
          });
        } catch (error: any) {
          console.error('❌ Image upload error:', {
            error: error.message,
            stack: error.stack,
            errorType: error.constructor.name,
          });
          
          // Fallback to local base64 storage if Cloudinary fails
          console.log('🔄 Attempting fallback to local base64 storage...');
          try {
            // Convert File to base64 directly (server-side)
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64 = buffer.toString('base64');
            imageUrl = `data:${imageFile.type};base64,${base64}`;
            console.log('✅ Fallback to local storage successful!', {
              imageUrlLength: imageUrl.length,
              imageUrlPreview: imageUrl.substring(0, 100),
            });
          } catch (fallbackError: any) {
            console.error('❌ Fallback also failed:', {
              error: fallbackError.message,
              stack: fallbackError.stack,
            });
            // Continue without image if both fail
            imageUrl = undefined;
          }
        }
      }
    } else {
      console.log('⚠️ No image file provided (imageFile is null/undefined)');
    }
    console.log('Final imageUrl before saving:', imageUrl);
    console.log('=== END COMPLAINT CREATE DEBUG ===');

    // Analyze complaint using AI
    const analysis = analyzeComplaint(complaintText, !!imageUrl);

    // Check for duplicates
    const recentComplaints = await Complaint.find({
      email: email.toLowerCase(),
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // Last 7 days
    })
      .sort({ createdAt: -1 })
      .limit(10);

    let isDuplicate = false;
    let duplicateOf: string | undefined;

    for (const recentComplaint of recentComplaints) {
      const similarity = calculateSimilarity(complaintText, recentComplaint.complaintText);
      
      // If similarity is high and same category, mark as duplicate
      if (similarity > 0.6 && recentComplaint.category === analysis.category) {
        // Also check location if provided
        if (!location || !recentComplaint.location || 
            location.toLowerCase() === recentComplaint.location.toLowerCase()) {
          isDuplicate = true;
          duplicateOf = recentComplaint._id.toString();
          break;
        }
      }
    }

    // Create complaint
    // IMPORTANT: Only set imageUrl if it's a valid non-empty string
    const complaintData: any = {
      name,
      email: email.toLowerCase(),
      complaintText,
      location: location || undefined,
      category: analysis.category,
      priority: analysis.priority,
      department: analysis.department,
      status: 'Pending',
      isDuplicate,
      duplicateOf: duplicateOf ? duplicateOf : undefined,
    };

    // Only add imageUrl if it exists and is a valid string
    if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim().length > 0) {
      complaintData.imageUrl = imageUrl;
      console.log('✅ Adding imageUrl to complaint:', imageUrl.substring(0, 100));
    } else {
      console.log('⚠️ Not adding imageUrl (empty or invalid)');
      // Don't set imageUrl at all - let it be undefined
    }

    const complaint = new Complaint(complaintData);

    console.log('Complaint object before save:', {
      hasImageUrl: !!complaint.imageUrl,
      imageUrl: complaint.imageUrl,
      imageUrlType: typeof complaint.imageUrl,
    });

    // Save complaint with error handling
    try {
      await complaint.save();
      console.log('[Complaint Create] ✅ Complaint saved successfully with ID:', complaint._id);
    } catch (saveError: any) {
      console.error('[Complaint Create] ❌ Error saving complaint:', {
        error: saveError.message,
        code: saveError.code,
        name: saveError.name,
        stack: saveError.stack,
      });
      throw saveError; // Re-throw to be caught by outer try-catch
    }

    // Verify what was actually saved by querying the database
    let savedComplaint;
    try {
      savedComplaint = await Complaint.findById(complaint._id);
      if (!savedComplaint) {
        console.error('[Complaint Create] ❌ CRITICAL: Complaint was saved but cannot be retrieved!', {
          complaintId: complaint._id,
        });
        throw new Error('Complaint was saved but cannot be retrieved from database');
      }
      console.log('[Complaint Create] ✅ Complaint verified in database:', {
        id: savedComplaint._id,
        name: savedComplaint.name,
        email: savedComplaint.email,
        category: savedComplaint.category,
        hasImageUrl: !!savedComplaint.imageUrl,
        imageUrl: savedComplaint.imageUrl ? savedComplaint.imageUrl.substring(0, 50) + '...' : null,
        createdAt: savedComplaint.createdAt,
      });
    } catch (verifyError: any) {
      console.error('[Complaint Create] ❌ Error verifying saved complaint:', {
        error: verifyError.message,
        complaintId: complaint._id,
      });
      // Don't throw here - the complaint was saved, verification is just for debugging
    }

    // Send confirmation email to user
    console.log('[Complaint Create] 📧 Sending submission confirmation email...', {
      email: email,
      name: name,
      complaintId: complaint._id.toString(),
    });

    sendComplaintSubmissionEmail(
      email,
      name,
      complaint._id.toString(),
      complaintText,
      complaint.category,
      complaint.priority,
      complaint.department,
      location || undefined
    )
      .then((success) => {
        if (success) {
          console.log('[Complaint Create] ✅ Confirmation email sent successfully to:', email);
        } else {
          console.log('[Complaint Create] ⚠️ Confirmation email not sent (check SMTP configuration)');
        }
      })
      .catch((error) => {
        console.error('[Complaint Create] ❌ Confirmation email failed:', {
          error: error.message,
        });
        // Don't fail the request if email fails
      });

    return NextResponse.json(
      {
        success: true,
        complaint: {
          id: complaint._id.toString(),
          category: complaint.category,
          priority: complaint.priority,
          department: complaint.department,
          isDuplicate: complaint.isDuplicate,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating complaint:', error);
    return NextResponse.json(
      { error: 'Failed to create complaint', details: error.message },
      { status: 500 }
    );
  }
}

