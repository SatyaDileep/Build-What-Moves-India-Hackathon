import { NextRequest, NextResponse } from 'next/server';

// NSP (National Scholarship Portal) legacy backend
// Validates per upload slot (doc form field):
//   photo: JPEG, max 50KB
//   income: PDF or JPEG, max 500KB, must be current-year certificate

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

    const fileSizeKB = file.size / 1024;

    if (doc === 'income') {
      if (file.type !== 'application/pdf' && file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
        return NextResponse.json(
          { success: false, error: 'Invalid format. Income certificate must be PDF or JPG.' },
          { status: 400 }
        );
      }
      if (fileSizeKB > 500) {
        return NextResponse.json(
          {
            success: false,
            error: `Document upload failed. Maximum size is 500KB. Your file is ${Math.round(fileSizeKB)}KB.`,
          },
          { status: 400 }
        );
      }
    } else {
      if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
        return NextResponse.json(
          { success: false, error: 'Invalid format. Photograph must be JPG/JPEG.' },
          { status: 400 }
        );
      }
      if (fileSizeKB > 50) {
        return NextResponse.json(
          {
            success: false,
            error: `Document upload failed. Photograph must be under 50KB. Your file is ${Math.round(fileSizeKB)}KB.`,
          },
          { status: 400 }
        );
      }
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      message: '200 OK - Document Uploaded Successfully',
      data: {
        reference_id: `NSP-${Date.now()}`,
        timestamp: new Date().toISOString(),
        doc,
        file_name: file.name,
        file_size_kb: Math.round(fileSizeKB),
      }
    });

  } catch (error) {
    console.error('NSP API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
