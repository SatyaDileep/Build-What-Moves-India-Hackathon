import { NextRequest, NextResponse } from 'next/server';

// Mock UPSC legacy backend
// Validates: JPEG format, 20-50KB size, 3.5cm x 4.5cm dimensions

function getJpegDimensions(fileBytes: ArrayBuffer): { width: number; height: number } | null {
  const bytes = new Uint8Array(fileBytes);

  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    return null;
  }

  for (let offset = 2; offset + 8 < bytes.length;) {
    if (bytes[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = bytes[offset + 1];
    offset += 2;

    // Standalone JPEG markers do not contain a length field.
    if (marker === 0xd8 || marker === 0xd9) continue;
    if (offset + 2 > bytes.length) break;

    const segmentLength = (bytes[offset] << 8) | bytes[offset + 1];
    const isStartOfFrame = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);

    if (isStartOfFrame && offset + 7 < bytes.length) {
      return {
        height: (bytes[offset + 3] << 8) | bytes[offset + 4],
        width: (bytes[offset + 5] << 8) | bytes[offset + 6],
      };
    }

    if (segmentLength < 2) break;
    offset += segmentLength;
  }

  return null;
}

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

    // Read JPEG dimensions directly from its Start Of Frame marker. This keeps
    // the route server-safe instead of relying on browser-only Image APIs.
    const arrayBuffer = await file.arrayBuffer();
    const dimensions = getJpegDimensions(arrayBuffer);

    if (!dimensions) {
      return NextResponse.json(
        { success: false, error: 'Could not read JPEG dimensions.' },
        { status: 400 }
      );
    }

    // Calculate dimensions in cm (assuming 96 DPI for web images)
    const widthCm = (dimensions.width / 96) * 2.54;
    const heightCm = (dimensions.height / 96) * 2.54;

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
