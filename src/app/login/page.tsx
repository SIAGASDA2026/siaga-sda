'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Building2,
  Clock3,
  Droplets,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MapPin,
  Radio,
  UserRound,
  UserRoundPlus,
  Waves,
} from 'lucide-react'
import logoPuSda from './assets/logo-pu-sda.png'
import logoSiagaSda from './assets/logo-siaga-sda.png'

const LOGO_SIAGA_SDA = logoSiagaSda.src
const LOGO_PU_SDA = logoPuSda.src

const tideRows = [
  { time: '06:00', waterLevel: '0.45', trend: 'down', status: 'Aman' },
  { time: '09:00', waterLevel: '0.78', trend: 'up', status: 'Aman' },
  { time: '12:00', waterLevel: '1.10', trend: 'up', status: 'Waspada' },
  { time: '15:00', waterLevel: '1.35', trend: 'up', status: 'Siaga' },
  { time: '18:00', waterLevel: '0.95', trend: 'down', status: 'Waspada' },
]

const prayerTimes = [
  { name: 'Subuh', time: '05:03' },
  { name: 'Zuhur', time: '12:20' },
  { name: 'Asar', time: '15:43' },
  { name: 'Maghrib', time: '18:17', active: true },
  { name: 'Isya', time: '19:31' },
]

const statusItems = [
  { title: 'Sistem Online', mobileTitle: 'Sistem Online', desc: 'Semua layanan berjalan normal', icon: Radio, tone: 'bg-emerald-500' },
  { title: 'Peta Monitoring Aktif', mobileTitle: 'Peta Aktif', desc: 'Pemantauan wilayah real-time', icon: MapPin, tone: 'bg-blue-600' },
  { title: 'Pasang Surut Terpantau', mobileTitle: 'Pasang Surut Terpantau', desc: 'Data otomatis setiap 15 menit', icon: Waves, tone: 'bg-cyan-600' },
]

function statusClass(status: string) {
  if (status === 'Aman') return 'bg-emerald-50 text-emerald-700'
  if (status === 'Waspada') return 'bg-orange-50 text-orange-700'
  return 'bg-red-50 text-red-700'
}

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
    <main className="login-water-bg relative min-h-dvh overflow-x-hidden px-3 py-3 text-[#061735] sm:px-5 sm:py-5">
      <div className="login-main-panel relative z-10 mx-auto flex min-h-[calc(100dvh-24px)] w-full max-w-[1220px] flex-col rounded-[28px] border border-white/70 px-3 py-4 shadow-[0_30px_100px_rgba(2,20,45,0.32)] backdrop-blur-xl sm:min-h-[calc(100dvh-40px)] sm:rounded-[32px] sm:px-6 sm:py-6 lg:px-10">
        <section className="mx-auto w-full max-w-3xl text-center">
          <div className="login-logo-float mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/75 p-1 shadow-[0_16px_44px_rgba(13,44,84,0.16)] ring-1 ring-white sm:h-32 sm:w-32">
            <img src={LOGO_SIAGA_SDA} alt="Logo SIAGA-SDA" className="h-full w-full object-contain" loading="eager" />
          </div>
          <h1 className="mt-1 text-4xl font-black tracking-wide text-[#071f3d] drop-shadow-sm sm:text-6xl">SIAGA-SDA</h1>
          <div className="mt-1 text-xs font-black uppercase tracking-[0.38em] text-[#1769aa] sm:text-base">COMMAND CENTER SDA</div>
          <div className="mx-auto mt-2 flex max-w-[360px] items-center justify-center gap-2 sm:max-w-[520px]">
            <span className="h-px flex-1 bg-blue-200" />
            <Droplets className="h-4 w-4 fill-blue-500 text-blue-500" />
            <span className="h-px flex-1 bg-blue-200" />
          </div>
          <p className="mx-auto mt-2 max-w-2xl text-xs font-medium leading-relaxed text-[#143760] sm:text-base">
            Sistem Informasi, Analisis, Gerak Cepat dan Administrasi Sumber Daya Air
          </p>
          <div className="login-sheen mx-auto mt-3 inline-flex max-w-full items-center gap-2 overflow-hidden rounded-xl border border-white bg-white/80 px-3 py-2 text-[11px] font-extrabold text-[#143760] shadow-sm sm:px-5 sm:text-sm">
            <img src={LOGO_PU_SDA} alt="Logo PU-SDA" className="h-6 w-6 flex-shrink-0 rounded-md object-contain sm:h-7 sm:w-7" />
            <span>Dinas Pekerjaan Umum Bidang Sumber Daya Air Kota Dumai</span>
          </div>
        </section>

        <section className="mx-auto mt-4 grid w-full max-w-[1060px] gap-4 lg:mt-8 lg:grid-cols-[1fr_1.05fr]">
          <div className="login-card rounded-[24px] border border-white bg-white/95 p-4 shadow-[0_18px_45px_rgba(13,44,84,0.12)] sm:p-7 lg:min-h-[515px]">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <UserRound className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#082653] sm:text-2xl">Masuk ke Sistem</h2>
                <p className="mt-0.5 text-xs font-medium text-slate-600 sm:text-sm">Silakan masuk untuk mengakses dashboard</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700">
                <AlertTriangle className="h-4 w-4" />
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="mb-2 block text-sm font-extrabold text-[#0a2448]">Email / NIP</label>
                <div className="group relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="login-email"
                    type="text"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Masukkan email atau NIP Anda"
                    required
                    autoComplete="username"
                    className="h-11 w-full rounded-xl border border-blue-200 bg-white py-2 pl-10 pr-3 text-sm font-medium text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 hover:border-blue-300 focus:border-[#1769aa] focus:shadow-[0_10px_30px_rgba(25,118,210,0.10)] focus:ring-4 focus:ring-blue-100 sm:h-12"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="mb-2 block text-sm font-extrabold text-[#0a2448]">Password</label>
                <div className="group relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Masukkan password Anda"
                    required
                    autoComplete="current-password"
                    className="h-11 w-full rounded-xl border border-blue-200 bg-white py-2 pl-10 pr-11 text-sm font-medium text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 hover:border-blue-300 focus:border-[#1769aa] focus:shadow-[0_10px_30px_rgba(25,118,210,0.10)] focus:ring-4 focus:ring-blue-100 sm:h-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="login-submit-button mt-6 h-12 w-full rounded-xl bg-gradient-to-r from-[#0d2c54] via-[#125a91] to-[#1976d2] px-4 text-sm font-extrabold text-white shadow-[0_14px_34px_rgba(13,44,84,0.28)] transition focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Memverifikasi...' : 'Masuk'}
              </button>
            </form>

            <div className="mt-6 flex flex-col gap-3 text-xs font-bold text-blue-700 min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between sm:text-sm">
              <Link href="/login" className="inline-flex items-center gap-1.5 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-200">
                <LockKeyhole className="h-4 w-4" />
                Lupa Password?
              </Link>
              <Link href="/login" className="inline-flex items-center gap-1.5 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-200">
                <UserRoundPlus className="h-4 w-4" />
                Daftar Akun Eksternal
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <section className="login-card rounded-[22px] border border-white bg-white/95 p-3 shadow-[0_18px_45px_rgba(13,44,84,0.12)] sm:p-5">
              <div className="mb-3 flex items-center justify-between gap-3 lg:mb-1.5">
                <div className="flex items-center gap-2">
                  <Waves className="h-5 w-5 text-blue-600" />
                  <h2 className="text-sm font-black text-[#082653] sm:text-lg">Tabel Pasang Surut Air Laut</h2>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-white px-2 py-1 text-[10px] font-black text-slate-600 sm:text-xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Auto Update
                </span>
              </div>
              {/* TODO: Integrasikan data pasang surut dari API resmi jika sudah tersedia. */}
              <div className="overflow-hidden rounded-xl border border-blue-100">
                <table className="w-full table-fixed text-center text-[11px] sm:text-sm">
                  <thead className="bg-blue-50 text-[10px] font-black text-[#082653] sm:text-xs">
                    <tr>
                      <th className="px-1.5 py-2">Time</th>
                      <th className="px-1.5 py-2">Level (m)</th>
                      <th className="px-1.5 py-2">Trend</th>
                      <th className="px-1.5 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-100 bg-white">
                    {tideRows.map((row) => {
                      const isSiaga = row.status === 'Siaga'
                      const TrendIcon = row.trend === 'down' ? ArrowDown : ArrowUp
                      return (
                        <tr key={row.time} className={isSiaga ? 'bg-red-50/80' : undefined}>
                          <td className="px-1.5 py-2 font-semibold text-slate-700">{row.time}</td>
                          <td className="px-1.5 py-2 font-semibold text-slate-700">{row.waterLevel}</td>
                          <td className="px-1.5 py-2">
                            <TrendIcon className={`mx-auto h-4 w-4 ${row.trend === 'down' ? 'text-blue-600' : isSiaga ? 'text-red-600' : 'text-emerald-600'}`} />
                          </td>
                          <td className="px-1.5 py-2">
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-black sm:text-xs ${statusClass(row.status)}`}>{row.status}</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-900 sm:text-sm">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-600" />
                <span><span className="font-black">Peringatan:</span> Air laut diperkirakan naik pada 15:00</span>
              </div>
            </section>

            <section className="login-card rounded-[22px] border border-white bg-white/95 p-3 shadow-[0_18px_45px_rgba(13,44,84,0.12)] sm:p-5">
              <div className="mb-3 flex items-center justify-between gap-3 lg:mb-1.5">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-[#082653]" />
                  <h2 className="text-sm font-black text-[#082653] sm:text-lg">Waktu Sholat</h2>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  Dumai
                </span>
              </div>
              {/* TODO: Integrasikan jadwal sholat otomatis berdasarkan lokasi Dumai jika API sudah tersedia. */}
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2 lg:gap-1.5">
                {prayerTimes.map((item) => (
                  <div
                    key={item.name}
                    className={`rounded-xl border px-1 py-2 text-center ${item.active ? 'border-blue-200 bg-blue-50 shadow-sm' : 'border-transparent bg-white'}`}
                  >
                    <Clock3 className={`mx-auto mb-1 h-4 w-4 ${item.active ? 'text-blue-600' : 'text-slate-500'}`} />
                    <div className="text-[10px] font-semibold text-slate-600 sm:text-xs">{item.name}</div>
                    <div className={`text-xs font-black sm:text-base ${item.active ? 'text-blue-700' : 'text-[#082653]'}`}>{item.time}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-black text-blue-700 sm:text-sm">
                <Clock3 className="h-4 w-4" />
                Waktu berikutnya: Maghrib 18:17
              </div>
            </section>
          </div>
        </section>

        <section className="login-card mx-auto mt-4 grid w-full max-w-[1060px] grid-cols-3 rounded-[22px] border border-white bg-white/95 shadow-[0_18px_45px_rgba(13,44,84,0.12)]">
          {statusItems.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={item.title} className={`flex min-w-0 items-center justify-center gap-2 px-2 py-3 sm:gap-3 sm:px-5 sm:py-5 ${index > 0 ? 'border-l border-blue-100' : ''}`}>
                <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${item.tone} text-white shadow-sm sm:h-10 sm:w-10`}>
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] font-black leading-tight text-[#082653] sm:text-sm">{item.mobileTitle}</span>
                  <span className="hidden text-xs font-medium text-slate-600 sm:block">{item.desc}</span>
                </span>
              </div>
            )
          })}
        </section>

        <footer className="mt-4 text-center text-xs font-semibold leading-relaxed text-[#143760] sm:text-sm">
          <div className="font-black">SIAGA-SDA</div>
          <div>©2026 Budi Legawan, ST <span className="mx-2 text-blue-300">|</span> All Rights Reserved</div>
        </footer>
      </div>
    </main>
  )
}
