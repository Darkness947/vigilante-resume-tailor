import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Match locale-prefixed protected routes: /en/dashboard, /ar/admin, etc.
  const isDashboard = /^\/(en|ar)\/dashboard/.test(pathname);
  const isAdmin = /^\/(en|ar)\/admin/.test(pathname);

  if (!user && (isDashboard || isAdmin)) {
    // Extract locale from path
    const locale = pathname.startsWith('/ar') ? 'ar' : 'en';
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/auth/login`;
    return NextResponse.redirect(url);
  }

  // If visiting auth pages while logged in, redirect to dashboard
  const isAuthPage = /^\/(en|ar)\/auth\/(login|signup)/.test(pathname);
  if (user && isAuthPage) {
    const locale = pathname.startsWith('/ar') ? 'ar' : 'en';
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/dashboard`;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
