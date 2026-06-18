import Link from 'next/link'
import { Clock3, Sparkles } from 'lucide-react'
import type { AppreciationEvent } from '@/lib/task-center-ui'

type AppreciationHistoryPanelProps = {
  events: AppreciationEvent[]
}

export function AppreciationHistoryPanel({ events }: AppreciationHistoryPanelProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-700">Riwayat Apresiasi</div>
          <h3 className="mt-1 text-base font-black text-slate-950">Ucapan dan tugas selesai</h3>
        </div>
        <Sparkles className="h-5 w-5 text-cyan-700" aria-hidden="true" />
      </div>

      {events.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Belum ada riwayat apresiasi resmi. Riwayat akan tampil setelah aksi sukses terhubung ke workflow resmi.
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {events.slice(0, 5).map((event) => (
            <article key={event.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-sm font-black text-slate-950">{event.title}</div>
                  <div className="mt-1 text-xs font-semibold text-slate-600">{event.moduleLabel} - {event.actionLabel}</div>
                </div>
                <span className="inline-flex w-fit items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600">
                  <Clock3 className="h-3 w-3" aria-hidden="true" />
                  {event.createdAtLabel}
                </span>
              </div>
              <p className="mt-2 text-sm leading-5 text-slate-700">{event.nextStep}</p>
              {event.detailHref && (
                <Link href={event.detailHref} className="mt-3 inline-flex text-xs font-bold text-cyan-700 hover:underline">
                  Lihat Detail
                </Link>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

