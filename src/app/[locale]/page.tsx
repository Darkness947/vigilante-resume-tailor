"use client";

import { Link } from '@/i18n/routing';
import { LanguageToggle } from '@/components/layout/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';

function HowToUse() {
  const t = useTranslations('HowTo');
  const shouldReduceMotion = useReducedMotion();

  const steps = [
    { k: 'step1', n: '01' },
    { k: 'step2', n: '02' },
    { k: 'step3', n: '03' },
  ] as const;

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-16">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mb-10 flex flex-col gap-2"
      >
        <p className="text-sm font-medium text-muted-foreground">{t('eyebrow')}</p>
        <h2 className="text-3xl font-semibold tracking-tight">{t('title')}</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">{t('subtitle')}</p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((s, idx) => (
          <motion.div
            key={s.k}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.45, delay: idx * 0.08, ease: 'easeOut' }}
          >
            <Card className="shadow-ambient">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base">{t(`${s.k}.title`)}</CardTitle>
                <span className="mono-font text-xs text-muted-foreground">{s.n}</span>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t(`${s.k}.desc`)}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const t = useTranslations('Index');
  const n = useTranslations('Nav');
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute -top-32 inset-s-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-secondary/10 blur-3xl"
        />
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          className="absolute -bottom-32 inset-s-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        />
      </div>

      <nav className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 lg:px-16">
        <span className="display-font text-lg text-primary">{t('title')}</span>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Link href="/auth/login" className="hidden sm:block">
            <Button type="button" variant="ghost">
              {n('signin')}
            </Button>
          </Link>
          <Link href="/auth/signup" className="block">
            <Button type="button">{n('signup')}</Button>
          </Link>
        </div>
      </nav>

      <main className="relative z-10">
        <section className="mx-auto w-full max-w-6xl px-6 pb-6 pt-10 lg:px-16 lg:pt-16">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-xs text-muted-foreground shadow-ambient">
              <span className="size-2 rounded-full bg-secondary" />
              <span className="mono-font">{t('feature_ats')}</span>
            </div>

            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="block">{t('hero_line1')}</span>
              <span className="block text-secondary">{t('hero_line2')}</span>
              <span className="block text-primary">{t('hero_line3')}</span>
            </h1>

            <p className="text-pretty text-base text-muted-foreground sm:text-lg">
              {t('hero_desc')}
            </p>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link href="/auth/signup" className="block">
                <Button className="w-full sm:w-auto">{t('cta_start')}</Button>
              </Link>
              <Link href="/auth/login" className="block">
                <Button variant="outline" className="w-full sm:w-auto">
                  {t('cta_signin')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        <HowToUse />

        <section className="mx-auto w-full max-w-6xl px-6 pb-14 lg:px-16">
          <Card className="shadow-ambient">
            <CardHeader>
              <CardTitle>{t('footer')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">{t('hero_desc')}</p>
              <div className="flex flex-wrap gap-2">
                <Link href="/auth/login" className="block">
                  <Button variant="ghost">{n('signin')}</Button>
                </Link>
                <Link href="/auth/signup" className="block">
                  <Button>{n('signup')}</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
