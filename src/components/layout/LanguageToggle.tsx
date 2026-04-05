"use client";

import { useRouter, usePathname } from '@/i18n/routing';
import { useLocale } from 'next-intl';

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <button
      onClick={switchLocale}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-widest bg-[#101c2e] text-[#a9abaf] hover:text-[#d7e3fc] hover:bg-[#1c2024] rounded transition-colors"
      title={locale === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      <span className="text-base">{locale === 'en' ? '🌐' : '🌐'}</span>
      <span>{locale === 'en' ? 'العربية' : 'English'}</span>
    </button>
  );
}
