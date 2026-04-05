"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from '@/i18n/routing';

export default function LoginPage() {
  const t = useTranslations('Index');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#071325] p-6">
      <div className="w-full max-w-md space-y-8">

        {/* Brand Mark */}
        <div className="text-center">
          <Link href="/">
            <h1 className="font-[var(--font-bebas-neue)] text-5xl text-[#b8c4ff] tracking-widest uppercase cursor-pointer hover:opacity-80 transition-opacity">VIGILANTE</h1>
          </Link>
          <p className="text-[#a9abaf] text-sm mt-2">Authenticate to access the Tailoring Engine</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#101c2e] p-8 rounded-lg space-y-6">
          <h2 className="text-xl font-bold text-[#d7e3fc] tracking-wide uppercase">Sign In</h2>

          {error && (
            <div className="bg-[#360001] text-[#ffb4ab] text-sm p-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-[#a9abaf]">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operative@vigilante.io"
                className="h-12 bg-[#1c2024] text-[#d7e3fc] px-4 text-sm outline-none rounded border-b-2 border-transparent focus:border-[#6bd8cb] transition-colors placeholder:text-[#45474c]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-[#a9abaf]">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12 bg-[#1c2024] text-[#d7e3fc] px-4 text-sm outline-none rounded border-b-2 border-transparent focus:border-[#6bd8cb] transition-colors placeholder:text-[#45474c]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-12 bg-gradient-to-r from-[#00C2CB] to-[#008B8B] text-white uppercase tracking-widest text-sm font-bold rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-[#737679]">
            No account?{' '}
            <Link href="/auth/signup" className="text-[#6bd8cb] hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
