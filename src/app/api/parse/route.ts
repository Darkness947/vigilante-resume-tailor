import { NextResponse } from 'next/server';
import { extractTextFromFile } from '@/lib/extractor';
import { fileValidationSchema } from '@/lib/validation';
import { ratelimit } from '@/lib/ratelimit';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    
    // In strict dev environment, upstash might fail without valid keys, so wrap it gracefully:
    if (process.env.UPSTASH_REDIS_REST_URL) {
      const { success } = await ratelimit.limit(ip);
      if (!success) {
        return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
      }
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: "Missing file payload" }, { status: 400 });
    }

    // Validate size and mime using Zod
    fileValidationSchema.parse({ file });

    const text = await extractTextFromFile(file as File);

    return NextResponse.json({ success: true, text });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
