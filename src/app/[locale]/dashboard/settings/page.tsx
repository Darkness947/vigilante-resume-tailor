"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useTranslations } from 'next-intl';

export default function SettingsPage() {
  const t = useTranslations('Settings');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || '');
        setDisplayName(user.user_metadata?.full_name || '');
      }
    };
    loadUser();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const supabase = createClient();
    await supabase.auth.updateUser({
      data: { full_name: displayName },
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="text-[#d7e3fc] p-6 lg:p-10 max-w-2xl">
      <header className="mb-8">
        <h1 className="text-2xl font-black tracking-tight uppercase">{t('title')}</h1>
        <p className="text-[#737679] text-sm mt-1.5">{t('desc')}</p>
      </header>

      <div className="space-y-6">
        {/* Email (read-only) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-[#a9abaf]">{t('email_label')}</label>
          <input
            type="email"
            disabled
            value={email}
            className="h-12 bg-[#1c2024] text-[#737679] px-4 text-sm outline-none rounded cursor-not-allowed"
          />
        </div>

        {/* Display Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-[#a9abaf]">{t('name_label')}</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="h-12 bg-[#1c2024] text-[#d7e3fc] px-4 text-sm outline-none rounded border-b-2 border-transparent focus:border-[#6bd8cb] transition-colors"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-gradient-to-r from-[#00C2CB] to-[#008B8B] text-white uppercase tracking-widest text-sm font-bold rounded hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? '...' : saved ? t('saved') : t('save')}
        </button>
      </div>
    </div>
  );
}
