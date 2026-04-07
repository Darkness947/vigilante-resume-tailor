'use client';

import React, { useEffect, useId, useRef } from 'react';
import { useResumeTailor } from '@/hooks/useResumeTailor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';

function ScoreBar({ label, value }: { label: string; value: number }) {
  const safe = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="mono-font tabular-nums">{Math.round(safe)}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-secondary transition-[width] duration-700"
          style={{ width: `${safe}%` }}
        />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const fileId = useId();
  const jdId = useId();
  const locale = useLocale();
  const t = useTranslations('Dashboard');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    file,
    setFile,
    jobDescription,
    setJobDescription,
    setLanguage,
    strength,
    setStrength,
    template,
    setTemplate,
    isProcessing,
    progressStep,
    result,
    pdfUrl,
    processWorkflow,
  } = useResumeTailor();

  const canRun = Boolean(file && jobDescription && !isProcessing);

  useEffect(() => {
    setLanguage(locale === 'ar' ? 'ar' : 'en');
  }, [locale, setLanguage]);

  const handleFileSelectClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-6 lg:p-10">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">{t('title')}</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            {t('desc')}
          </p>
        </div>
        <Link href="/" className="block">
          <Button type="button" variant="outline">
            {t('back_home')}
          </Button>
        </Link>
      </header>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <Card className="shadow-ambient">
          <CardHeader>
            <CardTitle>{t('input_card_title')}</CardTitle>
            <CardDescription>{t('input_card_desc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor={fileId}>{t('file_label')}</Label>
              <div className="flex flex-col gap-3 rounded-xl border bg-card p-4">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">
                    {file ? file.name : t('file_placeholder')}
                  </p>
                  <p className="text-xs text-muted-foreground">{t('file_max_size')}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button type="button" variant="secondary" onClick={handleFileSelectClick}>
                    {file ? t('file_change_btn') : t('file_select_btn')}
                  </Button>
                  {file ? (
                    <Button variant="outline" onClick={() => setFile(null)}>
                      {t('file_remove_btn')}
                    </Button>
                  ) : null}
                </div>
                <input
                  id={fileId}
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="sr-only"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={jdId}>{t('jd_label')}</Label>
              <Textarea
                id={jdId}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder={t('jd_placeholder')}
                className="min-h-40"
              />
            </div>

            <Tabs value={strength} onValueChange={(v) => setStrength(v as typeof strength)}>
              <div className="flex items-center justify-between gap-3">
                <Label>{t('strength_label')}</Label>
                <TabsList>
                  <TabsTrigger value="conservative">{t('strength_conservative')}</TabsTrigger>
                  <TabsTrigger value="balanced">{t('strength_balanced')}</TabsTrigger>
                  <TabsTrigger value="aggressive">{t('strength_aggressive')}</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value={strength} className="mt-2 text-sm text-muted-foreground">
                {strength === 'conservative'
                  ? t('strength_desc_conservative')
                  : strength === 'balanced'
                    ? t('strength_desc_balanced')
                    : t('strength_desc_aggressive')}
              </TabsContent>
            </Tabs>

            <div className="space-y-2">
              <Label>{t('template_label')}</Label>
              <Select value={template} onValueChange={(v) => setTemplate(v as typeof template)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('template_placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">{t('template_classic')}</SelectItem>
                  <SelectItem value="modern">{t('template_modern')}</SelectItem>
                  <SelectItem value="arabic-rtl">{t('template_arabic')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={processWorkflow} disabled={!canRun} className="w-full">
                {isProcessing ? progressStep || t('processing') : t('tailor_btn')}
              </Button>
              {isProcessing ? (
                <p className="text-xs text-muted-foreground">
                  {t('processing_hint')}
                </p>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-ambient">
          <CardHeader>
            <CardTitle>{t('results_card_title')}</CardTitle>
            <CardDescription>{t('results_card_desc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {result ? (
              <>
                <div className="grid gap-4">
                  <ScoreBar label={t('score_current')} value={result.ats_score} />
                  <ScoreBar label={t('score_predicted')} value={result.predicted_ats_score} />
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{t('keywords_missing')}</p>
                    <div className="flex flex-wrap gap-2">
                      {result.keywords_missing?.length ? (
                        result.keywords_missing.map((k: string, i: number) => (
                          <Badge key={`${k}-${i}`} variant="secondary">
                            {k}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">{t('keywords_none')}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">{t('keywords_matched')}</p>
                    <div className="flex flex-wrap gap-2">
                      {result.keywords_matched?.length ? (
                        result.keywords_matched.map((k: string, i: number) => (
                          <Badge key={`${k}-${i}`} variant="outline">
                            {k}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">{t('keywords_no_matches')}</p>
                      )}
                    </div>
                  </div>
                </div>

                {pdfUrl ? (
                  <div className="rounded-xl border bg-card p-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">{t('pdf_ready')}</p>
                      <p className="text-xs text-muted-foreground">{t('pdf_ready_desc')}</p>
                    </div>
                    <div className="mt-3">
                      <a href={pdfUrl} target="_blank" rel="noreferrer" className="block">
                        <Button className="w-full">{t('pdf_download_btn')}</Button>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
                    {t('pdf_run_hint')}
                  </div>
                )}
              </>
            ) : (
              <div className="flex min-h-80 flex-col items-center justify-center gap-2 rounded-xl border bg-muted/20 p-6 text-center">
                <p className="text-sm font-medium">{t('empty_state_title')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('empty_state_desc')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
