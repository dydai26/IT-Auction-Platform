import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

const locales = ['ru', 'en', 'zh'];
const defaultLocale = 'ru';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore static files, images, api routes, and _next internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Generate response with localized path if needed
  let response = NextResponse.next();
  if (!pathnameHasLocale) {
    const localeToRedirect = defaultLocale;
    request.nextUrl.pathname = `/${localeToRedirect}${pathname}`;
    response = NextResponse.redirect(request.nextUrl);
  }

  // Pass response through Supabase middleware to refresh session and protect routes
  return updateSession(request, response);
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
