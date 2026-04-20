'use server';

import { createClient } from '@/lib/supabase/server';
import { AtsTailorResponse } from '@/lib/validation';
import { revalidatePath } from 'next/cache';
import { getFreshSignedUrls } from '@/lib/storage';
import { sendTailoredResumeEmail } from '@/lib/email';

/**
 * Extracts the Supabase storage path from a full signed URL or returns the path if already provided as one.
 * Example URL: .../object/sign/resumes/generated/123.pdf?token=...
 * Path: generated/123.pdf
 */
function extractStoragePath(input: string | null): string | null {
  if (!input) return null;
  if (!input.startsWith('http')) return input; // Already a path

  try {
    // Look for the part after 'resumes/' which is our bucket name
    const parts = input.split('resumes/');
    if (parts.length < 2) return null;
    
    // Remove the query params (token)
    return parts[1].split('?')[0];
  } catch (e) {
    console.error('[Path Extraction Error]', e);
    return null;
  }
}

export async function saveResumeHistory(payload: {
  original_text: string;
  job_description: string;
  job_title: string;
  company_name: string;
  tailored_json: AtsTailorResponse;
  ats_score: number;
  keywords_matched: string[];
  keywords_missing: string[];
  language: string;
  tailoring_strength: string;
  template_used: string;
  tailored_pdf_url: string | null;
  original_filename?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Authentication required to save history.');
  }

  // Fetch profile to check email preferences
  const { data: profile } = await supabase
    .from('profiles')
    .select('email_notifications')
    .eq('id', user.id)
    .single();

  let emailSent = false;

  // Fire off the email notification if opted-in
  if (profile?.email_notifications && payload.tailored_pdf_url) {
    try {
      const path = extractStoragePath(payload.tailored_pdf_url);
      let finalLink = payload.tailored_pdf_url;
      
      // We guarantee a fresh, high-privilege signed URL for the email
      if (path) {
        const signedData = await getFreshSignedUrls([path]);
        const signedItem = signedData?.find(s => s.path === path || (s.path && (path.endsWith(s.path) || s.path.endsWith(path))));
        if (signedItem?.signedUrl) {
          finalLink = signedItem.signedUrl;
        }
      }

      const emailAddress = user.email || '';
      
      if (emailAddress && finalLink.startsWith('http')) {
        await sendTailoredResumeEmail({
          toEmail: emailAddress,
          resumeLink: finalLink,
          atsScore: payload.ats_score,
          jobTitle: payload.job_title || 'Target Role'
        });
        emailSent = true;
      }
    } catch (e) {
      console.error('[saveResumeHistory] Failed to send email.', e);
    }
  }

  const { error } = await supabase.from('resumes').insert({
    user_id: user.id,
    original_text: payload.original_text,
    job_description: payload.job_description,
    job_title: payload.job_title,
    company_name: payload.company_name,
    tailored_json: payload.tailored_json as unknown as Record<string, unknown>, 
    ats_score: payload.ats_score,
    keywords_matched: payload.keywords_matched,
    keywords_missing: payload.keywords_missing,
    language: payload.language,
    tailoring_strength: payload.tailoring_strength,
    template_used: payload.template_used,
    tailored_pdf_url: payload.tailored_pdf_url, 
    original_filename: payload.original_filename || 'unknown_resume.pdf',
    email_sent: emailSent
  });

  if (error) {
    console.error('[SaveHistory Error]', error);
    throw new Error(`Failed to archive resume: ${error.message}`);
  }

  revalidatePath('/[locale]/dashboard/history', 'layout');
}

export async function getUserResumes() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: resumes, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !resumes) {
    console.error('[GetResumes Error]', error);
    return [];
  }

  // REFRESH SIGNED URLS ON THE FLY (Batch signing for performance)
  const pathsToSign = resumes
    .map(r => extractStoragePath(r.tailored_pdf_url))
    .filter((p): p is string => Boolean(p));

  if (pathsToSign.length > 0) {
    try {
      const signedData = await getFreshSignedUrls(pathsToSign);

      if (signedData) {
        return resumes.map((r) => {
          const path = extractStoragePath(r.tailored_pdf_url);
          if (!path) return r;
          
          const signedItem = signedData.find(s => s.path === path || (s.path && (path.endsWith(s.path) || s.path.endsWith(path))));
          
          if (!signedItem?.signedUrl) {
            console.warn(`[GetResumes] Failed to sign URL for path: ${path}`);
            return {
              ...r,
              tailored_pdf_url: r.tailored_pdf_url?.startsWith('http') ? r.tailored_pdf_url : null
            };
          }

          return {
            ...r,
            tailored_pdf_url: signedItem.signedUrl
          };
        });
      }
    } catch (signErr) {
      console.error('[GetResumes] Batch signing exception:', signErr);
    }
  }

  // Final fallback: if we still have relative paths, they will 404. 
  // We should try to at least keep them as-is if they are URLs.
  return resumes.map(r => ({
    ...r,
    tailored_pdf_url: r.tailored_pdf_url?.startsWith('http') ? r.tailored_pdf_url : null
  }));
}
