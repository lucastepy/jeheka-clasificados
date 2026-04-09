import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Apenas un logger para debug interno de Next.js
  const session = request.cookies.get('jeheka_session_portal');
  
  const response = NextResponse.next();
  
  // Forzar que no se cachee el header si hay sesión
  if (session) {
    response.headers.set('x-middleware-cache', 'no-cache');
  }
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
