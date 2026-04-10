import * as z from 'zod';

const parsedMax = process.env.MAX_FILE_SIZE_BYTES ? Number(process.env.MAX_FILE_SIZE_BYTES) : NaN;
export const MAX_FILE_SIZE = Number.isFinite(parsedMax) && parsedMax > 0 ? parsedMax : 5242880;

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

const BY_EXTENSION_MIME: Record<string, string> = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  txt: 'text/plain',
};

function inferMimeType(file: File | Blob) {
  const anyFile = file as File;
  const name = typeof anyFile.name === 'string' ? anyFile.name : '';
  const ext = name.includes('.') ? name.split('.').pop()?.toLowerCase() : undefined;
  return ext ? BY_EXTENSION_MIME[ext] : undefined;
}

export const fileValidationSchema = z.object({
  file: z.any()
    .refine((file) => file instanceof Blob || file instanceof File, "Missing file payload.")
    .refine((file) => file.size <= MAX_FILE_SIZE, `File size MUST be less than ${MAX_FILE_SIZE / 1024 / 1024}MB.`)
    .refine((file) => {
      const fileType = (file as File).type || inferMimeType(file as File);
      return Boolean(fileType && ALLOWED_MIME_TYPES.includes(fileType));
    }, "Unsupported file type. Please upload a PDF or DOCX."),
});

// Zod Schema representing the structured JSON ATS Output from Gemini
export const AtsTailorResponseSchema = z.object({
  ats_score: z.number().min(0).max(100).describe("Optimized ATS Score out of 100 for the original text"),
  predicted_ats_score: z.number().min(0).max(100).describe("Predicted ATS score after optimization changes"),
  keywords_matched: z.array(z.string()).describe("List of critical keywords matched against job description"),
  keywords_missing: z.array(z.string()).describe("List of critical keywords missing from the prompt"),
  tailored_resume_html: z.string().describe("The hyper-optimized HTML string containing the final refined resume output with zero hallucinations, structured cleanly."),
  feedback: z.string().describe("Brief positive/constructive feedback directly addressing the user"),
  job_title: z.string().describe("The extracted job title from the job description"),
  company_name: z.string().describe("The extracted company name from the job description if available, else 'Unknown'"),
});

export type AtsTailorResponse = z.infer<typeof AtsTailorResponseSchema>;
