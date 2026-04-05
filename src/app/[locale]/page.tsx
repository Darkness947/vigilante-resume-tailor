"use client";

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Home() {
  const t = useTranslations('Index');
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
      <div className="text-center space-y-6">
        <h1 className="display-font text-6xl text-primary tracking-widest">{t('title')}</h1>
        <p className="text-xl text-muted-foreground font-sans max-w-xl mx-auto">
          Your resume, tailored for the job, AI-powered and ready for ATS.
        </p>
        <div className="flex justify-center gap-4 mt-8">
          <Link href="/auth/login" className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-10 px-8 py-2 font-heading font-medium hover:opacity-90 transition-opacity">
            Sign In
          </Link>
          <Link href="/auth/signup" className="inline-flex items-center justify-center rounded-md border border-border bg-transparent text-foreground h-10 px-8 py-2 font-heading font-medium hover:bg-surface-bright transition-colors">
            Get Started
          </Link>
        </div>
      </div>
    </main>
  );
}
