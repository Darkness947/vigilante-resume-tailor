import { Buffer } from 'buffer';
import * as mammoth from 'mammoth';

import { PDFParse } from 'pdf-parse';

export async function extractTextFromFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (file.type === 'application/pdf') {
    try {
      const parser = new PDFParse({ data: buffer });
      const parsed = await parser.getText();
      return parsed.text;
    } catch (e) {
      throw new Error(`Failed to safely parse PDF document: ${(e as Error).message}`);
    }
  }

  if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    try {
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
