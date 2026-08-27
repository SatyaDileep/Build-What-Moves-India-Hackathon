import { NextRequest, NextResponse } from 'next/server';

// EPFO legacy backend
// Validates: PDF format, max 500KB, account number visible

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const accountNumber = formData.get('account_number') as string;

    // Validate file exists
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file format (must be PDF)
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: 'Invalid format. Only PDF files are accepted.' },
        { status: 400 }
      );
    }

    // Validate file size (max 500KB)
    const maxSizeKB = 500;
    const fileSizeKB = file.size / 1024;
    if (fileSizeKB > maxSizeKB) {
      return NextResponse.json(
        { 
          success: false, 
          error: `File too large. Maximum size is ${maxSizeKB}KB. Your file is ${Math.round(fileSizeKB)}KB.` 
        },
        { status: 400 }
      );
    }

    // Validate account number
    if (!accountNumber || accountNumber.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Valid account number is required' },
        { status: 400 }
      );
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Success response
    return NextResponse.json({
      success: true,
      message: '200 OK - KYC Updated Successfully',
      data: {
        reference_id: `EPFO-${Date.now()}`,
        timestamp: new Date().toISOString(),
        account_number: accountNumber,
        file_name: file.name,
        file_size_kb: Math.round(fileSizeKB),
      }
    });

  } catch (error) {
    console.error('EPFO API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
