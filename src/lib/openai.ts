import { DocumentConstraint } from '@/types';

// AI constraint parser — extracts structured upload rules from portal text

export async function parsePortalConstraints(pageText: string): Promise<DocumentConstraint> {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 1200));

  // Parse constraints based on page text
  const lowerText = pageText.toLowerCase();
  
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
