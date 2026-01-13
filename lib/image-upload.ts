/**
 * Image Upload Utility
 * Supports both local storage and Cloudinary
 */

// For local storage (development)
// Note: In production, you should save files to a proper storage service
// This base64 approach works for demo but has size limitations
export async function uploadImageLocal(file: File): Promise<string> {
  // Server-side: Use Buffer (Node.js environment)
  if (typeof window === 'undefined') {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;
    console.log('[Local Upload] Server-side base64 conversion successful');
    return dataUrl;
  }
  
  // Client-side: Use FileReader (browser environment)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// For Cloudinary (production)
export async function uploadImageCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'grievance_iq';
  
  console.log('[Cloudinary] Configuration:', {
    cloudName: cloudName ? `${cloudName.substring(0, 5)}...` : 'NOT SET',
    uploadPreset,
    hasCloudName: !!cloudName,
  });

  if (!cloudName) {
    throw new Error('Cloudinary cloud name not configured (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)');
  }

  // Convert File to base64 data URL for Cloudinary
  // Cloudinary accepts base64 data URLs via the 'file' parameter
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString('base64');
  const dataUrl = `data:${file.type};base64,${base64}`;

  console.log('[Cloudinary] Uploading to:', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
  console.log('[Cloudinary] File info:', {
    name: file.name,
    size: file.size,
    type: file.type,
    bufferSize: buffer.length,
    dataUrlLength: dataUrl.length,
  });

  try {
    // Use URL-encoded form data for base64 upload
    const formData = new URLSearchParams();
    formData.append('file', dataUrl);
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData.toString(),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const responseText = await response.text();
    console.log('[Cloudinary] Response status:', response.status);
    console.log('[Cloudinary] Response text:', responseText.substring(0, 500));

    if (!response.ok) {
      let errorMessage = 'Image upload failed';
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error?.message || errorData.message || errorMessage;
        console.error('[Cloudinary] Error details:', errorData);
      } catch (e) {
        console.error('[Cloudinary] Raw error response:', responseText);
      }
      throw new Error(`Cloudinary upload failed: ${errorMessage} (Status: ${response.status})`);
    }

    const data = JSON.parse(responseText);
    console.log('[Cloudinary] ✅ Upload successful!', {
      secure_url: data.secure_url?.substring(0, 100),
      public_id: data.public_id,
    });
    return data.secure_url;
  } catch (error: any) {
    console.error('[Cloudinary] ❌ Upload exception:', {
      message: error.message,
      stack: error.stack,
    });
    throw error;
  }
}

/**
 * Main upload function - uses Cloudinary if configured, otherwise local
 */
export async function uploadImage(file: File): Promise<string> {
  console.log('[uploadImage] Starting image upload...', {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
  });

  const useCloudinary = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  console.log('[uploadImage] Cloudinary configured:', !!useCloudinary);

  if (useCloudinary) {
    console.log('[uploadImage] Using Cloudinary upload');
    try {
      const url = await uploadImageCloudinary(file);
      console.log('[uploadImage] ✅ Cloudinary upload successful:', url.substring(0, 100));
      return url;
    } catch (error: any) {
      console.error('[uploadImage] ❌ Cloudinary upload failed:', error.message);
      throw error;
    }
  } else {
    console.log('[uploadImage] Using local (base64) upload');
    try {
      const dataUrl = await uploadImageLocal(file);
      console.log('[uploadImage] ✅ Local upload successful, data URL length:', dataUrl.length);
      return dataUrl;
    } catch (error: any) {
      console.error('[uploadImage] ❌ Local upload failed:', error.message);
      throw error;
    }
  }
}

