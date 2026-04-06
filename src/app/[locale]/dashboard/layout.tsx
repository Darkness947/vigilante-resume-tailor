import { AppShell } from '@/components/layout/AppShell';
import { getUser, isAdminEmail } from '@/lib/supabase/server';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  const isAdmin = isAdminEmail(user?.email);
  return <AppShell isAdmin={isAdmin}>{children}</AppShell>;
}
