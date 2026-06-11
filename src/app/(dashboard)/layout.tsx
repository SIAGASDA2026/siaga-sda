'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useAppStore } from '@/store/useAppStore'
import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'
import { ProjectAiAssistant } from '@/components/ai/ProjectAiAssistant'
import { BRAND } from '@/lib/brand'
import { Toaster } from 'react-hot-toast'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { data: session, status } = useSession()

  const { currentUser, isLoggedIn, sidebarOpen, hydrateFromDatabase, setAuthUser } = useAppStore()

  const [mounted, setMounted] = useState(false)
  const [bootstrapped, setBootstrapped] = useState(false)
  const syncVersionRef = useRef<string>('')
  const syncInFlightRef = useRef(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && status === 'unauthenticated') {
      setAuthUser(null)
      setBootstrapped(false)
      router.replace('/login')
    }
  }, [mounted, router, setAuthUser, status])

  useEffect(() => {
    if (!mounted || status !== 'authenticated') return

    let active = true

    if (!currentUser && session?.user) {
      const sessionUser = session.user as typeof session.user & { id?: string; role?: string }
      setAuthUser({
        id: sessionUser.id || sessionUser.email || 'session-user',
        name: sessionUser.name || sessionUser.email || 'Pengguna',
        email: sessionUser.email || '',
        role: (sessionUser.role as any) || 'pptk',
      })
    }

    setBootstrapped(true)

    const syncData = async () => {
      return fetch('/api/bootstrap', { cache: 'no-store' })
        .then((response) => {
          if (!response.ok) throw new Error(`Gagal memuat data ${BRAND.name}`)
          return response.json()
        })
        .then((data) => {
          if (active) {
            hydrateFromDatabase(data)
            setBootstrapped(true)
          }
        })
        .catch(() => {
          // Jangan jatuhkan session aktif jika bootstrap data sedang lambat/gagal sementara.
          // Validasi login tetap dipegang NextAuth; data dashboard akan mencoba sync lagi.
          if (active) setBootstrapped(true)
        })
    }

    const primeSyncVersion = async () => {
      if (syncInFlightRef.current) return
      syncInFlightRef.current = true

      try {
        const response = await fetch('/api/sync-version', { cache: 'no-store' })
        if (!response.ok) throw new Error('Gagal memeriksa perubahan data')
        const data = await response.json()
        syncVersionRef.current = data.version
      } catch {
        // Cek versi hanya optimasi realtime; jangan ganggu login/dashboard.
      } finally {
        syncInFlightRef.current = false
      }
    }

    const syncIfChanged = async () => {
      if (syncInFlightRef.current) return
      syncInFlightRef.current = true

      try {
        const response = await fetch('/api/sync-version', { cache: 'no-store' })
        if (!response.ok) throw new Error('Gagal memeriksa perubahan data')
        const data = await response.json()

        if (!syncVersionRef.current || syncVersionRef.current !== data.version) {
          syncVersionRef.current = data.version
          await syncData()
        }
      } catch {
        // Jangan paksa logout hanya karena cek realtime sementara gagal/lambat.
        // Session tetap divalidasi oleh NextAuth dan bootstrap awal.
      } finally {
        syncInFlightRef.current = false
      }
    }

    const initialSyncId = window.setTimeout(() => {
      syncData().then(primeSyncVersion)
    }, 1200)

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') syncIfChanged()
    }, 15000)

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') syncIfChanged()
    }

    const handleFocus = () => syncIfChanged()

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    return () => {
      active = false
      window.clearTimeout(initialSyncId)
      window.clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [currentUser, hydrateFromDatabase, mounted, session?.user, setAuthUser, status])

  if (!mounted || status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl bg-[#0D2C54]">
            <span className="text-xl font-bold text-white">S</span>
          </div>
          <p className="text-sm text-slate-400">Memuat {BRAND.name}...</p>
        </div>
      </div>
    )
  }

  if (status !== 'authenticated' || !isLoggedIn || !bootstrapped) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl bg-[#0D2C54]">
            <span className="text-xl font-bold text-white">S</span>
          </div>
          <p className="text-sm text-slate-400">
            {status === 'authenticated' ? 'Memuat data database...' : 'Mengalihkan ke halaman login...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-surface min-h-screen">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { fontSize: 13, borderRadius: 12 },
        }}
      />

      <Sidebar />
      <MobileNav />
      <ProjectAiAssistant />

      <main
        className="app-main min-h-screen transition-all duration-300"
        style={{
          ['--sidebar-left' as string]: `${sidebarOpen ? 256 : 76}px`,
          paddingTop: 64,
        }}
      >
        <div className="min-w-0">
          {children}
        </div>

        <div className="px-4 pb-6 pt-4 text-center text-[11px] leading-relaxed text-slate-400 sm:px-5">
          <div>{BRAND.name}</div>
          <div>{BRAND.copyright}</div>
          <div>{BRAND.rights}</div>
        </div>
      </main>
    </div>
  )
}
