import { Buffer } from 'buffer';

/**
 * Polyfill browser-only globals that pdfjs-dist (used by pdf-parse v2) expects.
 * Vercel serverless functions run in a stripped-down Node.js environment
 * that lacks DOMMatrix & Path2D, causing hard crashes on import.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = globalThis as any;
if (typeof g.DOMMatrix === 'undefined') {
  g.DOMMatrix = class DOMMatrix {
    m11 = 1; m12 = 0; m13 = 0; m14 = 0;
    m21 = 0; m22 = 1; m23 = 0; m24 = 0;
    m31 = 0; m32 = 0; m33 = 1; m34 = 0;
    m41 = 0; m42 = 0; m43 = 0; m44 = 1;
    a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
    is2D = true;
    isIdentity = true;
  };
}
if (typeof g.Path2D === 'undefined') {
  g.Path2D = class Path2D {};
}

export async function extractTextFromFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (file.type === 'application/pdf') {
    try {
      const pdfParseModule = await import('pdf-parse');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const PDFParse = pdfParseModule.PDFParse || (pdfParseModule as any).default;
      if (!PDFParse) {
        throw new Error('PDFParse module could not be loaded dynamically on Vercel.');
      }
      const parser = new PDFParse({ data: buffer });
      const parsed = await parser.getText();
      return parsed.text;
    } catch (e) {
      throw new Error(`Failed to safely parse PDF document: ${(e as Error).message}`);
    }
  }

  if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    try {
      const mammothModule = await import('mammoth');
      const mammoth = mammothModule.default || mammothModule;
      const parsed = await mammoth.extractRawText({ buffer });
      return parsed.value;
    } catch (e) {
      throw new Error(`Failed to safely parse DOCX document: ${(e as Error).message}`);
    }
  }

  if (file.type === 'text/plain') {
    return buffer.toString('utf-8');
  }

  throw new Error("Unsupported file format provided to extractor.");
}
