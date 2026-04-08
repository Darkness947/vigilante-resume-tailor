import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  // Update Supabase session first to protect routes and refresh tokens
  const supabaseResponse = await updateSession(request);

  // If Supabase decides to redirect to auth, return immediately
  if (supabaseResponse.headers.get('Location')) {
    return supabaseResponse;
  }

  // Otherwise, process next-intl routing
  const response = intlMiddleware(request);

  // Copy cookies set by Supabase (like auth refresh) to the next-intl response
  supabaseResponse.cookies.getAll().forEach(cookie => {
    response.cookies.set(cookie.name, cookie.value, { ...cookie });
  });

  return response;
}

export const config = {
  matcher: [
    '/',
    '/(ar|en)/:path*',
    // Exclude static assets, api routes, and common font formats (.ttf, .woff, .woff2)
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ttf|woff|woff2)$).*)',
  ],
};
