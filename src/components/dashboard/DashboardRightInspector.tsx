'use client'

import Link from 'next/link'
import { Modal } from '@/components/ui'
import { ArrowRight, Crosshair, Database, Info, ShieldCheck } from 'lucide-react'

export type DashboardInspectorKind =
  | 'overview'
  | 'package'
  | 'approval'
  | 'survey'
  | 'risk'
  | 'progress'
  | 'activity'
  | 'module'

export type DashboardInspectorItem = {
  id: string
  kind: DashboardInspectorKind
  eyebrow: string
  title: string
  description: string
  source: string
  metrics: Array<{ label: string; value: string | number; tone?: 'default' | 'good' | 'warning' | 'critical' }>
  details?: string[]
  href?: string
  hrefLabel?: string
  secondaryLinks?: Array<{ label: string; href: string }>
}

type DashboardRightInspectorProps = {
  item: DashboardInspectorItem
  open: boolean
  onClose: () => void
}

const metricTone = {
  default: 'border-slate-100 bg-slate-50 text-slate-950',
  good: 'border-emerald-100 bg-emerald-50 text-emerald-800',
  warning: 'border-amber-100 bg-amber-50 text-amber-800',
  critical: 'border-rose-100 bg-rose-50 text-rose-800',
} as const

const inspectorKindLabel: Record<DashboardInspectorKind, string> = {
  overview: 'Ringkasan',
  package: 'Paket',
  approval: 'Approval',
  survey: 'Survey',
  risk: 'Risiko',
  progress: 'Progress',
  activity: 'Aktivitas',
  module: 'Modul',
}

function InspectorContent({ item }: { item: DashboardInspectorItem }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] font-bold text-cyan-700">{inspectorKindLabel[item.kind]}</span>
          <span className="rounded-full border border-amber-100 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">{item.eyebrow}</span>
        </div>
        <div className="text-base font-extrabold text-slate-900">{item.title}</div>
        <div className="mt-1 text-sm text-slate-600">{item.description}</div>
        <div className="mt-2 text-xs text-slate-500">
          Sumber: <span className="font-semibold text-slate-700">{item.source}</span>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {item.metrics.map((metric) => (
          <div key={metric.label} className={`rounded-xl border p-3 ${metricTone[metric.tone || 'default']}`}>
            <div className="text-[10px] font-bold uppercase opacity-70">{metric.label}</div>
            <div className="mt-1 text-sm font-semibold sm:text-base">{metric.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-100 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900">
          <Info className="h-4 w-4" /> Detail Dashboard
        </div>
        {item.details && item.details.length > 0 ? (
          <div className="space-y-3">
            {item.details.slice(0, 6).map((detail) => (
              <div key={detail} className="rounded-lg border border-slate-100 bg-white p-3">
                <div className="text-sm text-slate-700">{detail}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-slate-500">Belum ada detail tambahan untuk item ini.</div>
        )}
      </div>

      <div className="rounded-xl border border-cyan-100 bg-cyan-50/70 p-3 text-sm text-cyan-900">
        <div className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <div>
            <div className="font-bold">Catatan Role & Scope</div>
            <div className="mt-0.5 text-cyan-800">Detail ini memakai data yang sudah tersedia pada dashboard, mengikuti role aktif, assignment scope, dan sumber data yang sama.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InspectorFooter({ item, onClose }: { item: DashboardInspectorItem; onClose: () => void }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      {item.href && (
        <Link href={item.href} className="flex-1 rounded-xl bg-blue-700 px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-blue-800">
          {item.hrefLabel || 'Buka Detail'} <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
        </Link>
      )}
      {item.secondaryLinks && item.secondaryLinks.length > 0 && item.secondaryLinks.slice(0, 2).map((link) => (
        <Link key={link.href} href={link.href} className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-bold text-slate-700 hover:bg-slate-50">
          {link.label}
        </Link>
      ))}
      <button
        type="button"
        onClick={onClose}
        className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
      >
        Tutup
      </button>
    </div>
  )
}

export function DashboardRightInspector({ item, open, onClose }: DashboardRightInspectorProps) {
  if (!open) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Detail Dashboard"
      subtitle={`${item.title} - ${item.eyebrow}`}
      size="lg"
      footer={<InspectorFooter item={item} onClose={onClose} />}
    >
      <InspectorContent item={item} />
    </Modal>
  )
}

export default DashboardRightInspector
