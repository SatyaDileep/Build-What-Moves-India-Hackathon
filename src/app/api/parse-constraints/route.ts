import { NextRequest, NextResponse } from 'next/server';
import { parsePortalConstraints } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { pageText } = await request.json();

    if (!pageText) {
      return NextResponse.json(
        { success: false, error: 'No page text provided' },
        { status: 400 }
      );
    }

    // Parse constraints using OpenAI
    const constraints = await parsePortalConstraints(pageText);

    return NextResponse.json({
      success: true,
      constraints,
    });

  } catch (error) {
    console.error('Parse constraints error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to parse constraints' },
      { status: 500 }
    );
  }
}
