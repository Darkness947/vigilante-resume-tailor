import { NextResponse } from 'next/server';
import React from 'react';
import { renderToStream } from '@react-pdf/renderer';
import { ClassicTemplate } from '@/components/pdf/ClassicTemplate';
import { ModernTemplate } from '@/components/pdf/ModernTemplate';
import { ArabicRtlTemplate } from '@/components/pdf/ArabicRtlTemplate';
import { registerAllFonts } from '@/components/pdf/registerFonts';
import { uploadPdfToStorage } from '@/lib/storage';

export async function POST(req: Request) {
  try {
    registerAllFonts();
    const { htmlContent: rawHtmlContent, template = 'classic' } = await req.json();

    if (!rawHtmlContent) {
      return NextResponse.json({ error: "Missing htmlContent parameter." }, { status: 400 });
    }

    // Comprehensive sanitization for PDF rendering
    const htmlContent = String(rawHtmlContent)
      // Strip problematic tags
      .replace(/<(script|head|style|link|small|iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/<(script|head|style|link|small|iframe|object|embed)[^>]*\/>/gi, '')
      // Strip forbidden attributes (onclick, etc.)
      .replace(/\bon\w+\s*=\s*(['"]).*?\1/gi, '')
      // Strip unsupported styles that cause NaN or warnings
      .replace(/style\s*=\s*(['"])(.*?)\1/gi, (match, quote, styleContent) => {
        const cleanedStyle = styleContent
          .split(';')
          .map((s: string) => s.trim())
          .filter((s: string) => {
            const lower = s.toLowerCase();
            return !(
              lower.includes('font-family') ||
              lower.includes('box-shadow') ||
              lower.includes('list-style') ||
              lower.includes('border-radius') ||
              lower.includes('transition') ||
              lower.includes('animation') ||
              lower.includes('nan')
            );
          })
          .join('; ');
        return `style=${quote}${cleanedStyle}${quote}`;
      });

    let Component = ClassicTemplate;
    if (template === 'modern') Component = ModernTemplate;
    if (template === 'arabic-rtl') Component = ArabicRtlTemplate;

    // React-PDF expects a node stream, so we must buffer it manually.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stream = await renderToStream(React.createElement(Component, { htmlContent }) as any);
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    const pdfBuffer = Buffer.concat(chunks);

    // Bypassing Supabase upload in local test mode if required keys are missing securely:
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log("[PDF API] Local Generation successful, skipping Supabase upload due to missing keys.");
      // Return raw base64 mapping for local fallback testing
      return NextResponse.json({ success: true, url: `data:application/pdf;base64,${pdfBuffer.toString('base64')}` });
    }

    const result = await uploadPdfToStorage(pdfBuffer, 'resume');
    return NextResponse.json({ success: true, url: result.url, path: result.path });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('[PDF Gen Error]', error);
    return NextResponse.json({ error: 'PDF generation failed. Please see server logs.' }, { status: 500 });
  }
}
