import { NextResponse } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from './app/lib/session';
import { ADMIN_PATH } from './app/lib/admin-path';

// Sends signed-out visitors to the login page. Every admin page and action
// also calls requireAdmin() itself, so this is not the only check.
export async function proxy(request) {
  const { pathname } = request.nextUrl;
  if (pathname === `${ADMIN_PATH}/login`) return NextResponse.next();

  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (session) return NextResponse.next();

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const url = request.nextUrl.clone();
  url.pathname = `${ADMIN_PATH}/login`;
  url.search = '';
  return NextResponse.redirect(url);
}

// Must be literal values, so the dashboard path is repeated here. Keep it in
// step with app/lib/admin-path.js.
export const config = {
  matcher: ['/zing-hq-7k2m/:path*', '/api/admin/:path*'],
};
