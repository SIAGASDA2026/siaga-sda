import { AlertCircle, UserRound } from 'lucide-react'
import { getEmptyAssignmentCopy, type TaskCenterIdentity } from '@/lib/task-center-ui'

type EmptyAssignmentCardProps = {
  identity?: TaskCenterIdentity
}

export function EmptyAssignmentCard({ identity }: EmptyAssignmentCardProps) {
  const copy = getEmptyAssignmentCopy(identity)

  return (
    <section className="rounded-3xl border border-dashed border-cyan-200 bg-gradient-to-br from-white via-cyan-50/70 to-blue-50/80 p-4 text-slate-900 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-800">
          <UserRound className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="inline-flex rounded-full border border-cyan-200 bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-800">
            Belum Terhubung Data Resmi
          </div>
          <h3 className="mt-3 text-lg font-black text-slate-950">{copy.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">{copy.message}</p>

          <div className="mt-4 rounded-2xl border border-white/80 bg-white/85 p-3">
            <div className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Identitas akun</div>
            <div className="mt-1 text-sm font-bold text-slate-900">{copy.identityLabel}</div>
          </div>

          <div className="mt-3 flex items-start gap-2 rounded-2xl border border-amber-100 bg-amber-50/80 p-3 text-sm text-amber-950">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <p className="leading-5">{copy.guidance}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

