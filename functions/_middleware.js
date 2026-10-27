export async function onRequest(context) {
  const url = new URL(context.request.url);
  const hostname = url.hostname.toLowerCase();

  // Route requests on admin subdomain (e.g. admin.adilrahman.cc)
  if (hostname.startsWith('admin.')) {
    if (url.pathname === '/' || url.pathname === '') {
      url.pathname = '/admin';
      return Response.redirect(url.toString(), 302);
    }

    if (
      !url.pathname.startsWith('/admin') &&
      !url.pathname.startsWith('/api') &&
      !url.pathname.startsWith('/_next') &&
      !url.pathname.includes('.')
    ) {
      url.pathname = `/admin${url.pathname}`;
      return Response.redirect(url.toString(), 302);
    }
  }

  return context.next();
}
