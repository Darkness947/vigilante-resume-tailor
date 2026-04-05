import * as z from 'zod';

export const MAX_FILE_SIZE = process.env.MAX_FILE_SIZE_BYTES 
  ? parseInt(process.env.MAX_FILE_SIZE_BYTES) 
  : 5242880;

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

export const fileValidationSchema = z.object({
  file: z.any()
    .refine((file) => file instanceof Blob || file instanceof File, "Missing file payload.")
    .refine((file) => file.size <= MAX_FILE_SIZE, `File size MUST be less than ${MAX_FILE_SIZE / 1024 / 1024}MB.`)
    .refine((file) => ALLOWED_MIME_TYPES.includes(file.type), "Unsupported file type. Please upload a PDF or DOCX."),
});

// Zod Schema representing the structured JSON ATS Output from Gemini
export const AtsTailorResponseSchema = z.object({
  ats_score: z.number().min(0).max(100).describe("Optimized ATS Score out of 100 for the original text"),
  predicted_ats_score: z.number().min(0).max(100).describe("Predicted ATS score after optimization changes"),
  keywords_matched: z.array(z.string()).describe("List of critical keywords matched against job description"),
  keywords_missing: z.array(z.string()).describe("List of critical keywords missing from the prompt"),
  tailored_resume_html: z.string().describe("The hyper-optimized HTML string containing the final refined resume output with zero hallucinations, structured cleanly."),
  feedback: z.string().describe("Brief positive/constructive feedback directly addressing the user"),
});

export type AtsTailorResponse = z.infer<typeof AtsTailorResponseSchema>;
