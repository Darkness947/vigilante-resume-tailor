import { useState } from 'react';

export function useResumeTailor() {
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState<string>('');
    const [language, setLanguage] = useState<'en' | 'ar'>('en');
    const [strength, setStrength] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');
    const [template, setTemplate] = useState<'classic' | 'modern' | 'arabic-rtl'>('modern');
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [progressStep, setProgressStep] = useState<string>('');
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
            if (!parseRes.ok) throw new Error("Parsing failed");
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
            if (!pdfRes.ok) throw new Error("PDF Compilation failed");
            const pdfData = await pdfRes.json();
            
            setPdfUrl(pdfData.url);
            setProgressStep('Completed Successfully');
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
