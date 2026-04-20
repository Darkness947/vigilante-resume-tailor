import { extractTextFromFile } from '../src/lib/extractor';
import fs from 'fs';
import path from 'path';

async function main() {
  const dummyFile = new File(['hello world'], 'dummy.txt', { type: 'text/plain' });
  const text = await extractTextFromFile(dummyFile);
  console.log('Tested txt:', text);
}

main().catch(console.error);
