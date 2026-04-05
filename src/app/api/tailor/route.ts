import { NextResponse } from 'next/server';
import { tailorResume } from '@/lib/gemini';
import { ratelimit } from '@/lib/ratelimit';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    
    if (process.env.UPSTASH_REDIS_REST_URL) {
      const { success } = await ratelimit.limit(ip);
      if (!success) {
        return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
      }
    }

    const { originalResume, jobDescription, language, strength } = await req.json();

    if (!originalResume || !jobDescription) {
      return NextResponse.json({ error: "Missing required texts for tailoring." }, { status: 400 });
    }

    const result = await tailorResume(
      originalResume, 
      jobDescription, 
      language || 'en', 
      strength || 'balanced'
    );

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    // Admin requirement: "No raw resume text... exposed into an Admin API response" - ensured by generic logging.
    console.error('[Gemini Tailor API]', error.message);
    return NextResponse.json({ error: "Internal processing failed. Please check prompt sizes or API validity." }, { status: 500 });
  }
}
