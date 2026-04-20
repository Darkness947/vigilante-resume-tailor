import { Buffer } from 'buffer';

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
