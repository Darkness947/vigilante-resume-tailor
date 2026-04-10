"use client";
 
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { Link } from '@/i18n/routing';
import { LanguageToggle } from '@/components/layout/LanguageToggle';
import { AuthNav } from '@/components/layout/AuthNav';
import { ConnectSection } from '@/components/layout/ConnectSection';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { checkAdminStatus } from '@/lib/actions/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Logo } from '@/components/ui/Logo';
import { UploadCloud, FileText, Sparkles, CheckCircle2 } from 'lucide-react';

function HowToUse() {
  const t = useTranslations('HowTo');
  const shouldReduceMotion = useReducedMotion();

  const steps = [
    { k: 'step1', n: '01', icon: UploadCloud, color: 'text-teal-500' },
    { k: 'step2', n: '02', icon: FileText, color: 'text-purple-500' },
    { k: 'step3', n: '03', icon: Sparkles, color: 'text-amber-500' },
  ] as const;

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-16">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-16 flex flex-col gap-3 text-center md:text-start"
      >
        <p className="text-sm font-bold uppercase tracking-widest text-primary/80">{t('eyebrow')}</p>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('title')}</h2>
        <p className="max-w-2xl text-base text-muted-foreground leading-relaxed">{t('subtitle')}</p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-3">
        {steps.map((s, idx) => (
          <motion.div
            key={s.k}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
          >
            <Card className="shadow-premium border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-glow group h-full">
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl bg-muted group-hover:bg-muted/80 transition-colors ${s.color}`}>
                    <s.icon className="size-6" />
                  </div>
                  <span className="mono-font text-2xl font-black text-muted-foreground/20 group-hover:text-primary/20 transition-colors">{s.n}</span>
                </div>
                <CardTitle className="text-xl font-bold">{t(`${s.k}.title`)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`${s.k}.desc`)}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('Index');
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const supabase = createClient();
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const adminStatus = await checkAdminStatus();
        setIsAdmin(adminStatus);
      }
      
      setLoading(false);
    };
    getUser();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Background Orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={shouldReduceMotion ? undefined : { opacity: 0.15 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-secondary blur-[120px]"
        />
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={shouldReduceMotion ? undefined : { opacity: 0.1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
          className="absolute -bottom-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary blur-[120px]"
        />
      </div>

      <nav className="sticky top-0 z-50 w-full glassmorphism border-b border-border/10">
        <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-6 lg:px-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative size-10 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
              <Logo size={40} priority />
            </div>
            <span className="display-font text-xl font-black tracking-tight group-hover:text-primary transition-colors">
              {t('title')}
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <AuthNav isAdmin={isAdmin} />
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-16 lg:pt-24">
        {/* Hero Section */}
        <section className="mx-auto w-full max-w-6xl px-6 pb-20 lg:px-16">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-xs font-bold uppercase tracking-widest text-primary shadow-glow"
            >
              <CheckCircle2 className="size-3.5" />
              <span className="mono-font">{t('feature_ats')}</span>
            </motion.div>

            <h1 className="text-balance text-5xl font-black tracking-tighter sm:text-7xl lg:text-8xl leading-[0.9]">
              <span className="block">{t('hero_line1')}</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-secondary to-purple-400">{t('hero_line2')}</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400">{t('hero_line3')}</span>
            </h1>

            <p className="max-w-2xl text-pretty text-lg font-medium text-muted-foreground/80 leading-relaxed sm:text-xl">
              {t('hero_desc')}
            </p>

            <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row mt-4">
              <Link href={user ? "/dashboard" : "/auth/signup"} className="block">
                <Button size="lg" className="h-14 w-full px-10 text-base font-bold shadow-premium sm:w-auto">
                  {t('cta_start')}
                </Button>
              </Link>
              {!user && !loading && (
                <Link href="/auth/login" className="block">
                  <Button size="lg" variant="outline" className="h-14 w-full px-10 text-base font-bold bg-background/50 hover:bg-background/80 sm:w-auto">
                    {t('cta_signin')}
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </section>

        <HowToUse />

        <ConnectSection />

        <Footer />
      </main>
    </div>
  );
}
