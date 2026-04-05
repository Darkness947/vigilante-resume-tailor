'use client';

import React from 'react';
import { useResumeTailor } from '@/hooks/useResumeTailor';

// --- Subcomponents ---

function ScoreRing({ score, label, color = "#00C2CB" }: { score: number, label: string, color?: string }) {
  const safeScore = score || 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative w-32 h-40">
      <svg className="w-32 h-32 absolute top-0 transform -rotate-90">
        <circle cx="64" cy="64" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-[#101c2e]" />
        <circle 
          cx="64" cy="64" r={radius} 
          stroke={color} strokeWidth="8" fill="transparent" 
          strokeDasharray={circumference} 
          strokeDashoffset={strokeDashoffset} 
          className="transition-all duration-1000 ease-out stroke-current drop-shadow-[0_0_8px_rgba(0,194,203,0.3)]" 
        />
      </svg>
      <div className="absolute top-10 font-mono text-2xl font-bold text-[#d7e3fc]">{Math.round(safeScore)}</div>
      <span className="absolute bottom-0 text-xs text-[#a9abaf] font-medium tracking-widest uppercase">{label}</span>
    </div>
  );
}

// --- Main Page ---

export default function DashboardPage() {
  const { 
    file, setFile, 
    jobDescription, setJobDescription, 
    language, setLanguage, 
    strength, setStrength, 
    template, setTemplate, 
    isProcessing, progressStep, 
    result, pdfUrl, 
    processWorkflow 
  } = useResumeTailor();

  return (
    <div className="bg-[#071325] min-h-screen text-[#d7e3fc] p-6 lg:p-12 font-sans selection:bg-[#00C2CB] selection:text-[#01172C]">
      
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="mb-10">
          <h1 className="text-4xl font-black tracking-tight text-white mb-2 uppercase">Tailor Your Resume</h1>
          <p className="text-[#a9abaf] text-sm max-w-xl">Upload your current resume and the target job description. The AI engine will bypass standard ATS constraints and inject critical missing skills.</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          
          {/* LEFT COLUMN: Input Control */}
          <div className="space-y-6">
            
            {/* File Upload Zone */}
            <div className="bg-[#101c2e] p-6 rounded-3xl relative overflow-hidden group">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#45484c] group-hover:border-[#00C2CB] transition-colors rounded-2xl p-10 cursor-pointer h-40">
                <span className="text-[#00C2CB] mb-2">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                </span>
                <span className="font-semibold">{file ? file.name : "System.upload(resume)"}</span>
                <span className="text-xs text-[#737679] mt-1">.PDF or .DOCX format</span>
                <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </label>
            </div>

            {/* Description Box */}
            <div className="bg-[#101c2e] p-6 rounded-3xl">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#a9abaf] mb-4">Target Payload (Job Description)</h3>
              <textarea 
                className="w-full bg-[#1c2024] border-b-2 border-transparent focus:border-[#00C2CB] outline-none rounded-xl p-4 min-h-[160px] text-sm resize-y"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
              />
            </div>

            {/* Settings Toggles */}
            <div className="bg-[#101c2e] p-6 rounded-3xl flex flex-col gap-6">
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#a9abaf]">Aggressive Injection</label>
                <div className="grid grid-cols-3 gap-2">
                  {['conservative', 'balanced', 'aggressive'].map((opt) => (
                    <button 
                      key={opt}
                      onClick={() => setStrength(opt as any)}
                      className={`py-2 px-3 text-xs uppercase font-bold rounded-lg transition-all ${strength === opt ? 'bg-[#00555a] text-[#00f1fe] drop-shadow-[0_0_12px_rgba(0,241,254,0.3)]' : 'bg-[#1c2024] text-[#a9abaf] hover:bg-[#282d31]'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#a9abaf]">Extraction Template</label>
                <select 
                  className="bg-[#1c2024] p-3 rounded-lg text-sm outline-none w-full border-b-2 border-transparent focus:border-[#00C2CB]"
                  value={template}
                  onChange={e => setTemplate(e.target.value as any)}
                >
                  <option value="classic">01. Classic ATS (Grayscale)</option>
                  <option value="modern">02. Modern Protocol (Indigo)</option>
                  <option value="arabic-rtl">03. Arabic Target (RTL)</option>
                </select>
              </div>

            </div>

            {/* Action CTA */}
            <button 
              disabled={isProcessing || !file || !jobDescription}
              onClick={processWorkflow}
              className={`w-full py-4 uppercase tracking-widest font-bold text-sm text-center transition-all ${isProcessing || !file || !jobDescription ? 'bg-[#1c2024] text-[#a9abaf] cursor-not-allowed' : 'bg-gradient-to-r from-[#00C2CB] to-[#008B8B] text-white hover:drop-shadow-[0_0_16px_rgba(0,194,203,0.4)]'}`}
              style={{ borderRadius: '4px' }}
            >
              {isProcessing ? progressStep || "Processing..." : "Commence Tailoring"}
            </button>

          </div>

          {/* RIGHT COLUMN: Results & Analytics */}
          <div className="bg-[#101c2e] p-8 rounded-3xl min-h-[600px] flex flex-col relative items-center">
            <h2 className="text-lg font-bold tracking-widest uppercase mb-8 self-start w-full border-b border-[#1c2024] pb-4">Analysis Matrix</h2>
            
            {result ? (
              <div className="w-full flex-grow flex flex-col items-center">
                
                {/* Score Rings */}
                <div className="flex gap-8 mb-10 w-full justify-center">
                  <ScoreRing score={result.ats_score} label="Base Match" color="#ff716c" />
                  <ScoreRing score={result.predicted_ats_score} label="New Match" color="#00f1fe" />
                </div>

                {/* Keywords Layout */}
                <div className="w-full space-y-6">
                  
                  <div>
                    <h4 className="text-xs text-[#a9abaf] uppercase tracking-widest mb-3">Critical Missing Terms Interjected</h4>
                    <div className="flex flex-wrap gap-2">
                       {result.keywords_missing?.map((k: string, i: number) => (
                         <span key={i} className="px-2 py-1 bg-[#2a0043] text-[#d896ff] rounded-[2px] text-[10px] font-mono tracking-tight">{k}</span>
                       ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs text-[#a9abaf] uppercase tracking-widest mb-3">Verified Existing Terms</h4>
                    <div className="flex flex-wrap gap-2">
                       {result.keywords_matched?.map((k: string, i: number) => (
                         <span key={i} className="px-2 py-1 bg-[#004145] text-[#99f7ff] rounded-[2px] text-[10px] font-mono tracking-tight">{k}</span>
                       ))}
                    </div>
                  </div>

                  {/* PDF Download Box */}
                  {pdfUrl && (
                    <div className="mt-12 pt-6 border-t border-[#1c2024] w-full flex flex-col gap-4">
                       <p className="text-xs text-center text-[#00f1fe] font-mono drop-shadow-[0_0_8px_rgba(0,241,254,0.3)]">Document Compilation Complete.</p>
                       <a href={pdfUrl} target="_blank" rel="noreferrer" className="block w-full py-4 text-center bg-[#f8f9fe] text-[#0b0e11] font-bold uppercase tracking-widest text-sm hover:opacity-90 rounded-[4px]">
                          Download Secure PDF
                       </a>
                    </div>
                  )}

                </div>
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center opacity-40">
                <svg className="w-16 h-16 text-[#45484c] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <p className="font-mono text-sm">AWAITING PAYLOAD INJECTION</p>
              </div>
            )}
            
          </div>

        </div>
      </div>
    </div>
  );
}
