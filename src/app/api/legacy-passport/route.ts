import { NextRequest, NextResponse } from 'next/server';

// Passport Seva (GPSP 2.0) legacy backend
// Validates per upload slot (doc form field):
//   photo: JPEG, 10-250KB (portal also checks exactly 630x810px client-side)
//   signature: JPEG, max 100KB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const doc = (formData.get('doc') as string) || 'photo';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
      return NextResponse.json(
        { success: false, error: 'Invalid format. Only JPEG files are accepted.' },
        { status: 400 }
      );
    }

    const fileSizeKB = file.size / 1024;
    const minKB = 10;
    const maxKB = doc === 'signature' ? 100 : 250;

    if (fileSizeKB < minKB || fileSizeKB > maxKB) {
      return NextResponse.json(
        {
          success: false,
          error: doc === 'signature'
            ? `Image size is not correct. Signature must be under ${maxKB}KB. Your file is ${Math.round(fileSizeKB)}KB.`
            : `Image size is not correct. Dimensions should be 630*810 pixels, file between ${minKB}-${maxKB}KB. Your file is ${Math.round(fileSizeKB)}KB.`,
        },
        { status: 400 }
      );
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      message: '200 OK - Uploaded Successfully',
      data: {
        reference_id: `PSP-${Date.now()}`,
        timestamp: new Date().toISOString(),
        doc,
        file_name: file.name,
        file_size_kb: Math.round(fileSizeKB),
      }
    });

  } catch (error) {
    console.error('Passport API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
