import { redirect } from 'next/navigation';
import { getUser, isAdminEmail } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, Users, Activity, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await getUser();
  const t = await getTranslations('Admin');

  if (!user || !isAdminEmail(user.email)) {
    redirect(`/${locale}/dashboard`);
  }

  // Supabase Service Role Client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch Stats
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const { count: totalLogs } = await supabase
    .from('admin_audit_log')
    .select('*', { count: 'exact', head: true });

  // Fetch Latest Logs
  const { data: logs } = await supabase
    .from('admin_audit_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  const stats = [
    { label: t('stats_users'), value: totalUsers || 0, icon: Users, color: 'text-primary' },
    { label: t('stats_logs'), value: totalLogs || 0, icon: ShieldAlert, color: 'text-secondary' },
    { label: t('stats_success'), value: '100%', icon: Activity, color: 'text-emerald-400' },
  ];

  return (
    <div className="flex flex-col gap-8 p-6 lg:p-10 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4 shadow-glow">
            <ShieldAlert className="size-3" />
            <span>Secure Access Restricted</span>
          </div>
          <h1 className="display-font text-4xl font-black tracking-tight text-foreground uppercase">
            {t('title')}
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl">
            {t('desc')}
          </p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="gap-2 font-bold uppercase tracking-widest text-[10px] bg-background/50 backdrop-blur-sm border-border/50">
            <ArrowLeft className="size-3" />
            {t('back_dashboard')}
          </Button>
        </Link>
      </header>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border-border/50 bg-card/40 backdrop-blur-sm shadow-premium overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
            <CardHeader className="pb-2">
              <stat.icon className={`size-5 mb-2 ${stat.color}`} />
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mono-font text-3xl font-black text-foreground">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Logs Table */}
      <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-premium overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/30 pb-4">
          <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
            <Activity className="size-4 text-primary" />
            Internal Audit Log
          </CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/50 bg-muted/20 text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">
                <th className="px-6 py-4">{t('table_header_action')}</th>
                <th className="px-6 py-4">{t('table_header_target')}</th>
                <th className="px-6 py-4">{t('table_header_metadata')}</th>
                <th className="px-6 py-4">{t('table_header_ip')}</th>
                <th className="px-6 py-4 text-right">{t('table_header_time')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {logs && logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="group hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="font-bold border-primary/20 bg-primary/5 text-primary uppercase text-[9px] tracking-widest">
                        {log.action}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="mono-font text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">
                        {log.target_id ? log.target_id.split('-')[0] + '...' : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-[150px] lg:max-w-xs truncate mono-font text-[10px] text-muted-foreground/60 italic" title={JSON.stringify(log.metadata)}>
                        {log.metadata ? JSON.stringify(log.metadata) : '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="mono-font text-[11px] text-secondary">
                        {log.ip_address || 'Internal'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-[11px] text-muted-foreground tracking-tighter">
                        {new Date(log.created_at).toLocaleString(locale, {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground italic text-sm">
                    {t('no_logs')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
