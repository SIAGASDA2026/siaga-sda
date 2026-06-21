'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Building2,
  Clock3,
  ClipboardCheck,
  FileText,
  FileSearch,
  FolderKanban,
  Gauge,
  Landmark,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  WalletCards,
} from 'lucide-react'
import { CommandCenterNavigation, type CommandNavigationItem } from './CommandCenterNavigation'
import { DashboardRightInspector, type DashboardInspectorItem } from './DashboardRightInspector'

type Tone = 'blue' | 'cyan' | 'green' | 'amber' | 'red' | 'violet' | 'slate'

type KpiItem = {
  id: string
  label: string
  value: number | string
  helper: string
  href: string
  tone: Tone
}

type PriorityItem = {
  id: string
  label: string
  detail: string
  href: string
  tone: Tone
}

type QuickActionItem = {
  label: string
  href: string
  desc: string
  badge?: number
}

type ActivityItem = {
  id: string
  userName: string
  detail: string
  time: string
}

type PackageTypeItem = {
  label: string
  count: number
}

type SupportItem = {
  id: 'letters' | 'flood' | 'assets' | 'administration' | 'prayer' | 'insight'
  label: string
  status: string
  source: string
  href?: string
}

type CommandCenterOverviewProps = {
  userName: string
  roleLabel: string
  scopeLabel: string
  activeYear: number
  dataSource: 'database' | 'demo'
  lastUpdate: string
  kpis: KpiItem[]
  priorities: PriorityItem[]
  avgPhysical: number
  avgFinancial: number
  health: {
    onTrack: number
    warning: number
    critical: number
  }
  packageTypes: PackageTypeItem[]
  risk: {
    critical: number
    approvalPending: number
    revision: number
    openIssues: number
  }
  canViewApproval: boolean
  quickActions: QuickActionItem[]
  activities: ActivityItem[]
  canViewAudit: boolean
  mapLocations: number
  mapWarnings: number
  navigationItems: CommandNavigationItem[]
  supportItems: SupportItem[]
  filterLabel: string
  onToggleFilters: () => void
  filterPanel?: ReactNode
  afterKpiContent?: ReactNode
  focusPackage?: {
    kode: string
    nama: string
    lokasi: string
    health: string
    jenis: string
    metode: string
    progressFisik: number
    progressKeuangan: number
    ppk: string
    pptk: string
  }
}

const toneStyles: Record<Tone, { card: string; icon: string; dot: string }> = {
  blue: { card: 'border-blue-100 bg-blue-50/70', icon: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  cyan: { card: 'border-cyan-100 bg-cyan-50/70', icon: 'bg-cyan-100 text-cyan-700', dot: 'bg-cyan-500' },
  green: { card: 'border-emerald-100 bg-emerald-50/70', icon: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  amber: { card: 'border-amber-100 bg-amber-50/70', icon: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  red: { card: 'border-rose-100 bg-rose-50/70', icon: 'bg-rose-100 text-rose-700', dot: 'bg-rose-500' },
  violet: { card: 'border-violet-100 bg-violet-50/70', icon: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500' },
  slate: { card: 'border-slate-200 bg-slate-50/80', icon: 'bg-slate-200 text-slate-700', dot: 'bg-slate-500' },
}

const kpiIcons = {
  packages: FolderKanban,
  progress: TrendingUp,
  risk: ShieldAlert,
  approval: ClipboardCheck,
  survey: FileSearch,
} as const

const supportIcons = {
  letters: FileText,
  flood: Landmark,
  assets: Building2,
  administration: WalletCards,
  prayer: Clock3,
  insight: Sparkles,
} as const

function ProgressBar({ label, value, tone }: { label: string; value: number; tone: 'cyan' | 'green' }) {
  const safeValue = Math.min(100, Math.max(0, Math.round(value)))
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3 text-[11px] font-bold text-slate-600">
        <span>{label}</span>
        <span className="text-slate-950">{safeValue}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${tone === 'cyan' ? 'bg-cyan-500' : 'bg-emerald-500'}`}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  )
}

export function CommandCenterOverview({
  userName,
  roleLabel,
  scopeLabel,
  activeYear,
  dataSource,
  lastUpdate,
  kpis,
  priorities,
  avgPhysical,
  avgFinancial,
  health,
  packageTypes,
  risk,
  canViewApproval,
  quickActions,
  activities,
  canViewAudit,
  mapLocations,
  mapWarnings,
  navigationItems,
  supportItems,
  filterLabel,
  onToggleFilters,
  filterPanel,
  afterKpiContent,
  focusPackage,
}: CommandCenterOverviewProps) {
  const deviation = Math.round(avgPhysical - avgFinancial)
  const [selectedInspectorId, setSelectedInspectorId] = useState('overview')
  const [inspectorModalOpen, setInspectorModalOpen] = useState(false)

  const sourceLabel = dataSource === 'database' ? 'Database' : 'Data Demo/Fallback'
  const overviewInspector: DashboardInspectorItem = {
    id: 'overview',
    kind: 'overview',
    eyebrow: 'Fokus Hari Ini',
    title: 'Ringkasan Command Center',
    description: `${roleLabel} | ${scopeLabel}`,
    source: sourceLabel,
    metrics: [
      { label: 'Paket Scoped', value: mapLocations },
      { label: 'Paket Kritis', value: risk.critical, tone: risk.critical > 0 ? 'critical' : 'good' },
      ...(canViewApproval ? [{ label: 'Approval Pending', value: risk.approvalPending, tone: risk.approvalPending > 0 ? 'warning' as const : 'good' as const }] : []),
      { label: 'Survey Pending', value: kpis.find((item) => item.id === 'survey')?.value || 0, tone: 'warning' },
    ],
    details: [
      `Progress fisik ${Math.round(avgPhysical)}% dan keuangan ${Math.round(avgFinancial)}%.`,
      `${health.onTrack} paket aman, ${health.warning} perlu perhatian, ${health.critical} kritis.`,
      `${mapWarnings} lokasi/paket memerlukan perhatian.`,
    ],
    href: '/proyek?status=aktif&source_module=dashboard',
    hrefLabel: 'Buka Paket Aktif',
    secondaryLinks: [
      ...(canViewApproval ? [{ label: 'Approval Center', href: '/approval?approval_status=pending&source_module=dashboard' }] : []),
      { label: 'Peta Monitoring', href: '/peta?source_module=dashboard' },
    ],
  }

  const inspectorItems: DashboardInspectorItem[] = [
    overviewInspector,
    ...kpis.map((item): DashboardInspectorItem => ({
      id: `kpi-${item.id}`,
      kind: item.id === 'approval' ? 'approval' : item.id === 'survey' ? 'survey' : item.id === 'progress' ? 'progress' : item.id === 'risk' ? 'risk' : 'overview',
      eyebrow: 'KPI Dashboard',
      title: item.label,
      description: item.helper,
      source: item.id === 'approval' ? 'Approval Summary formal' : sourceLabel,
      metrics: [{ label: item.label, value: item.value, tone: item.tone === 'red' ? 'critical' : item.tone === 'amber' || item.tone === 'violet' ? 'warning' : 'default' }],
      details: item.id === 'progress'
        ? [`Fisik ${Math.round(avgPhysical)}%.`, `Keuangan ${Math.round(avgFinancial)}%.`, `Deviasi ${deviation > 0 ? '+' : ''}${deviation}%.`]
        : [`Nilai mengikuti role, assignment scope, dan filter aktif.`],
      href: item.href,
      hrefLabel: `Buka ${item.label}`,
    })),
    ...priorities.slice(0, 3).map((item): DashboardInspectorItem => ({
      id: `priority-${item.id}`,
      kind: item.label.includes('Approval') ? 'approval' : item.label.includes('Survey') ? 'survey' : item.label.includes('Kritis') ? 'package' : 'risk',
      eyebrow: 'Command Brief',
      title: item.label,
      description: item.detail,
      source: item.label.includes('Approval') ? 'Approval Summary formal' : sourceLabel,
      metrics: [{ label: 'Perlu Perhatian', value: item.detail, tone: item.tone === 'red' ? 'critical' : 'warning' }],
      details: focusPackage && item.label.includes('Kritis')
        ? [
            `${focusPackage.kode} | ${focusPackage.nama}`,
            `Health: ${focusPackage.health} | ${focusPackage.jenis} | ${focusPackage.metode}`,
            `Lokasi: ${focusPackage.lokasi}`,
            `Fisik ${focusPackage.progressFisik}% | Keuangan ${focusPackage.progressKeuangan}%`,
            `PPK: ${focusPackage.ppk} | PPTK: ${focusPackage.pptk}`,
          ]
        : ['Buka modul asal untuk melihat daftar dan tindak lanjut lengkap.'],
      href: item.href,
      hrefLabel: item.label.includes('Kritis') ? 'Buka Paket Kritis' : 'Buka Modul',
    })),
    ...navigationItems.map((item): DashboardInspectorItem => ({
      id: `navigation-${item.id}`,
      kind: item.id === 'risk' ? 'risk' : item.id === 'progress' ? 'progress' : item.id === 'activity' ? 'activity' : item.id === 'support' || item.id === 'map' ? 'module' : 'overview',
      eyebrow: 'Navigasi Command Center',
      title: item.label,
      description: item.description,
      source: item.status,
      metrics: [{ label: 'Ringkasan', value: item.value }],
      details: ['Akses modul tetap mengikuti role dan assignment scope aktif.'],
      href: item.href,
      hrefLabel: 'Buka Modul',
    })),
    ...supportItems.map((item): DashboardInspectorItem => ({
      id: `support-${item.id}`,
      kind: 'module',
      eyebrow: 'Modul Pendukung',
      title: item.label,
      description: item.status,
      source: item.source,
      metrics: [{ label: 'Status', value: item.status }],
      details: [item.source === 'Persiapan' ? 'Belum ditampilkan sebagai data resmi pada Command Center.' : 'Ringkasan mengikuti sumber modul existing.'],
      href: item.href,
      hrefLabel: item.href ? `Buka ${item.label}` : undefined,
    })),
  ]

  const selectedInspector = inspectorItems.find((item) => item.id === selectedInspectorId) || overviewInspector
  const selectInspector = (id: string) => {
    setSelectedInspectorId(id)
    setInspectorModalOpen(true)
  }

  return (
    <div className="space-y-2.5">
      <div className="space-y-2.5">
      <section className="siaga-section-canvas">
        <div className="flex flex-col gap-2 bg-gradient-to-r from-[#0d2c54] via-[#104b73] to-[#0f6b78] px-4 py-2.5 text-white lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-cyan-200">Dashboard Command Center SDA</div>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <h1 className="text-lg font-black tracking-tight sm:text-xl">Ringkasan keputusan hari ini</h1>
              <span className="text-xs font-semibold text-blue-100">{userName} | {roleLabel}</span>
            </div>
            <div className="mt-1 text-[11px] text-blue-100">{scopeLabel}</div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
            <span className="rounded-lg border border-white/15 bg-white/10 px-2.5 py-1.5">Tahun {activeYear}</span>
            <span className={`rounded-lg border px-2.5 py-1.5 ${dataSource === 'database' ? 'border-emerald-300/40 bg-emerald-300/15 text-emerald-100' : 'border-amber-300/50 bg-amber-300/15 text-amber-100'}`}>
              {dataSource === 'database' ? 'Data Database' : 'Data Demo/Fallback'}
            </span>
            <span className="rounded-lg border border-white/15 bg-white/10 px-2.5 py-1.5">{lastUpdate}</span>
            <button type="button" onClick={onToggleFilters} className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-200/30 bg-cyan-100/10 px-2.5 py-1.5 text-cyan-50 transition hover:bg-cyan-100/20">
              <SlidersHorizontal className="h-3.5 w-3.5" /> {filterLabel}
            </button>
          </div>
        </div>
        {dataSource === 'demo' && (
          <div className="border-t border-amber-200 bg-amber-50 px-4 py-2 text-[11px] font-semibold text-amber-900">
            Data demo/fallback sedang ditampilkan. Angka pada ringkasan ini bukan data resmi.
          </div>
        )}
      </section>

      {filterPanel && (
        <section className="siaga-section-canvas-muted p-3">
          {filterPanel}
        </section>
      )}

      <CommandCenterNavigation items={navigationItems} onSelect={(item) => selectInspector(`navigation-${item.id}`)} />

      <section className="siaga-section-canvas-muted grid grid-cols-2 gap-1.5 p-2 sm:grid-cols-3 xl:grid-cols-5">
        {kpis.map((item) => {
          const Icon = kpiIcons[item.id as keyof typeof kpiIcons] || Gauge
          const style = toneStyles[item.tone]
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => selectInspector(`kpi-${item.id}`)}
              className={`siaga-card-interactive group p-2.5 ${style.card}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="line-clamp-2 text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-600">{item.label}</div>
                  <div className="mt-1 text-xl font-black leading-none text-slate-950 sm:text-2xl">{item.value}</div>
                </div>
                <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${style.icon}`}>
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-1.5 line-clamp-1 text-[10px] font-medium text-slate-500">{item.helper}</div>
            </button>
          )
        })}
      </section>

      {afterKpiContent}

      <section className="grid gap-2.5 xl:grid-cols-[1.08fr_0.92fr_0.92fr]">
        <div className="siaga-card px-3 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-cyan-700">Command Brief</div>
              <h2 className="mt-0.5 text-sm font-black text-slate-950">Prioritas tindakan</h2>
            </div>
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <div className="mt-2 space-y-1.5">
            {priorities.slice(0, 3).map((item) => (
              <button type="button" key={item.id} onClick={() => selectInspector(`priority-${item.id}`)} className="siaga-card-interactive flex w-full items-center gap-2 px-2.5 py-2 text-left">
                <span className={`h-2 w-2 shrink-0 rounded-full ${toneStyles[item.tone].dot}`} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[11px] font-extrabold text-slate-900">{item.label}</div>
                  <div className="truncate text-[10px] text-slate-500">{item.detail}</div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              </button>
            ))}
          </div>
        </div>

        <div className="siaga-card px-3 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-sky-700">Progress</div>
              <h2 className="mt-0.5 text-sm font-black text-slate-950">Fisik vs keuangan</h2>
            </div>
            <button type="button" onClick={() => selectInspector('kpi-progress')} className={`rounded-full px-2 py-1 text-[10px] font-black ${deviation >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
              Deviasi {deviation > 0 ? '+' : ''}{deviation}%
            </button>
          </div>
          <div className="mt-3 space-y-3">
            <ProgressBar label="Progres Fisik" value={avgPhysical} tone="cyan" />
            <ProgressBar label="Progres Keuangan" value={avgFinancial} tone="green" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {packageTypes.slice(0, 3).map((item) => (
              <Link key={item.label} href={`/proyek?jenis_paket=${encodeURIComponent(item.label.toLowerCase())}&source_module=dashboard`} className="siaga-card-interactive px-2 py-1.5 text-center">
                <div className="text-sm font-black text-slate-950">{item.count}</div>
                <div className="truncate text-[9px] font-bold uppercase text-slate-500">{item.label}</div>
              </Link>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] font-semibold text-slate-500">
            <span className="text-emerald-700">{health.onTrack} aman</span>
            <span className="text-amber-700">{health.warning} perhatian</span>
            <span className="text-rose-700">{health.critical} kritis</span>
          </div>
        </div>

        <div className="siaga-card siaga-card-warning px-3 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-amber-700">Risk & Approval</div>
              <h2 className="mt-0.5 text-sm font-black text-slate-950">Perlu perhatian</h2>
            </div>
            <ShieldAlert className="h-5 w-5 text-rose-500" />
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {[
              { label: 'Paket Kritis', value: risk.critical, href: '/proyek?health=kritis&source_module=dashboard', tone: 'red' as Tone },
              { label: 'Approval Pending', value: risk.approvalPending, href: '/approval?approval_status=pending&source_module=dashboard', tone: 'amber' as Tone },
              { label: 'Minta Revisi', value: risk.revision, href: '/approval?approval_status=REVISION&source_module=dashboard', tone: 'violet' as Tone },
              { label: 'Masalah Open', value: risk.openIssues, href: '/masalah?status=open&source_module=dashboard', tone: 'slate' as Tone },
            ].filter((item) => canViewApproval || !item.href.startsWith('/approval')).map((item) => (
              <button type="button" key={item.label} onClick={() => selectInspector(item.href.startsWith('/approval') ? 'kpi-approval' : item.label.includes('Kritis') ? 'kpi-risk' : 'overview')} className={`siaga-card-interactive p-2 text-left ${toneStyles[item.tone].card}`}>
                <div className="text-lg font-black text-slate-950">{item.value}</div>
                <div className="text-[10px] font-bold text-slate-600">{item.label}</div>
              </button>
            ))}
          </div>
          <Link href={canViewApproval ? '/approval?source_module=dashboard' : '/proyek?health=kritis&source_module=dashboard'} className="mt-2 inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-xl bg-[#0d2c54] px-3 text-[11px] font-bold text-white transition hover:bg-[#123e70]">
            {canViewApproval ? 'Buka Approval Center' : 'Buka Paket Berisiko'} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      <section className="grid gap-2.5 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="siaga-card px-3 py-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-cyan-700">Akses & Aktivitas</div>
              <div className="text-xs font-bold text-slate-900">Aksi role-aware dan pembaruan scoped</div>
            </div>
            {canViewAudit && <Link href="/audit-log" className="text-[10px] font-bold text-cyan-700 hover:underline">Audit Log</Link>}
          </div>
          <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1">
            {quickActions.slice(0, 4).map((action) => (
              <Link key={action.label} href={action.href} className="siaga-card-interactive relative min-w-[130px] rounded-full px-3 py-2">
                <div className="truncate text-[10px] font-extrabold text-slate-800">{action.label}</div>
                {typeof action.badge === 'number' && action.badge > 0 && (
                  <span className="absolute -right-1 -top-1 rounded-full bg-slate-900 px-1.5 py-0.5 text-[8px] font-black text-white">{action.badge > 99 ? '99+' : action.badge}</span>
                )}
              </Link>
            ))}
          </div>
          <div className="mt-2 divide-y divide-slate-100 border-t border-slate-100">
            {activities.length > 0 ? activities.slice(0, 3).map((item) => (
                <button type="button" key={item.id} onClick={() => selectInspector('navigation-activity')} className="flex w-full items-center gap-2 py-1.5 text-left">
                <Activity className="h-3.5 w-3.5 shrink-0 text-cyan-600" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[10px] font-bold text-slate-800">{item.detail}</div>
                  <div className="truncate text-[9px] text-slate-500">{item.userName} | {item.time}</div>
                </div>
              </button>
            )) : (
              <div className="py-4 text-center text-[10px] font-semibold text-slate-500">Belum ada aktivitas scoped.</div>
            )}
          </div>
        </div>

        <div className="siaga-card px-3 py-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-sky-700">Modul Pendukung</div>
              <div className="text-xs font-bold text-slate-900">{mapLocations} lokasi | {mapWarnings} perlu perhatian</div>
            </div>
            <Link href="/peta?source_module=dashboard" className="text-[10px] font-bold text-cyan-700 hover:underline">Buka Peta</Link>
          </div>
          <div className="mt-2 divide-y divide-slate-100">
            {supportItems.map((item) => {
              const Icon = supportIcons[item.id]
              const row = (
                <>
                  <Icon className="h-3.5 w-3.5 shrink-0 text-cyan-700" />
                  <span className="min-w-0 flex-1 truncate text-[10px] font-bold text-slate-800">{item.label}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[8px] font-bold text-slate-600">{item.source}</span>
                  <span className="max-w-[92px] truncate text-[9px] text-slate-500">{item.status}</span>
                  {item.href && <ArrowRight className="h-3 w-3 shrink-0 text-slate-400" />}
                </>
              )
              return (
                <button type="button" key={item.id} onClick={() => selectInspector(`support-${item.id}`)} className="flex w-full items-center gap-2 py-1.5 text-left transition hover:text-cyan-800">{row}</button>
              )
            })}
          </div>
        </div>
      </section>
      </div>

      <DashboardRightInspector item={selectedInspector} open={inspectorModalOpen} onClose={() => setInspectorModalOpen(false)} />
    </div>
  )
}

export default CommandCenterOverview
