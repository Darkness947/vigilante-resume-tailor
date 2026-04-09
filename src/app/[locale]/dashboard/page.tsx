'use client';

import React, { useEffect, useId, useRef } from 'react';
import { useResumeTailor } from '@/hooks/useResumeTailor';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import {
  UploadCloud,
  FileSearch,
  Sparkles,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronLeft,
  Info,
  Zap,
  ShieldCheck,
  Target,
  Settings as SettingsIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

function ScoreBar({ label, value, color = "bg-primary" }: { label: string; value: number; color?: string }) {
  const safe = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted-foreground">{label}</span>
        <span className="mono-font tabular-nums font-bold">{Math.round(safe)}%</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-[width] duration-1000 ease-out", color)}
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

  const strengthOptions = [
    { value: 'conservative', icon: ShieldCheck, color: 'text-blue-500' },
    { value: 'balanced', icon: Target, color: 'text-primary' },
    { value: 'aggressive', icon: Zap, color: 'text-amber-500' },
  ] as const;

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-8 p-6 lg:p-12">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter uppercase text-primary sm:text-5xl">{t('title')}</h1>
            <p className="max-w-2xl text-base font-medium text-muted-foreground">
              {t('desc')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/settings" className="block">
              <Button type="button" variant="outline" className="gap-2 font-bold hover:bg-primary/10 hover:text-primary transition-colors border-border/50">
                <SettingsIcon className="size-4" />
                {t('settings_btn')}
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button type="button" variant="ghost" className="gap-2 font-bold hover:bg-primary/10 hover:text-primary transition-colors">
                <ChevronLeft className="size-4 rtl:rotate-180" />
                {t('back_home')}
              </Button>
            </Link>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* Inputs Section */}
          <div className="lg:col-span-7 space-y-8">
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-glow">
                  <FileText className="size-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{t('input_card_title')}</h2>
                  <p className="text-sm text-muted-foreground">{t('input_card_desc')}</p>
                </div>
              </div>

              <Card className="shadow-premium border-border/50 overflow-hidden">
                <CardContent className="p-6 space-y-8">
                  {/* File Upload Dropzone */}
                  <div className="space-y-3">
                    <Label htmlFor={fileId} className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      {t('file_label')}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger><Info className="size-3.5" /></TooltipTrigger>
                          <TooltipContent>{t('file_max_size')}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>

                    <div
                      onClick={handleFileSelectClick}
                      className={cn(
                        "group relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10 transition-all cursor-pointer",
                        file
                          ? "border-primary/50 bg-primary/5"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      )}
                    >
                      <div className={cn(
                        "size-14 rounded-full flex items-center justify-center transition-colors",
                        file ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                      )}>
                        <UploadCloud className="size-7" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold">
                          {file ? file.name : t('file_select_btn')}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {file ? `${(file.size / 1024).toFixed(1)} KB` : t('file_placeholder')}
                        </p>
                      </div>

                      {file && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 font-bold hover:bg-destructive hover:text-destructive-foreground transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                          }}
                        >
                          {t('file_remove_btn')}
                        </Button>
                      )}

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

                  {/* Job Description Textarea */}
                  <div className="space-y-3">
                    <Label htmlFor={jdId} className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                      {t('jd_label')}
                    </Label>
                    <Textarea
                      id={jdId}
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder={t('jd_placeholder')}
                      className="min-h-48 resize-none focus-visible:ring-primary/30 border-border/50 text-base leading-relaxed p-4"
                    />
                  </div>

                  {/* Tailoring Strength Cards */}
                  <div className="space-y-4">
                    <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      {t('strength_label')}
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {strengthOptions.map((opt) => (
                        <div
                          key={opt.value}
                          onClick={() => setStrength(opt.value)}
                          className={cn(
                            "relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-premium",
                            strength === opt.value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/20"
                          )}
                        >
                          {strength === opt.value && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle2 className="size-4 text-primary" />
                            </div>
                          )}
                          <opt.icon className={cn("size-6", strength === opt.value ? opt.color : "text-muted-foreground")} />
                          <div className="text-center">
                            <span className="block text-sm font-bold uppercase tracking-tighter">{t(`strength_${opt.value}`)}</span>
                            <span className="block text-[10px] text-muted-foreground mt-1 leading-tight">
                              {t(`strength_desc_${opt.value}`)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Template Selector with illustrative hints */}
                  <div className="space-y-3">
                    <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                      {t('template_label')}
                    </Label>
                    <Select value={template} onValueChange={(v: typeof template | null) => v && setTemplate(v)}>
                      <SelectTrigger className="w-full h-12 rounded-xl border-border/50 focus:ring-primary/20">
                        <SelectValue placeholder={t('template_placeholder')} />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="classic" className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <FileText className="size-4 text-muted-foreground" />
                            <span>{t('template_classic')}</span>
                            <Badge variant="outline" className="text-[10px] uppercase font-bold py-0 h-4">ATS Verified</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="modern" className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <Zap className="size-4 text-primary" />
                            <span>{t('template_modern')}</span>
                            <Badge variant="secondary" className="text-[10px] uppercase font-bold py-0 h-4">Premium</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="arabic-rtl" className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <Sparkles className="size-4 text-amber-500" />
                            <span>{t('template_arabic')}</span>
                            <Badge variant="outline" className="text-[10px] uppercase font-bold py-0 h-4">Native RTL</Badge>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4 border-t border-border/50">
                    <TooltipProvider>
                      <Tooltip open={!canRun && !isProcessing && (file !== null || jobDescription !== "")}>
                        <TooltipTrigger render={
                          <div className="w-full">
                            <Button
                              onClick={processWorkflow}
                              disabled={!canRun}
                              size="lg"
                              className={cn(
                                "w-full h-14 text-base font-bold uppercase tracking-widest shadow-premium transition-all duration-300",
                                isProcessing ? "bg-muted text-muted-foreground" : "bg-primary hover:bg-primary/90"
                              )}
                            >
                              {isProcessing ? (
                                <div className="flex items-center gap-3">
                                  <div className="size-5 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                                  {progressStep || t('processing')}
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Sparkles className="size-5" />
                                  {t('tailor_btn')}
                                </div>
                              )}
                            </Button>
                          </div>
                        } />
                        <TooltipContent className="bg-destructive text-destructive-foreground font-bold border-none shadow-premium">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="size-4" />
                            {!file ? "Select a resume file" : !jobDescription ? "Paste a job description" : "Please wait..."}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {isProcessing && (
                      <p className="text-center text-xs font-bold text-primary mt-4 animate-pulse uppercase tracking-widest">
                        {t('processing_hint')}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-5 space-y-8">
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shadow-premium">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{t('results_card_title')}</h2>
                  <p className="text-sm text-muted-foreground">{t('results_card_desc')}</p>
                </div>
              </div>

              <Card className="shadow-premium border-border/50 min-h-[600px] flex flex-col bg-card/50 backdrop-blur-sm">
                <CardContent className={cn(
                  "p-6 flex-1 flex flex-col",
                  !result && "items-center justify-center"
                )}>
                  {result ? (
                    <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
                      {/* ATS Scores */}
                      <div className="grid gap-6">
                        <div className="p-4 rounded-2xl bg-muted/40 border border-border/50">
                          <ScoreBar label={t('score_current')} value={result.ats_score} color="bg-muted-foreground" />
                        </div>
                        <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 shadow-glow">
                          <ScoreBar label={t('score_predicted')} value={result.predicted_ats_score} color="bg-primary" />
                          <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-3 flex items-center gap-1.5">
                            <Zap className="size-3" /> Potential gain: {Math.max(0, result.predicted_ats_score - result.ats_score)}%
                          </p>
                        </div>
                      </div>

                      {/* Keywords Analysis */}
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <AlertCircle className="size-3 text-amber-500" /> {t('keywords_missing')}
                          </p>
                          <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-muted/30 border border-border/50">
                            {result.keywords_missing && result.keywords_missing.length > 0 ? (
                              result.keywords_missing.map((k: string, i: number) => (
                                <Badge key={`${k}-${i}`} variant="secondary" className="rounded-md font-bold text-xs px-3 py-1 border border-border/50">
                                  {k}
                                </Badge>
                              ))
                            ) : (
                              <p className="text-xs font-medium text-muted-foreground italic px-2">{t('keywords_none')}</p>
                            )}
                          </div>
                        </div>
 
                        <div className="space-y-3">
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <CheckCircle2 className="size-3 text-primary" /> {t('keywords_matched')}
                          </p>
                          <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-muted/30 border border-border/50">
                            {result.keywords_matched && result.keywords_matched.length > 0 ? (
                              result.keywords_matched.map((k: string, i: number) => (
                                <Badge key={`${k}-${i}`} variant="outline" className="rounded-md font-bold text-xs px-3 py-1 bg-background">
                                  {k}
                                </Badge>
                              ))
                            ) : (
                              <p className="text-xs font-medium text-muted-foreground italic px-2">{t('keywords_no_matches')}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Download Section */}
                      <div className="pt-6 border-t border-border/50">
                        {pdfUrl ? (
                          <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 space-y-4 shadow-glow">
                            <div>
                              <p className="text-lg font-black uppercase tracking-tight text-primary flex items-center gap-2">
                                <Download className="size-5" /> {t('pdf_ready')}
                              </p>
                              <p className="text-xs font-medium text-muted-foreground mt-1">{t('pdf_ready_desc')}</p>
                            </div>
                            <a href={pdfUrl} target="_blank" rel="noreferrer" className="block">
                              <Button className="w-full h-12 text-sm font-bold uppercase tracking-widest shadow-premium">
                                {t('pdf_download_btn')}
                              </Button>
                            </a>
                          </div>
                        ) : (
                          <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
                            <FileText className="size-8 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                              {t('pdf_run_hint')}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-12 animate-pulse">
                      <div className="size-24 rounded-full bg-muted/50 flex items-center justify-center mb-6">
                        <FileSearch className="size-10 text-muted-foreground/40" />
                      </div>
                      <h3 className="text-xl font-bold tracking-tight mb-2">{t('empty_state_title')}</h3>
                      <p className="max-w-[240px] text-sm text-muted-foreground leading-relaxed font-medium">
                        {t('empty_state_desc')}
                      </p>

                      <div className="mt-8 space-y-3 w-full max-w-[200px]">
                        <div className="flex items-center gap-3 text-left">
                          <div className={cn("size-5 rounded-full flex items-center justify-center text-[10px] font-bold", file ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>1</div>
                          <span className={cn("text-xs font-bold", file ? "text-foreground" : "text-muted-foreground")}>Upload resume</span>
                        </div>
                        <div className="flex items-center gap-3 text-left">
                          <div className={cn("size-5 rounded-full flex items-center justify-center text-[10px] font-bold", jobDescription ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>2</div>
                          <span className={cn("text-xs font-bold", jobDescription ? "text-foreground" : "text-muted-foreground")}>Paste job description</span>
                        </div>
                        <div className="flex items-center gap-3 text-left">
                          <div className="size-5 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-[10px] font-bold">3</div>
                          <span className="text-xs font-bold text-muted-foreground">Tailor resume</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
