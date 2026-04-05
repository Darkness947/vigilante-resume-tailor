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
    let { htmlContent, template = 'classic' } = await req.json();

    if (!htmlContent) return NextResponse.json({ error: "Missing htmlContent parameter." }, { status: 400 });

    // Strip font-family declarations that crash react-pdf
    htmlContent = htmlContent.replace(/font-family\s*:\s*[^;"]+;?/gi, '');

    let Component = ClassicTemplate;
    if (template === 'modern') Component = ModernTemplate;
    if (template === 'arabic-rtl') Component = ArabicRtlTemplate;

    // React-PDF expects a node stream, so we must buffer it manually.
    const stream = await renderToStream(React.createElement(Component, { htmlContent }) as any);
    const chunks: Buffer[] = [];
    
    // @ts-ignore (async iteration over stream)
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

    const signedUrl = await uploadPdfToStorage(pdfBuffer, 'resume');
    return NextResponse.json({ success: true, url: signedUrl });
  } catch (error: any) {
    console.error('[PDF Gen Error]', error);
    return NextResponse.json({ error: 'PDF generation failed. Please see server logs.' }, { status: 500 });
  }
}
