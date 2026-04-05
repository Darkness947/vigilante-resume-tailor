"use client";

import { useState } from 'react';

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobText, setJobText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function handleTestFlow(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return alert("Select a file first");
    setLoading(true);
    
    try {
      // 1. Parse File
      const fd = new FormData();
      fd.append('file', file);
      const parseRes = await fetch('/api/parse', { method: 'POST', body: fd });
      const parseData = await parseRes.json();
      if (!parseData.success) throw new Error(parseData.error);
      
      const parsedText = parseData.text;

      // 2. Tailor File
      const tailorRes = await fetch('/api/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalResume: parsedText,
          jobDescription: jobText,
          language: 'en',
          strength: 'balanced'
        })
      });

      const tailorData = await tailorRes.json();
      if (!tailorData.success) throw new Error(tailorData.error);

      setResult(tailorData.data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl display-font text-primary">Test AI Flow</h1>
      <form onSubmit={handleTestFlow} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm text-muted-foreground font-sans">Upload Resume (.txt, .pdf, .docx)</label>
          <input id="resume-upload" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full bg-surface p-2 rounded-md border border-border" />
        </div>
        <div>
          <label className="block mb-2 text-sm text-muted-foreground font-sans">Job Description</label>
          <textarea id="job-desc" value={jobText} onChange={(e) => setJobText(e.target.value)} className="w-full bg-surface p-2 rounded-md border border-border min-h-[100px]" placeholder="Paste job description here..."></textarea>
        </div>
        <button id="submit-flow" type="submit" disabled={loading} className="px-6 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50 font-heading">
          {loading ? "Processing..." : "Run Flow"}
        </button>
      </form>

      {result && (
        <div id="result-box" className="p-4 bg-surface-high rounded-md border border-border space-y-4 font-sans text-sm">
          <p><strong>ATS Score:</strong> {result.ats_score}</p>
          <p><strong>Predicted Score:</strong> {result.predicted_ats_score}</p>
          <p><strong>Keywords Matched:</strong> {result.keywords_matched?.join(', ')}</p>
          <p><strong>Feedback:</strong> {result.feedback}</p>
        </div>
      )}
    </div>
  );
}
