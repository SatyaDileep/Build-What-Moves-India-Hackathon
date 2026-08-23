import { NextRequest, NextResponse } from 'next/server';

// Mock UPSC legacy backend
// Validates: JPEG format, 20-50KB size, 3.5cm x 4.5cm dimensions

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    // Validate file exists
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file format (must be JPEG)
    if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
      return NextResponse.json(
        { success: false, error: 'Invalid format. Only JPEG files are accepted.' },
        { status: 400 }
      );
    }

    // Validate file size (20KB - 50KB)
    const fileSizeKB = file.size / 1024;
    if (fileSizeKB < 20) {
      return NextResponse.json(
        { 
          success: false, 
          error: `File too small. Minimum size is 20KB. Your file is ${Math.round(fileSizeKB)}KB.` 
        },
        { status: 400 }
      );
    }
    if (fileSizeKB > 50) {
      return NextResponse.json(
        { 
          success: false, 
          error: `File too large. Maximum size is 50KB. Your file is ${Math.round(fileSizeKB)}KB.` 
        },
        { status: 400 }
      );
    }

    // Validate dimensions by reading image
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer]);
    const url = URL.createObjectURL(blob);
    
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
    
    URL.revokeObjectURL(url);

    // Calculate dimensions in cm (assuming 96 DPI for web images)
    const widthCm = (img.width / 96) * 2.54;
    const heightCm = (img.height / 96) * 2.54;

    // Allow some tolerance for dimensions (±0.5cm)
    const widthTolerance = 0.5;
    const heightTolerance = 0.5;
    
    if (Math.abs(widthCm - 3.5) > widthTolerance) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid width. Required: 3.5cm, Your image: ${widthCm.toFixed(1)}cm` 
        },
        { status: 400 }
      );
    }
    
    if (Math.abs(heightCm - 4.5) > heightTolerance) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid height. Required: 4.5cm, Your image: ${heightCm.toFixed(1)}cm` 
        },
        { status: 400 }
      );
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Success response
    return NextResponse.json({
      success: true,
      message: '200 OK - Photo Upload Successful',
      data: {
        reference_id: `UPSC-${Date.now()}`,
        timestamp: new Date().toISOString(),
        file_name: file.name,
        file_size_kb: Math.round(fileSizeKB),
        dimensions: {
          width_cm: widthCm.toFixed(1),
          height_cm: heightCm.toFixed(1),
        },
      }
    });

  } catch (error) {
    console.error('UPSC API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
