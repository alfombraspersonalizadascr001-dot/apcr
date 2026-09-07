import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect only /crm routes
  if (pathname.startsWith('/crm')) {
    const isAuthenticated = request.cookies.get('crm_authenticated')?.value === 'true';
    const userRole = request.cookies.get('crm_role')?.value;

    if (!isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('login', 'true');
      return NextResponse.redirect(url);
    }

    if ((pathname.startsWith('/crm/admin') || pathname.startsWith('/crm/cotizador')) && userRole !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/crm';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/crm/:path*'],
};
