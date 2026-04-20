import { extractText, getDocumentProxy } from 'unpdf';

export async function extractTextFromFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  if (file.type === 'application/pdf') {
    try {
      const pdf = await getDocumentProxy(buffer);
      const { text } = await extractText(pdf, { mergePages: true });
      return text;
    } catch (e) {
      throw new Error(`Failed to safely parse PDF document: ${(e as Error).message}`);
    }
  }

  if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    try {
      const mammothModule = await import('mammoth');
      const mammoth = mammothModule.default || mammothModule;
      const parsed = await mammoth.extractRawText({ buffer: Buffer.from(arrayBuffer) });
      return parsed.value;
    } catch (e) {
      throw new Error(`Failed to safely parse DOCX document: ${(e as Error).message}`);
    }
  }

  if (file.type === 'text/plain') {
    return Buffer.from(arrayBuffer).toString('utf-8');
  }

  throw new Error("Unsupported file format provided to extractor.");
}
