"use client";

import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('Index');
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="display-font text-4xl mb-4">Login</h1>
        <form className="flex flex-col gap-4">
          <input type="email" placeholder="Email" className="h-10 rounded-md border border-input bg-surface px-3 py-2 text-sm ring-offset-background" />
          <button type="submit" className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-10 px-4 py-2 hover:opacity-90">Sign In</button>
        </form>
      </div>
    </div>
  );
}
