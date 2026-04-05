"use client";

import { Link, usePathname, useRouter } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const navItems = [
    { href: '/dashboard' as const, label: 'Dashboard', icon: '⊞' },
    { href: '/admin' as const, label: 'Admin', icon: '⊡' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#071325]">
      {/* Fixed Sidebar — surface-container-lowest for "recessed" feel */}
      <aside className="w-60 bg-[#030e20] hidden md:flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6">
          <Link href="/dashboard">
            <span className="font-[var(--font-bebas-neue)] text-2xl text-[#b8c4ff] tracking-widest uppercase hover:opacity-80 transition-opacity cursor-pointer">VIGILANTE</span>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#101c2e] text-[#6bd8cb]'
                    : 'text-[#737679] hover:text-[#d7e3fc] hover:bg-[#101c2e]'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="uppercase tracking-widest text-xs">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full py-2.5 text-xs uppercase tracking-widest font-bold text-[#ffb4ab] bg-[#101c2e] rounded hover:bg-[#1c2024] transition-colors disabled:opacity-50"
          >
            {loggingOut ? 'Exiting...' : 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#030e20] h-14 flex items-center justify-between px-4">
        <Link href="/dashboard">
          <span className="font-[var(--font-bebas-neue)] text-xl text-[#b8c4ff] tracking-widest uppercase">VIGILANTE</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className={`text-xs uppercase tracking-widest font-bold ${pathname === '/dashboard' ? 'text-[#6bd8cb]' : 'text-[#737679]'}`}>
            Dash
          </Link>
          <Link href="/admin" className={`text-xs uppercase tracking-widest font-bold ${pathname.startsWith('/admin') ? 'text-[#6bd8cb]' : 'text-[#737679]'}`}>
            Admin
          </Link>
          <button onClick={handleLogout} className="text-xs text-[#ffb4ab] uppercase tracking-widest font-bold">
            Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto md:pt-0 pt-14">
        {children}
      </main>
    </div>
  );
}
