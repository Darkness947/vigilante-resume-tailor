"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { 
  ChevronRight, 
  User, 
  Mail, 
  Shield, 
  Globe,
  Settings as SettingsIcon,
  Save,
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export default function SettingsPage() {
  const t = useTranslations('Settings');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || '');
        setDisplayName(user.user_metadata?.full_name || '');
      }
    };
    loadUser();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        data: { full_name: displayName },
      });
      if (error) throw error;
      
      setSaved(true);
      toast.success(t('saved'));
      setTimeout(() => setSaved(false), 3000);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 p-6 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
        <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
        <ChevronRight className="size-3.5 opacity-50 ltr:rotate-0 rtl:rotate-180" />
        <span className="text-foreground">Settings</span>
      </nav>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-glow">
              <SettingsIcon className="size-5" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase sm:text-4xl">{t('title')}</h1>
          </div>
          <p className="text-base font-medium text-muted-foreground mt-2">{t('desc')}</p>
        </div>
      </header>

      <div className="grid gap-8">
        {/* Profile Settings */}
        <Card className="shadow-premium border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="size-5 text-primary" />
              General Profile
            </CardTitle>
            <CardDescription>Manage your public identity and account details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                   <Mail className="size-3" /> {t('email_label')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  disabled
                  value={email}
                  className="bg-muted/50 border-border/30 font-medium text-muted-foreground cursor-not-allowed h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <User className="size-3" /> {t('name_label')}
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your full name"
                  className="bg-card border-border/50 focus-visible:ring-primary/20 h-11 font-medium"
                />
              </div>
            </div>

            <Separator className="bg-border/30" />

            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground italic">
                {saved && `Last saved just now`}
              </p>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="gap-2 px-8 h-11 font-bold uppercase tracking-widest text-xs shadow-glow"
              >
                {saving ? (
                  <div className="size-4 rounded-full border-2 border-primary-foreground/20 border-t-primary-foreground animate-spin" />
                ) : saved ? (
                  <CheckCircle2 className="size-4" />
                ) : (
                  <Save className="size-4" />
                )}
                {saving ? '...' : saved ? t('saved') : t('save')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Placeholder Categories for Better Hierarchy */}
        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="shadow-premium border-border/50 opacity-60 grayscale hover:grayscale-0 transition-all cursor-not-allowed group">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="size-4 group-hover:text-primary transition-colors" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">Password management and two-factor authentication.</p>
            </CardContent>
          </Card>

          <Card className="shadow-premium border-border/50 opacity-60 grayscale hover:grayscale-0 transition-all cursor-not-allowed group">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="size-4 group-hover:text-primary transition-colors" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">Interface language and localization settings.</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="pt-8 border-t border-border/30 flex justify-center">
        <Link href="/dashboard">
          <Button variant="outline" className="gap-2 font-black uppercase tracking-widest text-[10px] h-10 px-6 border-border/50 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all">
            <ChevronLeft className="size-3.5 rtl:rotate-180" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
