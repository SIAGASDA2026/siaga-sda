import { auth } from '@/lib/auth'
import { canAccessPage } from '@/lib/rbac'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAuthenticated = !!req.auth
  const accessSafetyPaths = ['/akses-dibatasi', '/belum-ada-penugasan']

  // Redirect ke login jika belum login
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (accessSafetyPaths.includes(pathname)) {
    return NextResponse.next()
  }

  const role = String((req.auth?.user as any)?.role || '')

  // Cek permission akses halaman berdasarkan role
  if (!canAccessPage(role, pathname)) {
    const target = new URL('/akses-dibatasi', req.url)
    target.searchParams.set('from', pathname)
    return NextResponse.redirect(target)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Semua halaman kecuali: API, file statis, favicon, halaman login
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ],
}
