"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Link, useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { LogOut, LayoutDashboard, Settings, ShieldCheck, Clock } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function AuthNav({ isAdmin }: { isAdmin?: boolean }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('Nav');
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />;
  }

  if (user) {
    const initials = user.user_metadata?.full_name
      ?.split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase() || user.email?.[0].toUpperCase() || 'U';

    return (
      <DropdownMenu>
        <DropdownMenuTrigger render={
          <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border border-border hover:border-primary/50 transition-colors">
            <Avatar className="h-full w-full">
              <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || 'User'} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        } />
        <DropdownMenuContent className="w-56 mt-2" align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.user_metadata?.full_name || 'Operative'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/dashboard" className="flex w-full items-center gap-2 cursor-pointer">
              <LayoutDashboard className="size-4" />
              <span>{t('dashboard')}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/dashboard/history" className="flex w-full items-center gap-2 cursor-pointer">
              <Clock className="size-4" />
              <span>{t('history')}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/dashboard/settings" className="flex w-full items-center gap-2 cursor-pointer">
              <Settings className="size-4" />
              <span>{t('settings')}</span>
            </Link>
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem>
              <Link href="/admin" className="flex w-full items-center gap-2 cursor-pointer text-primary focus:text-primary">
                <ShieldCheck className="size-4" />
                <span>{t('admin')}</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex w-full items-center gap-2 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
          >
            <LogOut className="size-4" />
            <span>{t('signout')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/auth/login" className="hidden sm:block">
        <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary transition-colors">
          {t('signin')}
        </Button>
      </Link>
      <Link href="/auth/signup">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-premium">
          {t('signup')}
        </Button>
      </Link>
    </div>
  );
}
