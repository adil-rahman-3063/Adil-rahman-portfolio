import { NextResponse } from 'next/server';

export function middleware(request) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // Detect admin subdomain (e.g. admin.adilrahman.cc or admin.localhost:3000)
  const isAdminSubdomain = host.toLowerCase().startsWith('admin.');

  if (isAdminSubdomain) {
    // If accessing root "/" on admin.adilrahman.cc, rewrite internally to "/admin"
    if (url.pathname === '/') {
      url.pathname = '/admin';
      return NextResponse.rewrite(url);
    }

    // If navigating to subpaths on admin domain (not static assets or API)
    if (
      !url.pathname.startsWith('/admin') &&
      !url.pathname.startsWith('/api') &&
      !url.pathname.startsWith('/_next') &&
      !url.pathname.includes('.')
    ) {
      url.pathname = `/admin${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, svgs, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
