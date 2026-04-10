"use client";

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Logo } from '@/components/ui/Logo';

export function Footer() {
  const t = useTranslations('Footer');
  const i = useTranslations('Index');

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-background/50 backdrop-blur-md pt-20 pb-12">
      <div className="mx-auto max-w-6xl px-6 lg:px-16">
        <div className="grid gap-12 md:grid-cols-4 lg:gap-16">
          {/* Brand Column */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <Logo size={32} />
              <span className="display-font text-2xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
                VIGILANTE
              </span>
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground leading-relaxed">
              {i('footer')}
            </p>
          </div>

          {/* Product Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-primary/80">
              {t('product')}
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  {t('dashboard')}
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  {t('features')}
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  {t('pricing')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-secondary/80">
              {t('company')}
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link href="/#security" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  {t('security')}
                </Link>
              </li>
              <li>
                <Link href="/#privacy" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  {t('privacy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-border/50 pt-8">
          <p className="text-xs font-medium text-muted-foreground">
            © {currentYear} VIGILANTE Resume Tailor. {t('rights')}
          </p>
          <div className="flex gap-6">
            <Link href="/#terms" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t('terms')}
            </Link>
            <Link href="/#privacy" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t('privacy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
