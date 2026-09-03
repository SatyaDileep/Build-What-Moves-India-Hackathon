import { NextRequest, NextResponse } from 'next/server';

// SSC OTR legacy backend
// Validates per upload slot (doc form field):
//   photo: JPEG, 20-50KB, 200x230px (dimensions enforced client-side)
//   signature: JPEG, 10-20KB, 140x60px

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
        { success: false, error: 'Invalid format. Only JPG/JPEG files are accepted.' },
        { status: 400 }
      );
    }

    const fileSizeKB = file.size / 1024;
    const minKB = doc === 'signature' ? 10 : 20;
    const maxKB = doc === 'signature' ? 20 : 50;

    if (fileSizeKB < minKB || fileSizeKB > maxKB) {
      return NextResponse.json(
        {
          success: false,
          error: doc === 'signature'
            ? `Invalid dimensions or size. Signature must be 140x60px, ${minKB}-${maxKB}KB. Your file is ${Math.round(fileSizeKB)}KB.`
            : `Invalid dimensions or size. Photograph must be 200x230px, ${minKB}-${maxKB}KB. Your file is ${Math.round(fileSizeKB)}KB.`,
        },
        { status: 400 }
      );
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      message: '200 OK - Uploaded Successfully',
      data: {
        reference_id: `SSC-${Date.now()}`,
        timestamp: new Date().toISOString(),
        doc,
        file_name: file.name,
        file_size_kb: Math.round(fileSizeKB),
      }
    });

  } catch (error) {
    console.error('SSC API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
