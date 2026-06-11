import Link from 'next/link'
import { ArrowLeft, Home, ShieldAlert } from 'lucide-react'
import { BRAND } from '@/lib/brand'

type AccessSafetyPageProps = {
  title: string
  message: string
  tone: 'restricted' | 'assignment'
}

const toneConfig = {
  restricted: {
    eyebrow: 'Kontrol Akses',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    iconBg: 'bg-rose-100',
    iconText: 'text-rose-700',
    badge: 'Akses ditolak',
  },
  assignment: {
    eyebrow: 'Penugasan',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-700',
    badge: 'Penugasan belum aktif',
  },
} satisfies Record<AccessSafetyPageProps['tone'], {
  eyebrow: string
  bg: string
  border: string
  iconBg: string
  iconText: string
  badge: string
}>

export function AccessSafetyPage({ title, message, tone }: AccessSafetyPageProps) {
  const theme = toneConfig[tone]

  return (
    <main className="min-h-screen bg-[#F4F7FA] px-4 py-6 text-[#1B2430] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl items-center justify-center">
        <section className="w-full overflow-hidden rounded-[20px] border border-cyan-100 bg-white shadow-[0_8px_24px_rgba(13,44,84,0.12)]">
          <div className="grid min-h-[520px] grid-cols-1 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="relative flex flex-col justify-between overflow-hidden bg-[#0D2C54] p-6 text-white sm:p-8">
              <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,rgba(0,172,193,0)_0%,rgba(0,172,193,0.24)_100%)]" />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white p-1.5 shadow-sm">
                    <img src={BRAND.logoPath} alt={`Logo ${BRAND.name}`} className="h-full w-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg font-black leading-tight">{BRAND.name}</div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">{BRAND.tagline}</div>
                  </div>
                </div>

                <div className="mt-10 max-w-sm">
                  <div className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">{theme.eyebrow}</div>
                  <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">{title}</h1>
                  <p className="mt-4 text-sm leading-6 text-blue-50">{message}</p>
                </div>
              </div>

              <div className="relative rounded-2xl border border-white/10 bg-white/8 p-4 text-xs leading-5 text-blue-50">
                <div className="font-bold text-white">{BRAND.unit}</div>
                <div className="mt-1">{BRAND.agency} - {BRAND.city}</div>
              </div>
            </div>

            <div className="flex flex-col justify-center p-5 sm:p-8 lg:p-10">
              <div className={`inline-flex w-fit items-center gap-2 rounded-full border ${theme.border} ${theme.bg} px-3 py-1.5 text-xs font-bold text-slate-700`}>
                <span className={`flex h-6 w-6 items-center justify-center rounded-full ${theme.iconBg} ${theme.iconText}`}>
                  <ShieldAlert className="h-3.5 w-3.5" />
                </span>
                {theme.badge}
              </div>

              <div className="mt-7 rounded-2xl border border-slate-100 bg-slate-50 p-5 sm:p-6">
                <div className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">Informasi akses</div>
                <div className="mt-3 text-2xl font-black leading-tight text-[#0D2C54]">{title}</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Link
                  href="/dashboard"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0D2C54] px-4 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#1976D2]"
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="/pengaturan"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-cyan-100 bg-white px-4 text-sm font-extrabold text-[#0D2C54] transition hover:border-cyan-200 hover:bg-cyan-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Pengaturan
                </Link>
              </div>

              <div className="mt-7 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-400">
                <div className="font-bold text-slate-500">{BRAND.name}</div>
                <div>{BRAND.copyright} {BRAND.rights}</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

