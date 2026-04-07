import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function uploadPdfToStorage(buffer: Buffer, originalFilename: string) {
  const fileExt = '.pdf';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExt}`;
  const filePath = `generated/${fileName}`;

  const { error } = await supabase.storage
    .from('resumes')
    .upload(filePath, buffer, {
      contentType: 'application/pdf',
      upsert: true
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  // Create signed URL for secure short-term download limit (120 seconds valid)
  const { data: signData, error: signError } = await supabase.storage
    .from('resumes')
    .createSignedUrl(filePath, 120);

  if (signError) {
    throw new Error(`Signed URL creation failed: ${signError.message}`);
  }

  return signData.signedUrl;
}
