"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from '@/i18n/routing';

export default function SignupPage() {
  const t = useTranslations('Index');
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#071325] p-6">
        <div className="w-full max-w-md text-center space-y-6 bg-[#101c2e] p-10 rounded-lg">
          <div className="text-[#6bd8cb] text-5xl">✓</div>
          <h2 className="text-xl font-bold text-[#d7e3fc] uppercase tracking-wide">Verification Sent</h2>
          <p className="text-[#a9abaf] text-sm">Check your email inbox and click the confirmation link to activate your account.</p>
          <Link href="/auth/login" className="inline-block mt-4 text-sm text-[#6bd8cb] hover:underline">
            Return to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#071325] p-6">
      <div className="w-full max-w-md space-y-8">

        {/* Brand Mark */}
        <div className="text-center">
          <Link href="/">
            <h1 className="font-[var(--font-bebas-neue)] text-5xl text-[#b8c4ff] tracking-widest uppercase cursor-pointer hover:opacity-80 transition-opacity">VIGILANTE</h1>
          </Link>
          <p className="text-[#a9abaf] text-sm mt-2">Create your operative account</p>
        </div>

        {/* Signup Card */}
        <div className="bg-[#101c2e] p-8 rounded-lg space-y-6">
          <h2 className="text-xl font-bold text-[#d7e3fc] tracking-wide uppercase">Create Account</h2>

          {error && (
            <div className="bg-[#360001] text-[#ffb4ab] text-sm p-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-[#a9abaf]">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Bruce Wayne"
                className="h-12 bg-[#1c2024] text-[#d7e3fc] px-4 text-sm outline-none rounded border-b-2 border-transparent focus:border-[#6bd8cb] transition-colors placeholder:text-[#45484c]"
              />
            </div>

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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="h-12 bg-[#1c2024] text-[#d7e3fc] px-4 text-sm outline-none rounded border-b-2 border-transparent focus:border-[#6bd8cb] transition-colors placeholder:text-[#45474c]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-12 bg-gradient-to-r from-[#00C2CB] to-[#008B8B] text-white uppercase tracking-widest text-sm font-bold rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Processing...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-[#737679]">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#6bd8cb] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
