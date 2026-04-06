import { NextResponse } from 'next/server';
import { extractTextFromFile } from '@/lib/extractor';
import { fileValidationSchema } from '@/lib/validation';
import { ratelimit } from '@/lib/ratelimit';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    
    // In strict dev environment, upstash might fail without valid keys, so wrap it gracefully:
    if (ratelimit) {
      try {
        const { success } = await ratelimit.limit(ip);
        if (!success) {
          return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
        }
      } catch (e) {
        console.warn('[Parse API] Ratelimit skipped due to Upstash error.', e);
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error && error.name === 'ZodError') {
      const msg = error.errors && error.errors.length > 0 ? error.errors[0].message : 'Validation failed';
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    return NextResponse.json({ error: error?.message || 'Unknown parsing error occurred' }, { status: 500 });
  }
}
