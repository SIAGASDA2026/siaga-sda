'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useAppStore } from '@/store/useAppStore'
import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'
import { ProjectAiAssistant } from '@/components/ai/ProjectAiAssistant'
import { ApprovalSummaryProvider } from '@/components/approval/ApprovalSummaryProvider'
import { BRAND } from '@/lib/brand'
import { Toaster } from 'react-hot-toast'

const BOOTSTRAP_RETRY_DELAYS_MS = [0, 1000, 1500] as const
type BootstrapStatus = 'idle' | 'loading' | 'retrying' | 'database' | 'fallback'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { data: session, status } = useSession()

  const isLoggedIn = useAppStore((state) => state.isLoggedIn)
  const sidebarOpen = useAppStore((state) => state.sidebarOpen)
  const dashboardDataSource = useAppStore((state) => state.dashboardDataSource)
  const hydrateFromDatabase = useAppStore((state) => state.hydrateFromDatabase)
  const setAuthUser = useAppStore((state) => state.setAuthUser)

  const [mounted, setMounted] = useState(false)
  const [bootstrapped, setBootstrapped] = useState(false)
  const [bootstrapStatus, setBootstrapStatus] = useState<BootstrapStatus>('idle')
  const [manualRetryKey, setManualRetryKey] = useState(0)
  const initialBootstrapCompleteRef = useRef(false)
  const syncVersionRef = useRef<string>('')
  const syncInFlightRef = useRef(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && status === 'unauthenticated') {
      setAuthUser(null)
      setBootstrapped(false)
      setBootstrapStatus('idle')
      initialBootstrapCompleteRef.current = false
      router.replace('/login')
    }
  }, [mounted, router, setAuthUser, status])

  useEffect(() => {
    if (!mounted || status !== 'authenticated') return

    let active = true

    if (!useAppStore.getState().currentUser && session?.user) {
      const sessionUser = session.user as typeof session.user & { id?: string; role?: string }
      setAuthUser({
        id: sessionUser.id || sessionUser.email || 'session-user',
        name: sessionUser.name || sessionUser.email || 'Pengguna',
        email: sessionUser.email || '',
        role: (sessionUser.role as any) || 'pptk',
      })
    }

    const isInitialBootstrap = !initialBootstrapCompleteRef.current

    if (isInitialBootstrap) {
      setBootstrapped(false)
      setBootstrapStatus('loading')
    } else if (manualRetryKey > 0) {
      setBootstrapStatus('retrying')
    }

    const fetchBootstrap = async () => {
      const response = await fetch('/api/bootstrap', { cache: 'no-store' })
      if (!response.ok) throw new Error(`Gagal memuat data ${BRAND.name}`)
      return response.json()
    }

    const hydrateBootstrapData = (data: Parameters<typeof hydrateFromDatabase>[0]) => {
      if (!active) return
      hydrateFromDatabase(data)
      initialBootstrapCompleteRef.current = true
      setBootstrapStatus('database')
      setBootstrapped(true)
    }

    const syncData = async () => {
      try {
        const data = await fetchBootstrap()
        hydrateBootstrapData(data)
        return true
      } catch {
        // Sinkronisasi background tidak mengubah database source menjadi fallback.
        return false
      }
    }

    const bootstrapWithRetry = async () => {
      for (let attempt = 0; attempt < BOOTSTRAP_RETRY_DELAYS_MS.length; attempt += 1) {
        const delay = BOOTSTRAP_RETRY_DELAYS_MS[attempt]

        if (delay > 0) {
          if (active) setBootstrapStatus('retrying')
          await new Promise((resolve) => window.setTimeout(resolve, delay))
        }

        if (!active) return false

        try {
          const data = await fetchBootstrap()
          hydrateBootstrapData(data)
          return true
        } catch {
          // Detail koneksi tetap di server. Client hanya mengatur retry terbatas.
        }
      }

      if (active) {
        initialBootstrapCompleteRef.current = true
        setBootstrapStatus('fallback')
        setBootstrapped(true)
      }
      return false
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
          const synced = await syncData()
          if (synced) syncVersionRef.current = data.version
        }
      } catch {
        // Jangan paksa logout hanya karena cek realtime sementara gagal/lambat.
        // Session tetap divalidasi oleh NextAuth dan bootstrap awal.
      } finally {
        syncInFlightRef.current = false
      }
    }

    void bootstrapWithRetry().then((success) => {
      if (success) void primeSyncVersion()
    })

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
      window.clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [hydrateFromDatabase, manualRetryKey, mounted, session?.user, setAuthUser, status])

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
            {status !== 'authenticated'
              ? 'Mengalihkan ke halaman login...'
              : bootstrapStatus === 'retrying'
                ? 'Koneksi database belum stabil, mencoba ulang...'
                : 'Memuat data database...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-surface min-h-screen">
      <ApprovalSummaryProvider>
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
            {dashboardDataSource === 'demo' && (
              <div className="mx-4 mt-4 flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-800 sm:mx-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div>Data Demo/Fallback ditampilkan karena data database belum berhasil dimuat. Angka pada halaman ini bukan data resmi.</div>
                  <div className="mt-0.5 font-normal text-amber-700">
                    {bootstrapStatus === 'retrying'
                      ? 'Koneksi database belum stabil, mencoba ulang...'
                      : 'Database belum berhasil dimuat. Periksa koneksi atau coba lagi.'}
                  </div>
                </div>
                <button
                  type="button"
                  disabled={bootstrapStatus === 'retrying'}
                  onClick={() => {
                    setBootstrapStatus('retrying')
                    setManualRetryKey((value) => value + 1)
                  }}
                  className="shrink-0 rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs font-bold text-amber-900 transition hover:bg-amber-100 disabled:cursor-wait disabled:opacity-60"
                >
                  {bootstrapStatus === 'retrying' ? 'Mencoba Ulang...' : 'Muat Ulang Data Database'}
                </button>
              </div>
            )}
            {children}
          </div>

          <div className="px-4 pb-6 pt-4 text-center text-[11px] leading-relaxed text-slate-400 sm:px-5">
            <div>{BRAND.name}</div>
            <div>{BRAND.copyright}</div>
            <div>{BRAND.rights}</div>
          </div>
        </main>
      </ApprovalSummaryProvider>
    </div>
  )
}
