'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Database, Map, ShieldCheck, Signal, TriangleAlert, Waves } from 'lucide-react'
import { BRAND } from '@/lib/brand'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Email atau password salah')
      setLoading(false)
      return
    }

    router.replace('/dashboard')
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0D2C54] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(0,172,193,0.28),transparent_28%),radial-gradient(circle_at_85%_25%,rgba(67,160,71,0.18),transparent_30%),linear-gradient(135deg,#0D2C54_0%,#1976D2_54%,#0D2C54_100%)]" />

      <div className="pointer-events-none absolute inset-0 hidden opacity-[0.08] md:block">
        <img src={BRAND.logoPath} alt="" className="absolute -left-20 top-12 h-80 w-80 object-contain" loading="eager" />
        <div className="absolute right-10 top-20 text-[112px] font-black leading-none tracking-normal text-white/70">
          SIAGA-SDA
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-18deg] whitespace-nowrap text-[70px] font-black tracking-normal text-white/80">
          Command Center SDA
        </div>
      </div>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-[600px]">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-28 w-28 items-center justify-center rounded-2xl bg-white p-2 shadow-2xl shadow-blue-950/30">
              <img src={BRAND.logoPath} alt={`Logo ${BRAND.name}`} className="h-24 w-24 object-contain" loading="eager" />
            </div>
            <h1 className="text-4xl font-bold tracking-normal">{BRAND.name}</h1>
            <p className="mt-2 text-lg text-blue-100">{BRAND.fullName}</p>
            <p className="mt-1 text-sm text-blue-200">{BRAND.agency} - {BRAND.unit} - {BRAND.city}</p>
          </div>

          <div className="rounded-2xl bg-white p-7 text-slate-900 shadow-2xl shadow-blue-950/30 md:p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Masuk ke Sistem</h2>
                <p className="text-sm text-slate-500">Gunakan email/NIP dan password yang diberikan administrator.</p>
              </div>
            </div>

            <div className="mb-5 grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
              {[
                { label: 'Server Online', icon: Signal },
                { label: 'Database Aktif', icon: Database },
                { label: 'Peta Aktif', icon: Map },
                { label: 'SDA Normal', icon: Waves },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2 text-slate-600">
                    <Icon className="h-3.5 w-3.5 text-[#1976D2]" />
                    <span className="font-semibold">{item.label}</span>
                  </div>
                )
              })}
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <TriangleAlert className="h-4 w-4" />
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Username / Email / NIP</label>
                <input
                  type="text"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@dumai.go.id"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#1976D2] px-4 py-3 font-semibold text-white transition hover:bg-[#0D2C54] disabled:bg-blue-400"
              >
                {loading ? 'Memverifikasi...' : 'Masuk'}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center text-xs leading-relaxed text-blue-200">
            <div>{BRAND.name}</div>
            <div>{BRAND.copyright}</div>
            <div>{BRAND.rights}</div>
          </div>
        </div>
      </main>
    </div>
  )
}
