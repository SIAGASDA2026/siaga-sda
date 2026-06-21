import Link from 'next/link'
import { CheckCircle2, ClipboardList, ShieldAlert } from 'lucide-react'
import { EmptyAssignmentCard } from './EmptyAssignmentCard'
import { TaskCard } from './TaskCard'
import { AppreciationHistoryPanel } from './AppreciationHistoryPanel'
import type { AppreciationEvent, TaskCenterIdentity, TaskCenterItem } from '@/lib/task-center-ui'

export type TaskCenterSystemWarning = {
  id: string
  title: string
  detail: string
  href: string
  level: 'warning' | 'critical' | 'info'
}

type TaskCenterPanelProps = {
  identity?: TaskCenterIdentity
  tasks: TaskCenterItem[]
  completedTasks?: TaskCenterItem[]
  appreciationEvents?: AppreciationEvent[]
  dataSourceLabel?: string
  systemWarnings?: TaskCenterSystemWarning[]
}

export function TaskCenterPanel({
  identity,
  tasks,
  completedTasks = [],
  appreciationEvents = [],
  dataSourceLabel = 'Belum Terhubung Data Resmi',
  systemWarnings = [],
}: TaskCenterPanelProps) {
  const activeTasks = tasks.filter((task) => task.status !== 'done')
  const visibleTasks = activeTasks.slice(0, 3)
  const visibleSystemWarnings = systemWarnings.slice(0, 10)

  return (
    <section className="siaga-section-canvas relative z-10 p-4 text-slate-900 sm:p-5">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-12 bottom-0 h-28 w-28 rounded-full bg-blue-200/30 blur-3xl" />

      <div className="relative">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-700">Dashboard &gt; Tugas Saya</div>
            <h2 className="mt-1 text-xl font-black text-slate-950">Tugas Saya</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
              Skeleton tugas berbasis assignment scope. Data resmi belum dihubungkan ke API/database, sehingga default aman adalah empty assignment.
            </p>
          </div>
          <div className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-cyan-200 bg-white/90 px-3 py-2 text-left text-[11px] font-black uppercase leading-4 tracking-[0.12em] text-cyan-800 shadow-sm">
            <span className="h-2 w-2 flex-shrink-0 rounded-full bg-cyan-500" aria-hidden="true" />
            <span className="min-w-0">{dataSourceLabel}</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <SummaryMetric icon={ClipboardList} label="Tugas Aktif" value={activeTasks.length} tone="cyan" />
          <SummaryMetric icon={CheckCircle2} label="Selesai" value={completedTasks.length} tone="green" />
          <SummaryMetric icon={ShieldAlert} label="Peringatan Sistem" value={systemWarnings.length} tone="amber" />
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[1.45fr_0.8fr]">
          <div className="space-y-3">
            {visibleTasks.length > 0 ? (
              visibleTasks.map((task) => <TaskCard key={task.id} task={task} />)
            ) : (
              <EmptyAssignmentCard identity={identity} />
            )}
          </div>

          <div className="space-y-4">
            <section className="siaga-card px-4 py-3">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-700">Langkah Berikutnya</div>
              <h3 className="mt-1 text-base font-black text-slate-950">Belum ada misi pribadi hari ini.</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Tugas baru akan muncul setelah admin atau pejabat berwenang menetapkan assignment. Peringatan sistem di bawah bukan tugas pribadi, tetapi risiko paket dalam scope yang boleh terlihat.
              </p>
            </section>

            <section className="siaga-card siaga-card-warning px-4 py-3">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">Peringatan Sistem</div>
              <h3 className="mt-1 text-base font-black text-slate-950">Peringatan Sistem dalam scope Anda</h3>
              <p className="mt-2 text-xs leading-5 text-amber-900">
                Daftar ini bukan Tugas Saya. Ini adalah paket berisiko yang terlihat sesuai role dan assignment scope.
              </p>
              {systemWarnings.length > 0 && (
                <p className="mt-2 text-[11px] font-bold text-amber-900">
                  Menampilkan {visibleSystemWarnings.length} dari {systemWarnings.length} peringatan sistem.
                </p>
              )}
              {visibleSystemWarnings.length === 0 ? (
                <p className="mt-3 rounded-2xl bg-white/80 px-3 py-2 text-sm font-semibold text-slate-600">
                  Tidak ada peringatan sistem pada filter aktif.
                </p>
              ) : (
                <div className="mt-3 space-y-2">
                  {visibleSystemWarnings.map((warning) => (
                    <Link key={warning.id} href={warning.href} className="siaga-card-interactive block px-3 py-2 text-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="line-clamp-1 font-black text-slate-900">{warning.title}</div>
                          <div className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">{warning.detail}</div>
                        </div>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black ${warning.level === 'critical' ? 'bg-red-50 text-red-700' : 'bg-amber-100 text-amber-800'}`}>
                          {warning.level === 'critical' ? 'Kritis' : 'Risiko'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section className="siaga-card px-4 py-3">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">Tugas Selesai</div>
              {completedTasks.length === 0 ? (
                <p className="mt-2 text-sm leading-6 text-slate-600">Belum ada tugas selesai yang terhubung ke workflow resmi.</p>
              ) : (
                <div className="mt-3 space-y-2">
                  {completedTasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="siaga-card-compact siaga-card-success px-3 py-2 text-sm font-semibold text-emerald-900">
                      {task.title}
                    </div>
                  ))}
                </div>
              )}
            </section>

            <AppreciationHistoryPanel events={appreciationEvents} />
          </div>
        </div>
      </div>
    </section>
  )
}

function SummaryMetric({ icon: Icon, label, value, tone }: { icon: typeof ClipboardList; label: string; value: number; tone: 'cyan' | 'green' | 'amber' }) {
  const toneClass = tone === 'green'
    ? 'border-emerald-100 bg-emerald-50 text-emerald-800'
    : tone === 'amber'
    ? 'border-amber-100 bg-amber-50 text-amber-800'
    : 'border-cyan-100 bg-cyan-50 text-cyan-800'

  return (
    <div className={`siaga-card-compact p-2.5 ${toneClass}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 text-[10px] font-black uppercase leading-4 tracking-[0.12em]">{label}</div>
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <div className="mt-2 text-2xl font-black text-slate-950">{value}</div>
    </div>
  )
}
