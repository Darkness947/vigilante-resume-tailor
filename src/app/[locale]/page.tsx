"use client";

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { LanguageToggle } from '@/components/layout/LanguageToggle';

export default function Home() {
  const t = useTranslations('Index');
  const n = useTranslations('Nav');

  return (
    <div className="min-h-screen bg-[#071325] text-[#d7e3fc] flex flex-col overflow-hidden">

      {/* ── Navigation Bar ── */}
      <nav className="flex items-center justify-between px-6 lg:px-16 py-5 relative z-10">
        <span className="font-[var(--font-bebas-neue)] text-2xl text-[#b8c4ff] tracking-[0.2em] uppercase">{t('title')}</span>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Link
            href="/auth/login"
            className="text-sm text-[#a9abaf] hover:text-[#d7e3fc] uppercase tracking-widest transition-colors hidden sm:inline"
          >
            {n('signin')}
          </Link>
          <Link
            href="/auth/signup"
            className="text-sm px-5 py-2.5 bg-gradient-to-r from-[#00C2CB] to-[#008B8B] text-white uppercase tracking-widest font-bold rounded hover:opacity-90 transition-opacity"
          >
            {n('signup')}
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <main className="flex-1 flex items-center justify-center px-6 lg:px-16 relative">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#6bd8cb] rounded-full opacity-[0.03] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#b8c4ff] rounded-full opacity-[0.04] blur-[120px] pointer-events-none" />

        <div className="max-w-4xl text-center space-y-10 relative z-10">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#101c2e] text-[#6bd8cb] text-xs uppercase tracking-widest font-bold font-mono rounded-sm animate-pulse">
            <span className="w-2 h-2 bg-[#6bd8cb] rounded-full" />
            AI-Powered ATS Optimization Engine
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black uppercase tracking-tight leading-[0.9]">
            <span className="block text-[#d7e3fc] opacity-0 animate-[fadeInUp_0.6s_ease_0.1s_forwards]">{t('hero_line1')}</span>
            <span className="block text-[#6bd8cb] opacity-0 animate-[fadeInUp_0.6s_ease_0.3s_forwards]">{t('hero_line2')}</span>
            <span className="block text-[#b8c4ff] opacity-0 animate-[fadeInUp_0.6s_ease_0.5s_forwards]">{t('hero_line3')}</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-base sm:text-lg text-[#a9abaf] max-w-2xl mx-auto leading-relaxed opacity-0 animate-[fadeInUp_0.6s_ease_0.7s_forwards]">
            {t('hero_desc')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 opacity-0 animate-[fadeInUp_0.6s_ease_0.9s_forwards]">
            <Link
              href="/auth/signup"
              className="group px-8 py-4 bg-gradient-to-r from-[#00C2CB] to-[#008B8B] text-white text-sm uppercase tracking-widest font-bold rounded hover:shadow-[0_0_32px_rgba(0,194,203,0.3)] transition-all"
            >
              <span className="group-hover:tracking-[0.3em] transition-all">{t('cta_start')}</span>
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-4 bg-[#101c2e] text-[#b8c4ff] text-sm uppercase tracking-widest font-bold rounded hover:bg-[#1c2024] transition-colors"
            >
              {t('cta_signin')}
            </Link>
          </div>

          {/* Feature Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-10 opacity-0 animate-[fadeInUp_0.6s_ease_1.1s_forwards]">
            {[t('feature_ats'), t('feature_keywords'), t('feature_pdf'), t('feature_lang')].map((feature) => (
              <span key={feature} className="px-4 py-2 bg-[#101c2e] text-[#737679] text-xs uppercase tracking-widest font-mono rounded-sm hover:text-[#6bd8cb] hover:bg-[#142032] transition-colors cursor-default">
                {feature}
              </span>
            ))}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto pt-8 opacity-0 animate-[fadeInUp_0.6s_ease_1.3s_forwards]">
            <div className="text-center">
              <p className="text-2xl font-bold font-mono text-[#6bd8cb]">95%</p>
              <p className="text-[10px] text-[#45474c] uppercase tracking-widest mt-1">ATS Pass Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold font-mono text-[#b8c4ff]">3s</p>
              <p className="text-[10px] text-[#45474c] uppercase tracking-widest mt-1">Avg Tailor Time</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold font-mono text-[#6bd8cb]">EN/AR</p>
              <p className="text-[10px] text-[#45474c] uppercase tracking-widest mt-1">Languages</p>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="py-8 px-6 lg:px-16">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#45474c] uppercase tracking-widest">
            {t('footer')}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/auth/login" className="text-xs text-[#45474c] hover:text-[#737679] uppercase tracking-widest transition-colors">
              {n('signin')}
            </Link>
            <Link href="/auth/signup" className="text-xs text-[#45474c] hover:text-[#737679] uppercase tracking-widest transition-colors">
              {n('signup')}
            </Link>
          </div>
        </div>
      </footer>

      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
