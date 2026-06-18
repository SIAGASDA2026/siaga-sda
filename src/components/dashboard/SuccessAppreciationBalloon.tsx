import Link from 'next/link'
import { Check, X } from 'lucide-react'
import { BRAND } from '@/lib/brand'
import { formatIdentityLabel, type TaskCenterIdentity } from '@/lib/task-center-ui'

type SuccessAppreciationBalloonProps = {
  success: boolean
  identity?: TaskCenterIdentity
  actionLabel: string
  nextStep: string
  riskPrevented: string
  detailHref?: string
  continueHref?: string
  onClose?: () => void
}

export function SuccessAppreciationBalloon({
  success,
  identity,
  actionLabel,
  nextStep,
  riskPrevented,
  detailHref,
  continueHref,
  onClose,
}: SuccessAppreciationBalloonProps) {
  if (!success) return null

  return (
    <aside className="fixed bottom-20 right-3 z-[80] w-[calc(100vw-24px)] max-w-sm rounded-3xl border border-cyan-200 bg-white p-4 text-slate-900 shadow-2xl sm:bottom-auto sm:top-24" role="status" aria-live="polite">
      <div className="flex items-start gap-3">
        <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-700 text-white motion-safe:animate-[pulse_1.2s_ease-out_1]">
          <span className="text-[10px] font-black leading-none">{BRAND.name}</span>
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-xs font-black text-rose-600" aria-label="apresiasi kecil">
            ♥
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-700">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                Sukses
              </div>
              <h3 className="mt-2 text-base font-black text-slate-950">Terima kasih</h3>
            </div>
            {onClose && (
              <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900" aria-label="Tutup apresiasi">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>

          <p className="mt-1 text-xs font-semibold text-slate-600">{formatIdentityLabel(identity)}</p>
          <p className="mt-3 text-sm font-bold text-slate-900">{actionLabel}</p>

          <div className="mt-3 space-y-2 text-sm leading-5 text-slate-700">
            <p><span className="font-bold text-cyan-800">Langkah berikutnya:</span> {nextStep}</p>
            <p><span className="font-bold text-amber-800">Risiko yang dicegah:</span> {riskPrevented}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {detailHref && (
              <Link href={detailHref} className="inline-flex h-9 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 px-3 text-xs font-bold text-cyan-900 transition hover:bg-cyan-100">
                Lihat Detail
              </Link>
            )}
            {continueHref && (
              <Link href={continueHref} className="inline-flex h-9 items-center justify-center rounded-xl bg-slate-950 px-3 text-xs font-bold text-white transition hover:bg-slate-800">
                Lanjutkan
              </Link>
            )}
            {onClose && (
              <button type="button" onClick={onClose} className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50">
                Tutup
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}

