import { NextResponse } from 'next/server';
import { tailorResume } from '@/lib/gemini';
import { ratelimit } from '@/lib/ratelimit';
import { generateCacheKey, getCachedTailoring, setCachedTailoring } from '@/lib/cache';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';

    if (ratelimit) {
      try {
        const { success } = await ratelimit.limit(ip);
        if (!success) {
          return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
        }
      } catch (e) {
        console.warn('[Tailor API] Ratelimit skipped due to Upstash error.', e);
      }
    }

    const { originalResume, jobDescription, language, strength } = await req.json();

    if (!originalResume || !jobDescription) {
      return NextResponse.json({ error: "Missing required texts for tailoring." }, { status: 400 });
    }

    const lang = language || 'en';
    const str = strength || 'balanced';

    // 1. Check Cache
    const cacheKey = generateCacheKey(originalResume, jobDescription, lang, str);
    const cachedResult = await getCachedTailoring(cacheKey);

    if (cachedResult) {
      console.log(`[Tailor API] Cache Hit: Returning cached result for ${cacheKey.substring(0, 15)}...`);
      return NextResponse.json({ success: true, data: cachedResult, cached: true });
    }

    // 2. Call Engine
    const result = await tailorResume(
      originalResume,
      jobDescription,
      lang,
      str
    );

    // 3. Store in Cache
    await setCachedTailoring(cacheKey, result);

    return NextResponse.json({ success: true, data: result });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const message = typeof error?.message === 'string' ? error.message : 'Unknown error';
    console.error('[Gemini Tailor API]', message);

    if (message.includes('GEMINI_API_KEY')) {
      return NextResponse.json({ error: "AI is not configured (missing GEMINI_API_KEY)." }, { status: 500 });
    }

    return NextResponse.json({ error: "Internal processing failed. Please check prompt sizes or API validity." }, { status: 500 });
  }
}
