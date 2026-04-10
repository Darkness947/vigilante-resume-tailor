import { useState } from 'react';

export function useResumeTailor() {
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState<string>('');
    const [language, setLanguage] = useState<'en' | 'ar'>('en');
    const [strength, setStrength] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');
    const [template, setTemplate] = useState<'classic' | 'modern' | 'arabic-rtl'>('modern');
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [progressStep, setProgressStep] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [result, setResult] = useState<any>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    const processWorkflow = async () => {
        if (!file || !jobDescription) return;
        setIsProcessing(true);
        setPdfUrl(null);
        setResult(null);

        try {
            setProgressStep('Extracting file text...');
            const formData = new FormData();
            formData.append('file', file);
            
            const parseRes = await fetch('/api/parse', { method: 'POST', body: formData });
            if (!parseRes.ok) {
                let msg = "Parsing failed";
                try {
                    const err = await parseRes.json();
                    msg = err?.error || msg;
                } catch {}
                throw new Error(msg);
            }
            const parseData = await parseRes.json();

            setProgressStep('Tailoring with AI Engine...');
            const tailorRes = await fetch('/api/tailor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    originalResume: parseData.text,
                    jobDescription,
                    language,
                    strength
                })
            });
            if (!tailorRes.ok) {
                const errText = await tailorRes.json();
                throw new Error(errText.error || "Tailoring failed via AI");
            }
            const tailorData = await tailorRes.json();
            setResult(tailorData.data);

            setProgressStep('Compiling PDF...');
            const pdfRes = await fetch('/api/pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    htmlContent: tailorData.data.tailored_resume_html,
                    template
                })
            });
            if (!pdfRes.ok) {
                let msg = "PDF Compilation failed";
                try {
                    const err = await pdfRes.json();
                    msg = err?.error || msg;
                } catch {}
                throw new Error(msg);
            }
            const pdfData = await pdfRes.json();
            
            setPdfUrl(pdfData.url);
            setProgressStep('Completed Successfully');

            // --- SAVE TO HISTORY ---
            try {
                const { saveResumeHistory } = await import('@/lib/actions/resumes');
                await saveResumeHistory({
                    original_text: parseData.text,
                    job_description: jobDescription,
                    job_title: tailorData.data.job_title,
                    company_name: tailorData.data.company_name,
                    tailored_json: tailorData.data,
                    ats_score: tailorData.data.predicted_ats_score,
                    keywords_matched: tailorData.data.keywords_matched,
                    keywords_missing: tailorData.data.keywords_missing,
                    language,
                    tailoring_strength: strength,
                    template_used: template,
                    tailored_pdf_url: pdfData.path || pdfData.url,
                    original_filename: file.name
                });
            } catch (saveErr) {
                console.warn('[History Save] Non-blocking archive failure:', saveErr);
            }
            // ------------------------

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(err);
            setProgressStep(`Error: ${err.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        file, setFile,
        jobDescription, setJobDescription,
        language, setLanguage,
        strength, setStrength,
        template, setTemplate,
        isProcessing, progressStep,
        result, pdfUrl,
        processWorkflow
    }
}
