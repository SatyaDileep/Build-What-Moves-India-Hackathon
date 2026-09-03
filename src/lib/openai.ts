import { DocumentConstraint } from '@/types';

// AI constraint parser — extracts structured upload rules from portal text

export async function parsePortalConstraints(pageText: string): Promise<DocumentConstraint> {
  if (typeof window !== 'undefined' && (window as any).__DOCBRIDGE_MOCK_LATENCY === 0) {
    return parseLocal(pageText);
  }
  await new Promise(resolve => setTimeout(resolve, 900));

  // Parse constraints based on page text
  const lowerText = pageText.toLowerCase();

  // Passport Seva GPSP photo — exact pixel box (must precede generic photo branches)
  if (lowerText.includes('passport seva') || lowerText.includes('630')) {
    return {
      format: 'jpeg',
      min_kb: 10,
      max_kb: 250,
      width_px: 630,
      height_px: 810,
      bg_color: 'white',
    };
  }

  // Passport / SSC / NSP signature strips — wide thin box
  if (lowerText.includes('signature') && (lowerText.includes('140') || lowerText.includes('ssc'))) {
    return {
      format: 'jpeg',
      min_kb: 10,
      max_kb: 20,
      width_px: 140,
      height_px: 60,
      bg_color: 'white',
    };
  }
  if (lowerText.includes('signature') && lowerText.includes('passport')) {
    return {
      format: 'jpeg',
      max_kb: 100,
      bg_color: 'white',
    };
  }
  // NSP income / category certificate — small PDF (before NSP photo: both mention NSP)
  if (lowerText.includes('income certificate') || lowerText.includes('category certificate') || (lowerText.includes('nsp') && lowerText.includes('pdf'))) {
    return {
      format: 'pdf',
      max_kb: 500,
      additional_requirements: ['Stamp and signature of issuing authority must be visible'],
    };
  }

  // NSP OTR photo (before SSC: both use the 200x230 box)
  if (lowerText.includes('nsp') || lowerText.includes('scholarship')) {
    return {
      format: 'jpeg',
      max_kb: 50,
      width_px: 200,
      height_px: 230,
      bg_color: 'white',
    };
  }

  // SSC OTR photo — tiny exact box
  if (lowerText.includes('ssc') || lowerText.includes('200x230') || lowerText.includes('200×230')) {
    return {
      format: 'jpeg',
      min_kb: 20,
      max_kb: 50,
      width_px: 200,
      height_px: 230,
      bg_color: 'white',
    };
  }

  // EPFO constraints
  if (lowerText.includes('passbook') || lowerText.includes('epfo') || lowerText.includes('pf')) {
    return {
      format: 'pdf',
      max_kb: 500,
      additional_requirements: ['Account number must be visible'],
    };
  }
  
  // Vahan / Sarathi constraints
  if (lowerText.includes('driving') || lowerText.includes('sarathi') || lowerText.includes('transport') || lowerText.includes('35mm')) {
    return {
      format: 'jpeg',
      min_kb: 10,
      max_kb: 20,
      width_cm: 3.5,
      height_cm: 4.5,
      bg_color: 'white',
    };
  }
  
  // UPSC constraints
  if (lowerText.includes('passport photo') || lowerText.includes('upsc') || lowerText.includes('photograph')) {
    return {
      format: 'jpeg',
      min_kb: 20,
      max_kb: 200,
      width_cm: 3.5,
      height_cm: 4.5,
      bg_color: 'white',
    };
  }
  
  // Generic document constraints
  if (lowerText.includes('pdf')) {
    return {
      format: 'pdf',
      max_kb: 1000,
    };
  }
  
  if (lowerText.includes('image') || lowerText.includes('photo') || lowerText.includes('jpeg') || lowerText.includes('jpg')) {
    return {
      format: 'jpeg',
      min_kb: 10,
      max_kb: 100,
    };
  }

  // Default constraint
  return {
    format: 'pdf',
    max_kb: 500,
  };
}

function parseLocal(pageText: string): DocumentConstraint {
  const lowerText = pageText.toLowerCase();
  if (lowerText.includes('passport seva') || lowerText.includes('630')) return { format: 'jpeg', min_kb: 10, max_kb: 250, width_px: 630, height_px: 810, bg_color: 'white' };
  if (lowerText.includes('signature') && (lowerText.includes('140') || lowerText.includes('ssc'))) return { format: 'jpeg', min_kb: 10, max_kb: 20, width_px: 140, height_px: 60, bg_color: 'white' };
  if (lowerText.includes('signature') && lowerText.includes('passport')) return { format: 'jpeg', max_kb: 100, bg_color: 'white' };
  if (lowerText.includes('income certificate') || lowerText.includes('category certificate') || (lowerText.includes('nsp') && lowerText.includes('pdf'))) return { format: 'pdf', max_kb: 500, additional_requirements: ['Stamp and signature of issuing authority must be visible'] };
  if (lowerText.includes('nsp') || lowerText.includes('scholarship')) return { format: 'jpeg', max_kb: 50, width_px: 200, height_px: 230, bg_color: 'white' };
  if (lowerText.includes('ssc') || lowerText.includes('200x230') || lowerText.includes('200×230')) return { format: 'jpeg', min_kb: 20, max_kb: 50, width_px: 200, height_px: 230, bg_color: 'white' };
  if (lowerText.includes('passbook') || lowerText.includes('epfo') || lowerText.includes('pf')) return { format: 'pdf', max_kb: 500, additional_requirements: ['Account number must be visible'] };
  if (lowerText.includes('driving') || lowerText.includes('sarathi') || lowerText.includes('transport') || lowerText.includes('35mm')) return { format: 'jpeg', min_kb: 10, max_kb: 20, width_cm: 3.5, height_cm: 4.5, bg_color: 'white' };
  if (lowerText.includes('passport photo') || lowerText.includes('upsc') || lowerText.includes('photograph')) return { format: 'jpeg', min_kb: 20, max_kb: 200, width_cm: 3.5, height_cm: 4.5, bg_color: 'white' };
  if (lowerText.includes('pdf')) return { format: 'pdf', max_kb: 1000 };
  if (lowerText.includes('image') || lowerText.includes('photo') || lowerText.includes('jpeg') || lowerText.includes('jpg')) return { format: 'jpeg', min_kb: 10, max_kb: 100 };
  return { format: 'pdf', max_kb: 500 };
}

// Production OpenAI integration (available when OPENAI_API_KEY is set)
/*
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function parsePortalConstraintsReal(pageText: string): Promise<DocumentConstraint> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `You are a document constraint parser. Analyze the portal requirements and extract:
- format: 'pdf' | 'jpeg' | 'png'
- min_kb: minimum file size in KB (optional)
- max_kb: maximum file size in KB (optional)
- width_cm: width in centimeters (optional)
- height_cm: height in centimeters (optional)
- bg_color: required background color (optional)
- additional_requirements: array of other requirements (optional)

Return a JSON object with these fields.`
      },
      {
        role: 'user',
        content: `Parse the upload requirements from this portal text:\n\n${pageText}`
      }
    ],
  });

  const content = completion.choices[0].message.content;
  return JSON.parse(content || '{}') as DocumentConstraint;
}
*/
