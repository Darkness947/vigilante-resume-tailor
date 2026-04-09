"use client";

import { Link, usePathname, useRouter } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { LanguageToggle } from '@/components/layout/LanguageToggle';
import { useTranslations } from 'next-intl';
import { Logo } from '@/components/ui/Logo';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Settings, 
  ShieldCheck, 
  LogOut, 
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function AppShell({ children, isAdmin }: { children: React.ReactNode; isAdmin?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const n = useTranslations('Nav');

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const navItems = [
    { href: '/dashboard' as const, label: n('dashboard'), icon: LayoutDashboard },
    { href: '/dashboard/settings' as const, label: n('settings'), icon: Settings },
    ...(isAdmin ? [{ href: '/admin' as const, label: n('admin'), icon: ShieldCheck }] : []),
  ] as const;

  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-surface-lowest">
      {/* Sidebar Overlay (Mobile) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 z-50 flex w-64 flex-col bg-surface-low border-r border-border/50 transition-transform duration-300 ease-in-out md:static md:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full"
      )}>
        <div className="flex h-20 items-center px-6 gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="size-8 group-hover:scale-105 transition-transform flex items-center justify-center">
              <Logo size={24} priority />
            </div>
            <span className="display-font text-xl font-black tracking-tight text-primary">
              VIGILANTE
            </span>
          </Link>
          <button 
            className="md:hidden ltr:ml-auto rtl:mr-auto p-1 text-muted-foreground"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="size-5" />
          </button>
        </div>

        <Separator className="mx-6 w-auto bg-border/50" />

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary shadow-glow relative overflow-hidden"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-nav"
                    className="absolute inset-y-0 ltr:left-0 rtl:right-0 w-1 bg-primary rounded-full"
                  />
                )}
                <Icon className={cn("size-5 transition-transform group-hover:scale-110", isActive ? "text-primary" : "text-muted-foreground")} />
                <span className="uppercase tracking-widest text-[11px]">{item.label}</span>
                {isActive && <ChevronRight className="ltr:ml-auto rtl:mr-auto size-4 ltr:rotate-0 rtl:rotate-180 opacity-50" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 mt-auto border-t border-border/50 bg-surface-lowest/50">
          <div className="mb-4">
            <LanguageToggle />
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full justify-start gap-3 rounded-xl px-4 py-6 text-destructive hover:bg-destructive/10 hover:text-destructive font-bold uppercase tracking-widest text-[11px]"
          >
            <LogOut className="size-5" />
            <span>{loggingOut ? '...' : n('signout')}</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="flex h-16 items-center border-b border-border/50 bg-surface-low px-4 md:hidden shrink-0">
          <button 
            className="p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="size-6" />
          </button>
          <div className="ltr:ml-4 rtl:mr-4">
            <span className="display-font text-lg font-black tracking-tight text-primary">VIGILANTE</span>
          </div>
          <div className="ltr:ml-auto rtl:mr-auto">
            <LanguageToggle />
          </div>
        </header>

        {/* Page Container */}
        <main className="flex-1 overflow-y-auto bg-surface-lowest custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
