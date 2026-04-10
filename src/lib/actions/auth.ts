"use server";

import { getUser, isAdminEmail } from '@/lib/supabase/server';

export async function checkAdminStatus() {
  const user = await getUser();
  return isAdminEmail(user?.email);
}
