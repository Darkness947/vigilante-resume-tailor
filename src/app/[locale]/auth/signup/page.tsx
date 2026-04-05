"use client";

import { useTranslations } from 'next-intl';

export default function SignupPage() {
  const t = useTranslations('Index');
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="display-font text-4xl mb-4">Sign Up</h1>
        <form className="flex flex-col gap-4">
          <input type="text" placeholder="Full Name" className="h-10 rounded-md border border-input bg-surface px-3 py-2 text-sm ring-offset-background" />
          <input type="email" placeholder="Email" className="h-10 rounded-md border border-input bg-surface px-3 py-2 text-sm ring-offset-background" />
          <input type="password" placeholder="Password" className="h-10 rounded-md border border-input bg-surface px-3 py-2 text-sm ring-offset-background" />
          <button type="submit" className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-10 px-4 py-2 hover:opacity-90">Create Account</button>
        </form>
      </div>
    </div>
  );
}
