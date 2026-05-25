import { auth } from '@/lib/auth'
import { canAccessPage } from '@/lib/rbac'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAuthenticated = !!req.auth

  // Redirect ke login jika belum login
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const role = String((req.auth?.user as any)?.role || '')

  // Cek permission akses halaman berdasarkan role
  if (!canAccessPage(role, pathname)) {
    // Redirect ke dashboard jika tidak punya akses
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Semua halaman kecuali: API, file statis, favicon, halaman login
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ],
}
