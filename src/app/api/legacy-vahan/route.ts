import { NextRequest, NextResponse } from 'next/server';

// Vahan / Sarathi legacy backend
// Validates: JPEG photo, 10-20KB size, 35mm x 45mm dimensions

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

    // Validate file size (10KB - 20KB)
    const fileSizeKB = file.size / 1024;
    if (fileSizeKB < 10) {
      return NextResponse.json(
        {
          success: false,
          error: `File size should be between 10KB and 20KB. Your file is ${Math.round(fileSizeKB)}KB.`,
        },
        { status: 400 }
      );
    }
    if (fileSizeKB > 20) {
      return NextResponse.json(
        {
          success: false,
          error: `File size should be between 10KB and 20KB. Your file is ${Math.round(fileSizeKB)}KB.`,
        },
        { status: 400 }
      );
    }

    // Read JPEG dimensions
    const arrayBuffer = await file.arrayBuffer();
    const dimensions = getJpegDimensions(arrayBuffer);

    if (!dimensions) {
      return NextResponse.json(
        { success: false, error: 'Could not read JPEG dimensions.' },
        { status: 400 }
      );
    }

    // Validate 35mm x 45mm at 300 DPI (~413 x 531 px) — allow tolerance for
    // the Sarathi portal's strict automated check.
    const expectedWidth = Math.round((35 / 25.4) * 300);
    const expectedHeight = Math.round((45 / 25.4) * 300);
    const tolerance = 0.1;

    if (Math.abs(dimensions.width - expectedWidth) / expectedWidth > tolerance) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid width. Sarathi requires 35mm. Your image is ${dimensions.width}px wide.`,
        },
        { status: 400 }
      );
    }
    if (Math.abs(dimensions.height - expectedHeight) / expectedHeight > tolerance) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid height. Sarathi requires 45mm. Your image is ${dimensions.height}px tall.`,
        },
        { status: 400 }
      );
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Success response
    return NextResponse.json({
      success: true,
      message: '200 OK - Photograph Upload Successful',
      data: {
        reference_id: `VAHAN-${Date.now()}`,
        timestamp: new Date().toISOString(),
        file_name: file.name,
        file_size_kb: Math.round(fileSizeKB),
        dimensions: {
          width_px: dimensions.width,
          height_px: dimensions.height,
        },
      }
    });

  } catch (error) {
    console.error('Vahan API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
