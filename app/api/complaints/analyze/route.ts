import { NextRequest, NextResponse } from 'next/server';
import { analyzeComplaint } from '@/lib/ai-processor';

export async function POST(request: NextRequest) {
  try {
    const { text, hasImage } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const analysis = analyzeComplaint(text, hasImage || false);

    return NextResponse.json({ success: true, analysis }, { status: 200 });
  } catch (error: any) {
    console.error('Error analyzing complaint:', error);
    return NextResponse.json(
      { error: 'Failed to analyze complaint', details: error.message },
      { status: 500 }
    );
  }
}

