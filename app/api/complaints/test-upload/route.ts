import { NextRequest, NextResponse } from 'next/server';

/**
 * Test endpoint to verify image upload functionality
 * POST with FormData containing an 'image' field
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    console.log('=== TEST UPLOAD ENDPOINT ===');
    console.log('FormData keys:', Array.from(formData.keys()));
    
    const imageFile = formData.get('image') as File | null;
    
    console.log('Image file:', {
      exists: !!imageFile,
      type: typeof imageFile,
      isFile: imageFile instanceof File,
      name: imageFile?.name,
      size: imageFile?.size,
      typeMime: imageFile?.type,
    });
    
    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided', formDataKeys: Array.from(formData.keys()) },
        { status: 400 }
      );
    }
    
    if (imageFile.size === 0) {
      return NextResponse.json(
        { error: 'Image file is empty' },
        { status: 400 }
      );
    }
    
    // Try to read the file
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log('File read successfully:', {
      bufferLength: buffer.length,
      fileSize: imageFile.size,
    });
    
    // Test base64 conversion
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${imageFile.type};base64,${base64}`;
    
    console.log('Base64 conversion successful:', {
      dataUrlLength: dataUrl.length,
      dataUrlPreview: dataUrl.substring(0, 100),
    });
    
    return NextResponse.json({
      success: true,
      message: 'Image upload test successful',
      fileInfo: {
        name: imageFile.name,
        size: imageFile.size,
        type: imageFile.type,
        bufferLength: buffer.length,
        dataUrlLength: dataUrl.length,
      },
      // Return first 200 chars of dataUrl for verification
      dataUrlPreview: dataUrl.substring(0, 200),
    });
  } catch (error: any) {
    console.error('Test upload error:', error);
    return NextResponse.json(
      { error: 'Test failed', details: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}

