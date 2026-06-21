import { AlertCircle, UserRound } from 'lucide-react'
import { getEmptyAssignmentCopy, type TaskCenterIdentity } from '@/lib/task-center-ui'

type EmptyAssignmentCardProps = {
  identity?: TaskCenterIdentity
}

export function EmptyAssignmentCard({ identity }: EmptyAssignmentCardProps) {
  const copy = getEmptyAssignmentCopy(identity)

  return (
    <section className="siaga-section-canvas siaga-card-recommendation border-dashed p-4 text-slate-900 sm:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-800 sm:h-12 sm:w-12">
          <UserRound className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-200 bg-white/90 px-2.5 py-1.5 text-left text-[10px] font-black uppercase leading-4 tracking-[0.14em] text-cyan-800 shadow-sm">
            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-500" aria-hidden="true" />
            <span className="min-w-0">Belum Terhubung Data Resmi</span>
          </div>
          <h3 className="mt-3 text-lg font-black text-slate-950">{copy.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">{copy.message}</p>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <div className="siaga-card-compact p-3">
              <div className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">Identitas akun</div>
              <div className="mt-1 break-words text-sm font-bold leading-5 text-slate-900">{copy.identityLabel}</div>
            </div>
            <div className="siaga-card-compact siaga-card-recommendation p-3">
              <div className="text-[11px] font-black uppercase tracking-[0.14em] text-cyan-700">Apa berikutnya</div>
              <p className="mt-1 text-sm leading-5 text-slate-700">{copy.nextStep}</p>
            </div>
          </div>

          <div className="siaga-card-compact siaga-card-success mt-3 p-3 text-sm font-semibold leading-5 text-emerald-900">
            {copy.notErrorNote}
          </div>

          <div className="siaga-card-compact siaga-card-warning mt-3 flex items-start gap-2 p-3 text-sm text-amber-950">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <p className="leading-5">{copy.guidance}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
