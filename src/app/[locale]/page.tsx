"use client";

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Home() {
  const t = useTranslations('Index');
  return (
    <div className="min-h-screen bg-[#071325] text-[#d7e3fc] flex flex-col">

      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-6 lg:px-12 py-5">
        <span className="font-[var(--font-bebas-neue)] text-2xl text-[#b8c4ff] tracking-widest uppercase">VIGILANTE</span>
        <div className="flex items-center gap-4">
          <Link
            href="/auth/login"
            className="text-sm text-[#a9abaf] hover:text-[#d7e3fc] uppercase tracking-widest transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="text-sm px-5 py-2.5 bg-gradient-to-r from-[#00C2CB] to-[#008B8B] text-white uppercase tracking-widest font-bold rounded hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6 lg:px-12">
        <div className="max-w-3xl text-center space-y-8">

          {/* Hero Badge */}
          <div className="inline-block px-4 py-1.5 bg-[#101c2e] text-[#6bd8cb] text-xs uppercase tracking-widest font-bold font-mono rounded-sm">
            AI-Powered ATS Optimization
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-none">
            <span className="text-[#d7e3fc]">Your Resume.</span>
            <br />
            <span className="text-[#6bd8cb]">Tailored.</span>
            {' '}
            <span className="text-[#b8c4ff]">Optimized.</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-lg text-[#a9abaf] max-w-xl mx-auto leading-relaxed">
            Upload your resume and a job description. VIGILANTE&apos;s AI engine injects missing keywords, restructures content, and compiles an ATS-optimized PDF — in seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-gradient-to-r from-[#00C2CB] to-[#008B8B] text-white text-sm uppercase tracking-widest font-bold rounded hover:drop-shadow-[0_0_16px_rgba(0,194,203,0.4)] transition-all"
            >
              Start Tailoring Free
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-4 bg-[#101c2e] text-[#b8c4ff] text-sm uppercase tracking-widest font-bold rounded hover:bg-[#1c2024] transition-colors"
            >
              Sign In
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-8">
            {['ATS Score Analysis', 'Keyword Injection', 'PDF Compilation', 'Multi-Language'].map((feature) => (
              <span key={feature} className="px-3 py-1.5 bg-[#101c2e] text-[#737679] text-xs uppercase tracking-widest font-mono rounded-sm">
                {feature}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-[#45474c] uppercase tracking-widest">
        VIGILANTE Resume Tailor — Engineered for career operatives.
      </footer>
    </div>
  );
}
