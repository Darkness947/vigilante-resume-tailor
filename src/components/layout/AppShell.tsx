"use client";

import { Link } from '@/i18n/routing';
import { usePathname } from '@/i18n/routing';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-border bg-surface-low hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <span className="display-font text-2xl text-primary">VIGILANTE</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <Link href="/dashboard" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${pathname === '/dashboard' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-surface-high'}`}>
            <span className="font-heading">Dashboard</span>
          </Link>
          <Link href="/history" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${pathname === '/history' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-surface-high'}`}>
            <span className="font-heading">History</span>
          </Link>
          <Link href="/settings" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${pathname === '/settings' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-surface-high'}`}>
            <span className="font-heading">Settings</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
