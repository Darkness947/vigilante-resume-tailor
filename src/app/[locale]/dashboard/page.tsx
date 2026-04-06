'use client';

import React, { useEffect, useId } from 'react';
import { useResumeTailor } from '@/hooks/useResumeTailor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/routing';
import { useLocale } from 'next-intl';

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

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-6 lg:p-10">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Resume tailoring</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Upload your resume and paste a job description. The engine will optimize content for ATS while
            keeping your experience truthful.
          </p>
        </div>
        <Link href="/" className="block">
          <Button type="button" variant="outline">
            Back to home
          </Button>
        </Link>
      </header>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <Card className="shadow-ambient">
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
            <CardDescription>Resume + job description + tuning settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor={fileId}>Resume file</Label>
              <div className="flex flex-col gap-3 rounded-xl border bg-card p-4">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">
                    {file ? file.name : 'Choose a PDF, DOCX, or TXT file'}
                  </p>
                  <p className="text-xs text-muted-foreground">Max size is controlled by server configuration.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <label htmlFor={fileId} className="cursor-pointer">
                    <Button type="button" variant="secondary">
                      {file ? 'Change file' : 'Select file'}
                    </Button>
                  </label>
                  {file ? (
                    <Button variant="outline" onClick={() => setFile(null)}>
                      Remove
                    </Button>
                  ) : null}
                </div>
                <input
                  id={fileId}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="sr-only"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={jdId}>Job description</Label>
              <Textarea
                id={jdId}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here…"
                className="min-h-40"
              />
            </div>

            <Tabs value={strength} onValueChange={(v) => setStrength(v as typeof strength)}>
              <div className="flex items-center justify-between gap-3">
                <Label>Tailoring strength</Label>
                <TabsList>
                  <TabsTrigger value="conservative">Conservative</TabsTrigger>
                  <TabsTrigger value="balanced">Balanced</TabsTrigger>
                  <TabsTrigger value="aggressive">Aggressive</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value={strength} className="mt-2 text-sm text-muted-foreground">
                {strength === 'conservative'
                  ? 'Minimal edits, safe keyword alignment.'
                  : strength === 'balanced'
                    ? 'Strong alignment while staying natural.'
                    : 'Maximum keyword coverage, still no hallucinations.'}
              </TabsContent>
            </Tabs>

            <div className="space-y-2">
              <Label>PDF template</Label>
              <Select value={template} onValueChange={(v) => setTemplate(v as typeof template)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">Classic ATS</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="arabic-rtl">Arabic (RTL)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={processWorkflow} disabled={!canRun} className="w-full">
                {isProcessing ? progressStep || 'Processing…' : 'Tailor resume'}
              </Button>
              {isProcessing ? (
                <p className="text-xs text-muted-foreground">
                  Keep this tab open. We’ll update the status as each step completes.
                </p>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-ambient">
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>Scores, keywords, and your generated PDF.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {result ? (
              <>
                <div className="grid gap-4">
                  <ScoreBar label="Current match" value={result.ats_score} />
                  <ScoreBar label="Predicted match" value={result.predicted_ats_score} />
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Missing keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {result.keywords_missing?.length ? (
                        result.keywords_missing.map((k: string, i: number) => (
                          <Badge key={`${k}-${i}`} variant="secondary">
                            {k}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">None detected.</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Matched keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {result.keywords_matched?.length ? (
                        result.keywords_matched.map((k: string, i: number) => (
                          <Badge key={`${k}-${i}`} variant="outline">
                            {k}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No matches yet.</p>
                      )}
                    </div>
                  </div>
                </div>

                {pdfUrl ? (
                  <div className="rounded-xl border bg-card p-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">PDF ready</p>
                      <p className="text-xs text-muted-foreground">Download the tailored resume PDF.</p>
                    </div>
                    <div className="mt-3">
                      <a href={pdfUrl} target="_blank" rel="noreferrer" className="block">
                        <Button className="w-full">Download PDF</Button>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
                    Run tailoring to generate the PDF.
                  </div>
                )}
              </>
            ) : (
              <div className="flex min-h-80 flex-col items-center justify-center gap-2 rounded-xl border bg-muted/20 p-6 text-center">
                <p className="text-sm font-medium">No results yet</p>
                <p className="text-sm text-muted-foreground">
                  Select a resume file and paste a job description, then run tailoring.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
