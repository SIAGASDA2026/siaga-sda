'use client'

import {
  Activity,
  BarChart3,
  Boxes,
  LayoutDashboard,
  Map,
  ShieldAlert,
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
  onSelect: (item: CommandNavigationItem) => void
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

export function CommandCenterNavigation({ items, onSelect }: CommandCenterNavigationProps) {
  return (
    <section className="siaga-section-canvas-muted p-1.5">
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 xl:grid-cols-6">
        {items.map((item) => {
          const Icon = iconById[item.id]
          const mobileLabel = item.id === 'risk'
            ? 'Risiko'
            : item.id === 'map'
            ? 'Peta'
            : item.id === 'support'
            ? 'Modul'
            : item.label
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className="siaga-card-interactive group flex min-h-[56px] min-w-0 items-center gap-2 px-2 py-1.5 text-left"
            >
              <span className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${toneByName[item.tone]}`}>
                <Icon className="h-3.5 w-3.5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[10px] font-extrabold text-slate-900 sm:hidden">{mobileLabel}</span>
                <span className="hidden truncate text-[10px] font-extrabold text-slate-900 sm:block">{item.label}</span>
                <span className="block truncate text-[9px] font-semibold text-slate-500">{item.value}</span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default CommandCenterNavigation
