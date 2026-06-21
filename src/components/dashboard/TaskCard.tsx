import Link from 'next/link'
import { ArrowRight, Clock3, ShieldAlert } from 'lucide-react'
import { getPriorityLabel, getStatusLabel, type TaskCenterItem } from '@/lib/task-center-ui'

type TaskCardProps = {
  task: TaskCenterItem
}

const priorityClass = {
  low: 'border-slate-200 bg-slate-50 text-slate-700',
  normal: 'border-cyan-200 bg-cyan-50 text-cyan-800',
  high: 'border-amber-200 bg-amber-50 text-amber-800',
  critical: 'border-rose-200 bg-rose-50 text-rose-800',
} as const

export function TaskCard({ task }: TaskCardProps) {
  const canOpenDetail = Boolean(task.detailHref)
  const canAct = Boolean(task.canAct && task.actionHref)

  return (
    <article className="siaga-card-interactive p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${priorityClass[task.priority]}`}>
              {getPriorityLabel(task.priority)}
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
              {getStatusLabel(task.status)}
            </span>
            <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700">
              {task.sourceLabel || 'Persiapan UI'}
            </span>
          </div>

          <h3 className="mt-3 text-base font-black text-slate-950">{task.title}</h3>
          <p className="mt-1 text-sm font-semibold text-slate-600">{task.moduleLabel}</p>
        </div>

        {task.dueLabel && (
          <div className="siaga-card-compact inline-flex w-fit items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700">
            <Clock3 className="h-4 w-4 text-cyan-700" aria-hidden="true" />
            {task.dueLabel}
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="siaga-card-compact siaga-card-recommendation p-3">
          <div className="text-[11px] font-black uppercase tracking-[0.16em] text-cyan-800">Langkah berikutnya</div>
          <p className="mt-1 text-sm leading-5 text-slate-700">{task.nextStep}</p>
        </div>
        <div className="siaga-card-compact siaga-card-warning p-3">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-amber-800">
            <ShieldAlert className="h-4 w-4" aria-hidden="true" />
            Risiko jika terlewat
          </div>
          <p className="mt-1 text-sm leading-5 text-slate-700">{task.risk}</p>
        </div>
      </div>

      {task.relatedLabel && (
        <div className="mt-3 text-xs font-semibold text-slate-500">Terkait: {task.relatedLabel}</div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {canOpenDetail ? (
          <Link href={task.detailHref!} className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-800 transition hover:border-cyan-300 hover:bg-cyan-50">
            Lihat Detail <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        ) : (
          <button type="button" disabled className="inline-flex h-9 cursor-not-allowed items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-400" title={task.disabledReason || 'Detail belum tersedia'}>
            Lihat Detail
          </button>
        )}

        {canAct ? (
          <Link href={task.actionHref!} className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 text-xs font-bold text-white transition hover:bg-slate-800">
            {task.actionLabel || 'Kerjakan'} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        ) : (
          <button type="button" disabled className="inline-flex h-9 cursor-not-allowed items-center justify-center rounded-xl bg-slate-100 px-3 text-xs font-bold text-slate-400" title={task.disabledReason || 'Aksi belum tersedia atau tidak sesuai role'}>
            {task.actionLabel || 'Kerjakan'}
          </button>
        )}
      </div>
    </article>
  )
}
