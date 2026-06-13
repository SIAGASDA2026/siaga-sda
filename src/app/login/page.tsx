'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import {
  AlertTriangle,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRoundPlus,
} from 'lucide-react'
import loginBgNightDam from '../../../public/brand/login-bg-night-dam.png'
import logoPuSda from '../../../docs/assets/logo-pu-sda.png'
import logoSiagaSda from '../../../docs/assets/logo-siaga-sda.png'
import { LoginBrandHero } from '@/components/login/LoginBrandHero'
import { LoginDigitalClock } from '@/components/login/LoginDigitalClock'
import { LoginPrayerWidget } from '@/components/login/LoginPrayerWidget'
import { LoginStatusStrip } from '@/components/login/LoginStatusStrip'
import { LoginTideWidget } from '@/components/login/LoginTideWidget'
import { LoginWeatherWidget } from '@/components/login/LoginWeatherWidget'
import styles from '@/components/login/login.module.css'

const LOGO_SIAGA_SDA = logoSiagaSda.src
const LOGO_PU_SDA = logoPuSda.src
const LOGIN_BG_NIGHT_DAM = `url("${loginBgNightDam.src}")`

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
    <main
      className={`${styles.page} text-white`}
      style={{ '--login-night-dam': LOGIN_BG_NIGHT_DAM } as React.CSSProperties}
    >
      <div className={styles.shell}>
        <div className={styles.workspace}>
          <div className={styles.brandSlot}>
            <LoginBrandHero logoPuSrc={LOGO_PU_SDA} logoSrc={LOGO_SIAGA_SDA} />
          </div>
          <div className={styles.clockSlot}>
            <LoginDigitalClock />
          </div>
          <div className={styles.weatherSlot}>
            <LoginWeatherWidget />
          </div>
          <section className={`${styles.lightCard} ${styles.loginCard} ${styles.loginSlot} rounded-2xl text-white`} aria-labelledby="login-heading">
              <div className={styles.areaLabel}>LOGIN</div>
              <div className="text-center">
                <h2 id="login-heading" className="text-[clamp(1.15rem,2.5vh,1.8rem)] font-black leading-tight">Selamat Datang</h2>
                <p className="mt-1 text-[clamp(10px,1.4vh,13px)] font-medium text-slate-300">Silakan masuk untuk mengakses dashboard</p>
              </div>

              {error && (
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700" role="alert">
                  <AlertTriangle className="h-3.5 w-3.5 flex-none" />
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="mt-[clamp(6px,1.4vh,14px)] space-y-[clamp(5px,1.2vh,12px)]">
                <div>
                  <label htmlFor="login-email" className="mb-1.5 block text-[clamp(10px,1.35vh,13px)] font-black">Email / NIP</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                    <input
                      id="login-email"
                      type="text"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="admin@dumai.go.id"
                      required
                      autoComplete="username"
                      className="h-[clamp(40px,5.5vh,52px)] w-full rounded-xl border border-cyan-200/25 bg-[#031a37]/75 py-1 pl-10 pr-3 text-xs font-semibold text-white outline-none transition placeholder:text-slate-300 hover:border-cyan-300/50 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="login-password" className="mb-1.5 block text-[clamp(10px,1.35vh,13px)] font-black">Password</label>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="••••••••••"
                      required
                      autoComplete="current-password"
                      className="h-[clamp(40px,5.5vh,52px)] w-full rounded-xl border border-cyan-200/25 bg-[#031a37]/75 py-1 pl-10 pr-10 text-xs font-semibold text-white outline-none transition placeholder:text-slate-300 hover:border-cyan-300/50 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                      aria-pressed={showPassword}
                      className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-300 outline-none transition hover:bg-cyan-300/10 hover:text-cyan-200 focus:ring-2 focus:ring-cyan-300/40"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-[clamp(40px,5.5vh,52px)] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0755c9] to-[#087cff] px-4 text-xs font-black text-white shadow-[0_10px_24px_rgba(0,94,221,.3)] outline-none transition hover:-translate-y-0.5 hover:brightness-110 focus:ring-2 focus:ring-cyan-300/60 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>{loading ? 'Memverifikasi...' : 'Masuk'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="mt-[clamp(5px,1vh,10px)] grid grid-cols-2 border-t border-cyan-100/10 pt-1 text-center text-[clamp(9px,1.2vh,12px)] font-bold text-cyan-300">
                <Link href="/login" className="inline-flex min-w-0 items-center justify-center gap-1 rounded-lg py-1.5 outline-none hover:bg-cyan-300/10 focus:ring-2 focus:ring-cyan-300/40">
                  <LockKeyhole className="h-3.5 w-3.5 flex-none" />
                  <span className="truncate">Lupa Password?</span>
                </Link>
                <Link href="/login" className="inline-flex min-w-0 items-center justify-center gap-1 rounded-lg border-l border-cyan-100/10 py-1.5 outline-none hover:bg-cyan-300/10 focus:ring-2 focus:ring-cyan-300/40">
                  <UserRoundPlus className="h-3.5 w-3.5 flex-none" />
                  <span className="truncate">Daftar Akun Eksternal</span>
                </Link>
              </div>
          </section>
          <div className={styles.tideSlot}>
            <LoginTideWidget />
          </div>
          <div className={styles.prayerSlot}>
            <LoginPrayerWidget />
          </div>
          <div className={styles.statusSlot}>
            <LoginStatusStrip />
          </div>
        </div>

        <footer className={`${styles.footer} text-center font-medium text-slate-300`}>
          <span>© 2026 Budi Legawan, ST</span>
          <span className="mx-2 text-cyan-300/50">|</span>
          <span>All Rights Reserved</span>
        </footer>
      </div>
    </main>
  )
}
