'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Activity,
  ArrowRight,
  BarChart3,
  Boxes,
  LayoutDashboard,
  Map,
  ShieldAlert,
  X,
} from 'lucide-react'

export type CommandNavigationItem = {
  id: 'summary' | 'risk' | 'progress' | 'activity' | 'map' | 'support'
  label: string
  description: string
  value: string
  status: string
  href: string
  tone: 'navy' | 'cyan' | 'amber' | 'rose' | 'slate'
}

type CommandCenterNavigationProps = {
  items: CommandNavigationItem[]
}

const iconById = {
  summary: LayoutDashboard,
  risk: ShieldAlert,
  progress: BarChart3,
  activity: Activity,
  map: Map,
  support: Boxes,
} as const

const toneByName = {
  navy: 'border-blue-200 bg-blue-50 text-blue-800',
  cyan: 'border-cyan-200 bg-cyan-50 text-cyan-800',
  amber: 'border-amber-200 bg-amber-50 text-amber-800',
  rose: 'border-rose-200 bg-rose-50 text-rose-800',
  slate: 'border-slate-200 bg-slate-50 text-slate-700',
} as const

export function CommandCenterNavigation({ items }: CommandCenterNavigationProps) {
  const [selected, setSelected] = useState<CommandNavigationItem | null>(null)

  useEffect(() => {
    if (!selected) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [selected])

  return (
    <>
      <section className="rounded-2xl border border-sky-100 bg-white/95 p-2 shadow-sm">
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 lg:grid lg:grid-cols-6 lg:overflow-visible">
          {items.map((item) => {
            const Icon = iconById[item.id]
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelected(item)}
                className="group flex min-w-[132px] items-center gap-2 rounded-xl border border-transparent px-2.5 py-2 text-left transition hover:border-cyan-200 hover:bg-cyan-50/70 lg:min-w-0"
              >
                <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${toneByName[item.tone]}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[11px] font-extrabold text-slate-900">{item.label}</span>
                  <span className="block truncate text-[9px] font-semibold text-slate-500">{item.value}</span>
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/25 p-0 backdrop-blur-[1px] sm:items-center sm:p-4" onClick={() => setSelected(null)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-label={`Detail ${selected.label}`}
            className="w-full rounded-t-3xl border border-sky-100 bg-white p-4 shadow-2xl sm:max-w-md sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border ${toneByName[selected.tone]}`}>
                  {(() => {
                    const Icon = iconById[selected.id]
                    return <Icon className="h-5 w-5" />
                  })()}
                </span>
                <div>
                  <div className="text-sm font-black text-slate-950">{selected.label}</div>
                  <div className="mt-0.5 text-[11px] text-slate-500">{selected.description}</div>
                </div>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200" aria-label="Tutup detail">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-slate-50 p-3">
                <div className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-slate-500">Ringkasan</div>
                <div className="mt-1 text-lg font-black text-slate-950">{selected.value}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <div className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-slate-500">Status Data</div>
                <div className="mt-1 text-xs font-black text-slate-800">{selected.status}</div>
              </div>
            </div>
            <div className="mt-3 rounded-2xl border border-cyan-100 bg-cyan-50/60 px-3 py-2 text-[10px] font-semibold text-slate-600">
              Modul dan angka tetap mengikuti role, permission, serta assignment scope aktif.
            </div>
            <Link href={selected.href} onClick={() => setSelected(null)} className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#0d2c54] px-4 text-xs font-extrabold text-white transition hover:bg-[#123e70]">
              Buka Modul <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </div>
      )}
    </>
  )
}

export default CommandCenterNavigation
