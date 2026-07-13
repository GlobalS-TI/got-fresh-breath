import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Chequeo barato de presencia de cookie (Edge runtime, no puede llamar a Payload).
// La validación real de la sesión (firma/expiración del JWT) ocurre en cada página
// protegida vía getSession() — este middleware solo evita el viaje redondo para el
// caso obvio de "no hay cookie".
export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has('payload-token')

  if (!hasSession) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/cuenta', '/cuenta/:path*'],
}
