import { getUserResumes } from '@/lib/actions/resumes';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Download, 
  ChevronLeft, 
  FileText, 
  Target, 
  Building2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';
import { getTranslations } from 'next-intl/server';

export default async function HistoryPage({ params }: { params: { locale: string } }) {
  const resumes = await getUserResumes();
  const t = await getTranslations('History');
  const d = await getTranslations('Dashboard');

  const totalResumes = resumes.length;
  const avgScore = totalResumes > 0 
    ? Math.round(resumes.reduce((acc, r) => acc + (r.ats_score || 0), 0) / totalResumes)
    : 0;

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-8 p-6 lg:p-12">
        {/* Header Section */}
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs mb-2">
              <Clock className="size-4" />
              <span>{t('title')}</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase text-primary sm:text-5xl">
              Protocol <span className="text-foreground">Registry</span>
            </h1>
            <p className="max-w-2xl text-base font-medium text-muted-foreground">
              {t('desc')}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="outline" className="gap-2 font-bold border-border/50 hover:bg-primary/10 hover:text-primary transition-all">
                <Sparkles className="size-4" />
                {d('tailor_btn')}
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" className="gap-2 font-bold">
                <ChevronLeft className="size-4 rtl:rotate-180" />
                {d('back_home')}
              </Button>
            </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-surface-low border-border/40 shadow-premium overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{t('stats_total')}</p>
                  <p className="text-3xl font-black tracking-tight text-primary mono-font">{totalResumes}</p>
                </div>
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <FileText className="size-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface-low border-border/40 shadow-premium overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{t('stats_avg_score')}</p>
                  <p className="text-3xl font-black tracking-tight text-primary mono-font">{avgScore}%</p>
                </div>
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Target className="size-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* History List */}
        <div className="space-y-4">
          {totalResumes > 0 ? (
            <div className="grid gap-4">
              {resumes.map((resume) => (
                <Card 
                  key={resume.id} 
                  className="group bg-surface-low border-border/40 hover:border-primary/40 hover:shadow-glow transition-all duration-300 overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row lg:items-center">
                      {/* Score Badge (Side) */}
                      <div className="bg-muted/30 lg:w-32 flex lg:flex-col items-center justify-center p-6 border-b lg:border-b-0 lg:border-r border-border/40 gap-2">
                        <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">{t('score_label')}</span>
                        <span className="text-2xl font-black text-primary mono-font">{resume.ats_score}%</span>
                      </div>

                      {/* Info Content */}
                      <div className="flex-1 p-6 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-8">
                        <div className="flex-1 space-y-1">
                          <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                            {resume.job_title || 'Untitled Role'}
                            <Badge variant="outline" className="uppercase text-[9px] font-bold border-primary/20 bg-primary/5 text-primary">
                              {resume.language}
                            </Badge>
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-medium">
                            <span className="flex items-center gap-1.5">
                              <Building2 className="size-3.5" />
                              {resume.company_name || 'Generic Operative'}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="size-3.5" />
                              {format(new Date(resume.created_at), 'PPP')}
                            </span>
                          </div>
                        </div>

                        {/* Keyword Preview (Desktop) */}
                        <div className="hidden xl:flex items-center gap-3 max-w-sm">
                          <div className="flex -space-x-2">
                            {resume.keywords_matched?.slice(0, 3).map((k: string, i: number) => (
                              <div key={i} className="size-6 rounded-full bg-primary/20 border-2 border-surface-low flex items-center justify-center text-[8px] font-black text-primary uppercase">
                                {k[0]}
                              </div>
                            ))}
                            {(resume.keywords_matched?.length || 0) > 3 && (
                                <div className="size-6 rounded-full bg-muted border-2 border-surface-low flex items-center justify-center text-[8px] font-black text-muted-foreground uppercase">
                                    +{(resume.keywords_matched?.length || 0) - 3}
                                </div>
                            )}
                          </div>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Matched Assets</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-4 lg:pt-0">
                          {resume.tailored_pdf_url && (
                            <a href={resume.tailored_pdf_url} target="_blank" rel="noreferrer" className="flex-1 lg:flex-none">
                              <Button className="w-full gap-2 font-bold uppercase tracking-widest text-[11px] shadow-premium">
                                <Download className="size-4" />
                                {t('download_btn')}
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-surface-low/50 rounded-3xl border-2 border-dashed border-border/50 text-center animate-pulse">
              <div className="size-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
                <Clock className="size-10 text-muted-foreground/30" />
              </div>
              <h3 className="text-xl font-bold tracking-tight mb-2">{t('no_resumes')}</h3>
              <Link href="/dashboard">
                <Button variant="link" className="text-primary font-bold">
                  {d('tailor_btn')} &rarr;
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
