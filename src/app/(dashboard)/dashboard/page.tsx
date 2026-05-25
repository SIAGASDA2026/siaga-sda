'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Activity, AlertTriangle, ArrowRight, BarChart2, Bot, Building2, Camera, CheckCircle, ClipboardList, Eye, FileText, FolderOpen, HardHat, Landmark, LifeBuoy, MapPin, Megaphone, MessageSquare, Plus, ShieldAlert, TrendingDown, TrendingUp, Users, Waves, XCircle } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { Topbar } from '@/components/layout/Topbar'
import { ProjectScopeFilters } from '@/components/project/ProjectScopeFilters'
import { PrayerTimeWidget } from '@/components/dashboard/PrayerTimeWidget'
import { TideDashboardPanel } from '@/components/dashboard/TideDashboardPanel'
import { BRAND } from '@/lib/brand'
import { filterProjectsByScope, getProjectBudgetYears, getProjectCategoryLabel, getProjectPackageType, getProjectPackageTypeLabel, getProjectPrograms, getProjectSubKegiatan, getProjectWorkStage, getProjectWorkStageLabel } from '@/lib/reporting'
import { formatCurrency, formatDateTime, getHealthBadge, getRoleLabel } from '@/lib/utils'

type DashboardTab =
  | 'ringkasan'
  | 'monitoring'
  | 'survey'
  | 'paket'
  | 'approval'
  | 'surat'
  | 'peil'
  | 'asset'
  | 'operasional'
  | 'pasang-surut'
  | 'warning'
  | 'waktu'
  | 'aktivitas'
  | 'ai'

const DASHBOARD_TABS: { id: DashboardTab; label: string; desc: string }[] = [
  { id: 'ringkasan', label: 'Ringkasan', desc: 'KPI utama' },
  { id: 'monitoring', label: 'Monitoring', desc: 'Progress dan paket' },
  { id: 'survey', label: 'Survey', desc: 'Investigasi lapangan' },
  { id: 'paket', label: 'Paket', desc: 'Ruang kerja paket' },
  { id: 'approval', label: 'Approval & Risiko', desc: 'Pending dan kritis' },
  { id: 'surat', label: 'Surat', desc: 'Masuk dan keluar' },
  { id: 'peil', label: 'Peil Banjir', desc: 'Titik peil' },
  { id: 'asset', label: 'Asset SDA', desc: 'Pintu air/pompa' },
  { id: 'operasional', label: 'Operasional', desc: 'Mandor dan shift' },
  { id: 'pasang-surut', label: 'Pasang Surut', desc: 'Rob dan muka air' },
  { id: 'warning', label: 'Warning Center', desc: 'Peringatan SDA' },
  { id: 'waktu', label: 'Waktu & Salat', desc: 'Jam dan pengingat' },
  { id: 'aktivitas', label: 'Aktivitas', desc: 'Audit terbaru' },
  { id: 'ai', label: 'AI Analisis', desc: 'Saran teknis' },
]

export default function DashboardPage() {
  const { projects, currentUser, auditLogs } = useAppStore()
  const [activeTab, setActiveTab] = useState<DashboardTab>('ringkasan')
  const [filterKategori, setFilterKategori] = useState('all')
  const [filterJenisProyek, setFilterJenisProyek] = useState('all')
  const [filterTahap, setFilterTahap] = useState('all')
  const [filterTahun, setFilterTahun] = useState('all')
  const [filterProgram, setFilterProgram] = useState('all')
  const [filterSubKegiatan, setFilterSubKegiatan] = useState('all')

  const budgetYears = useMemo(() => getProjectBudgetYears(projects), [projects])
  const programs = useMemo(() => getProjectPrograms(projects), [projects])
  const subKegiatanOptions = useMemo(() => getProjectSubKegiatan(projects), [projects])
  const visibleProjects = useMemo(
    () => filterProjectsByScope(projects, filterKategori, filterJenisProyek, filterTahap, filterTahun, filterProgram, filterSubKegiatan),
    [projects, filterKategori, filterJenisProyek, filterTahap, filterTahun, filterProgram, filterSubKegiatan],
  )

  const activeFilterLabels = [
    filterKategori !== 'all' ? `Metode: ${getProjectCategoryLabel(filterKategori)}` : null,
    filterJenisProyek !== 'all' ? `Jenis: ${getProjectPackageTypeLabel(filterJenisProyek)}` : null,
    filterTahap !== 'all' ? `Tahap: ${getProjectWorkStageLabel(filterTahap)}` : null,
    filterTahun !== 'all' ? `Tahun: ${filterTahun}` : null,
    filterProgram !== 'all' ? `Program: ${filterProgram}` : null,
    filterSubKegiatan !== 'all' ? `Sub Kegiatan: ${filterSubKegiatan}` : null,
  ].filter(Boolean)

  const stats = useMemo(() => {
    const onTrack = visibleProjects.filter((project) => project.health === 'on_track').length
    const warning = visibleProjects.filter((project) => project.health === 'warning').length
    const kritis = visibleProjects.filter((project) => project.health === 'kritis').length
    const totalAnggaran = visibleProjects.reduce((sum, project) => sum + project.anggaran, 0)
    const avgFisik = visibleProjects.length ? visibleProjects.reduce((sum, project) => sum + project.progressFisik, 0) / visibleProjects.length : 0
    const avgKeuangan = visibleProjects.length ? visibleProjects.reduce((sum, project) => sum + project.progressKeuangan, 0) / visibleProjects.length : 0
    const selesai = visibleProjects.filter((project) => project.status === 'selesai').length
    const openMasalah = visibleProjects.reduce((sum, project) => sum + project.masalah.filter((item) => item.status === 'open').length, 0)
    const totalLaporan = visibleProjects.reduce((sum, project) => sum + project.laporanHarian.length, 0)
    const laporanMenunggu = visibleProjects.reduce((sum, project) => sum + project.laporanHarian.filter((item) => !item.disetujui).length, 0)
    const surveyMenunggu = visibleProjects.reduce((sum, project) => sum + project.surveys.filter((item) => item.status === 'submitted').length, 0)
    const rabMenunggu = visibleProjects.reduce((sum, project) => sum + project.rabList.filter((item) => item.status !== 'approved' && item.status !== 'rejected').length, 0)
    return { total: visibleProjects.length, onTrack, warning, kritis, totalAnggaran, avgFisik, avgKeuangan, selesai, openMasalah, totalLaporan, laporanMenunggu, surveyMenunggu, rabMenunggu }
  }, [visibleProjects])

  const barData = useMemo(() => visibleProjects.slice(0, 8).map((project) => ({
    name: project.kode.split('-').slice(0, 2).join('-'),
    fisik: project.progressFisik,
    keuangan: project.progressKeuangan,
    health: project.health,
  })), [visibleProjects])

  const pieData = [
    { name: 'On Track', value: stats.onTrack, fill: '#43A047' },
    { name: 'Warning', value: stats.warning, fill: '#FFB300' },
    { name: 'Kritis', value: stats.kritis, fill: '#E53935' },
  ].filter((item) => item.value > 0)

  const recentActivity = auditLogs.slice(0, 7)
  const currentRole = currentUser?.role || 'pptk'
  const normalizedRole = currentRole.toLowerCase()
  const roleLabel = getRoleLabel(currentRole)
  const approvalPending = stats.laporanMenunggu + stats.rabMenunggu + stats.surveyMenunggu
  const riskProjects = visibleProjects
    .filter((project) => project.health === 'kritis' || project.health === 'warning' || project.masalah.some((item) => item.status === 'open'))
    .sort((a, b) => (b.health === 'kritis' ? 2 : b.health === 'warning' ? 1 : 0) - (a.health === 'kritis' ? 2 : a.health === 'warning' ? 1 : 0))

  const quickActions = {
    pptk: [
      { label: 'Input Laporan', href: '/laporan', icon: FileText, color: 'bg-gradient-to-br from-[#FF6A00] to-[#FF3D00]', desc: 'Upload progress harian' },
      { label: 'Peta Monitoring', href: '/peta', icon: MapPin, color: 'bg-gradient-to-br from-[#3730A3] to-[#06B6D4]', desc: 'Pantau sebaran paket' },
      { label: 'Chat Proyek', href: '/chat', icon: MessageSquare, color: 'bg-gradient-to-br from-[#00897B] to-[#00ACC1]', desc: 'Koordinasi tim lapangan' },
    ],
  ppk: [
    { label: 'Approval Center', href: '/approval', icon: CheckCircle, color: 'bg-gradient-to-br from-[#2E7D32] to-[#66BB6A]', desc: `${approvalPending} item menunggu` },
    { label: 'Proyek Kritis', href: '/proyek', icon: ShieldAlert, color: 'bg-gradient-to-br from-[#D32F2F] to-[#E53935]', desc: 'Lihat paket deviasi' },
    { label: 'Peta Monitoring', href: '/peta', icon: MapPin, color: 'bg-gradient-to-br from-[#3730A3] to-[#06B6D4]', desc: 'Buka peta monitoring' },
  ],
  pimpinan: [
    { label: 'Peta Monitoring', href: '/peta', icon: MapPin, color: 'bg-gradient-to-br from-[#3730A3] to-[#06B6D4]', desc: 'Pantau situasi SDA' },
    { label: 'Surat Masuk', href: '/pengumuman', icon: MessageSquare, color: 'bg-gradient-to-br from-[#2b2f6b] to-[#0D47A1]', desc: 'Surat penting' },
    { label: 'Asset SDA', href: '/peta', icon: Building2, color: 'bg-gradient-to-br from-[#2E7D32] to-[#66BB6A]', desc: 'Status asset' },
  ],
  admin: [
    { label: 'Kelola Pengguna', href: '/pengguna', icon: Users, color: 'bg-gradient-to-br from-[#3730A3] to-[#06B6D4]', desc: 'Tambah/Edit akun' },
    { label: 'Tambah Paket', href: '/proyek', icon: Plus, color: 'bg-gradient-to-br from-[#2E7D32] to-[#66BB6A]', desc: 'Daftarkan paket baru' },
    { label: 'Surat & Pengumuman', href: '/pengumuman', icon: Megaphone, color: 'bg-gradient-to-br from-[#FFB300] to-[#FF8A00]', desc: 'Informasi resmi' },
  ],
}
  const actions = quickActions[normalizedRole] || quickActions.pptk

  const getFocusRingFromColor = (color: string) => {
    if (!color) return 'focus:ring-blue-200'
    if (color.includes('#FF6A00') || color.includes('#FF8A00')) return 'focus:ring-orange-200'
    if (color.includes('#D32F2F') || color.includes('#E53935')) return 'focus:ring-red-200'
    if (color.includes('#2E7D32') || color.includes('#66BB6A')) return 'focus:ring-green-200'
    if (color.includes('#3730A3') || color.includes('#06B6D4')) return 'focus:ring-cyan-200'
    return 'focus:ring-blue-200'
  }

  const aiFindings = [
    `${visibleProjects.length} paket terbaca pada filter aktif. ${stats.kritis} kritis, ${stats.warning} warning, ${approvalPending} item approval menunggu.`,
    stats.kritis > 0
      ? 'Prioritas teknis: evaluasi deviasi, cek kendala lapangan, dan tutup approval yang menghambat progress.'
      : 'Kondisi umum terkendali. Tetap wajib input laporan harian agar tren deviasi terbaca lebih awal.',
    stats.laporanMenunggu > 0
      ? `${stats.laporanMenunggu} laporan belum disetujui. Data progress belum sepenuhnya sah untuk rekap pimpinan.`
      : 'Tidak ada laporan pending pada filter aktif.',
    'Pasang surut perlu dipantau pada jam puncak karena berpengaruh ke banjir rob, outfall drainase, pintu air, dan operasi pompa.',
  ]

  return (
    <>
      <Topbar
        title="Dashboard"
        subtitle={`${BRAND.tagline} - ${currentUser?.name?.split(' ')[0] || 'Pengguna'} - ${getRoleLabel(currentRole)}`}
      />
      <div className="space-y-5 p-4 sm:p-5 siaga-gemini-bg">
        <section className="relative overflow-hidden rounded-3xl border border-white/50 bg-white/60 p-4 text-slate-950 shadow-lg shadow-blue-200/10 backdrop-blur-md md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600">{BRAND.unit}</div>
              <h2 className="mt-1 text-2xl font-extrabold leading-tight md:text-3xl text-slate-950">{BRAND.name}</h2>
              <p className="mt-1 max-w-3xl text-sm text-slate-700">{BRAND.fullName} untuk monitoring proyek dan respons cepat SDA.</p>
            </div>
            <Link href="/peta" className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-cyan-200/70 bg-gradient-to-r from-cyan-100/80 to-blue-100/80 px-5 text-sm font-extrabold text-slate-950 shadow-md shadow-cyan-300/20 backdrop-blur-sm transition duration-300 hover:from-cyan-100 hover:to-blue-100 hover:shadow-lg hover:shadow-cyan-300/30 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-1">
              <MapPin className="h-4 w-4" />
              Buka Peta Monitoring
            </Link>
          </div>
        </section>

        <ProjectScopeFilters
          category={filterKategori}
          packageType={filterJenisProyek}
          workStage={filterTahap}
          budgetYear={filterTahun}
          budgetYears={budgetYears}
          program={filterProgram}
          programs={programs}
          subKegiatan={filterSubKegiatan}
          subKegiatanOptions={subKegiatanOptions}
          onCategoryChange={setFilterKategori}
          onPackageTypeChange={setFilterJenisProyek}
          onWorkStageChange={setFilterTahap}
          onBudgetYearChange={setFilterTahun}
          onProgramChange={setFilterProgram}
          onSubKegiatanChange={setFilterSubKegiatan}
          total={visibleProjects.length}
        />

        {activeFilterLabels.length > 0 && (
          <div className="rounded-2xl border border-slate-100 bg-white p-3 text-xs text-slate-600 shadow-sm">
            <div className="mb-2 font-black uppercase tracking-[0.18em] text-slate-400">Filter Aktif</div>
            <div className="flex flex-wrap gap-2">
              {activeFilterLabels.map((label) => (
                <span key={label} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-black text-slate-500">{label}</span>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-3xl border border-slate-100 bg-white p-3 shadow-sm">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            {DASHBOARD_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-[72px] rounded-3xl border px-3 py-3 text-left transition-all duration-300 ease-out ${activeTab === tab.id ? 'border-cyan-200 bg-gradient-to-br from-cyan-500/15 via-sky-100 to-white text-slate-950 shadow-[0_18px_40px_rgba(14,165,233,0.12)]' : 'border-white/70 bg-white/80 text-slate-700 hover:border-cyan-200 hover:bg-cyan-50/70 hover:shadow-[0_12px_28px_rgba(59,130,246,0.08)]'}`}
                aria-pressed={activeTab === tab.id}
              >
                <div className="text-sm font-black leading-tight">{tab.label}</div>
                <div className={`mt-1 text-[11px] ${activeTab === tab.id ? 'text-white/80' : 'text-slate-400'}`}>{tab.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {activeTab !== 'ringkasan' && (
          <button
            type="button"
            onClick={() => setActiveTab('ringkasan')}
            className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-[#0D2C54] shadow-sm transition hover:border-blue-200 hover:bg-blue-50"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Kembali ke Ringkasan Dashboard
          </button>
        )}

        <div className={`transition-all duration-200 ease-out ${activeTab === 'ringkasan' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'}`}>
          {activeTab === 'ringkasan' && (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <PrayerTimeWidget compact />
              <TideDashboardPanel compact />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: 'Total Paket Aktif', value: stats.total, icon: FolderOpen, href: '/proyek', tone: 'blue' },
                { label: 'Paket Deviasi/Kritis', value: stats.kritis, icon: XCircle, href: '/proyek', tone: 'red' },
                { label: 'Approval Pending', value: approvalPending, icon: ClipboardList, href: '/approval', tone: 'amber' },
                { label: 'Survey Belum Ditindaklanjuti', value: stats.surveyMenunggu, icon: FileText, href: '/survey', tone: 'violet' },
                { label: 'Surat Masuk Penting', value: 9, icon: MessageSquare, href: '/pengumuman', tone: 'blue' },
                { label: 'Asset SDA Aktif', value: 63, icon: Building2, href: '/peta', tone: 'green' },
              ].map((card) => {
                const Icon = card.icon
                return (
                  <Link
                    key={card.label}
                    href={card.href}
                    className={`group siaga-glass-card transform-gpu transition-transform transition-shadow duration-200 ease-out will-change-transform hover:scale-[1.02] hover:shadow-lg ${card.tone === 'blue' ? 'focus:ring-blue-200' : card.tone === 'red' ? 'focus:ring-red-200' : card.tone === 'amber' ? 'focus:ring-amber-200' : card.tone === 'green' ? 'focus:ring-green-200' : 'focus:ring-violet-200'} focus:outline-none focus:ring-2 focus:ring-offset-1 ${card.tone === 'blue' ? 'text-slate-900' : card.tone === 'red' ? 'text-red-700' : card.tone === 'amber' ? 'text-amber-700' : card.tone === 'green' ? 'text-emerald-700' : 'text-violet-700'}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold">{card.label}</div>
                        <div className="mt-3 text-3xl font-black">{card.value}</div>
                      </div>
                      {(() => {
                        const grad = card.tone === 'blue'
                          ? 'bg-gradient-to-br from-[#3730A3] to-[#06B6D4]'
                          : card.tone === 'red'
                          ? 'bg-gradient-to-br from-[#D32F2F] to-[#E53935]'
                          : card.tone === 'amber'
                          ? 'bg-gradient-to-br from-[#FFB300] to-[#FF8A00]'
                          : card.tone === 'green'
                          ? 'bg-gradient-to-br from-[#2E7D32] to-[#66BB6A]'
                          : 'bg-gradient-to-br from-[#7C3AED] to-[#A78BFA]'
                        return (
                          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${grad} text-white`}>
                            <Icon className="h-6 w-6" />
                          </div>
                        )
                      })()}
                    </div>
                  </Link>
                )
              })}
            </div>

            <div className="siaga-glass-card">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-extrabold text-slate-900">Akses Cepat</div>
                  <div className="text-xs text-slate-500">Menu penting sesuai peran Anda</div>
                </div>
                <div className="rounded-2xl bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-600">{roleLabel}</div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {actions.map((item) => {
                  const Icon = item.icon
                  return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`group rounded-3xl border border-slate-100 bg-slate-50 p-4 transition transform hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 ${getFocusRingFromColor(item.color)}`}
                  >
                    <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${item.color} text-white shadow-sm`}> 
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="mt-4 text-sm font-semibold text-slate-900">{item.label}</div>
                    <div className="mt-2 text-xs leading-5 text-slate-500">{item.desc}</div>
                  </Link>
                  )
                })}
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-3">
              <div className="siaga-glass-card">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">Warning Center</div>
                    <div className="text-xs text-slate-500">Peringatan SDA dan paket kritis</div>
                  </div>
                  <Link href="/peta" className="text-xs font-bold text-sky-600 hover:underline">Lihat Semua</Link>
                </div>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <Link href="/peta" className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3 hover:bg-slate-100">
                    <span>Pasang surut saat ini</span>
                    <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">WASPADA</span>
                  </Link>
                  <Link href="/peta" className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3 hover:bg-slate-100">
                    <span>{stats.warning + stats.kritis} titik peringatan</span>
                    <span className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-bold text-red-700">Kritis</span>
                  </Link>
                  <Link href="/proyek" className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3 hover:bg-slate-100">
                    <span>{stats.kritis} paket deviasi/kritis</span>
                    <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">Lihat Detail</span>
                  </Link>
                </div>
                <div className="mt-4 text-[10px] text-slate-400">Terakhir diperbarui: {formatDateTime(new Date().toISOString())}</div>
              </div>

              <div className="siaga-glass-card">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">Pasang Surut (Ringkasan)</div>
                    <div className="text-xs text-slate-500">Trend muka air saat ini</div>
                  </div>
                  <Link href="/peta" className="text-xs font-bold text-sky-600 hover:underline">Lihat Detail</Link>
                </div>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-3xl border border-white/60 bg-white/80 p-4 shadow-soft">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Status Saat Ini</div>
                    <div className="mt-2 text-xl font-black text-slate-900">WASPADA</div>
                    <div className="mt-2 text-xs text-slate-500">Tinggi Muka Air</div>
                    <div className="mt-2 text-3xl font-black text-slate-900">+1.42 m</div>
                    <div className="mt-1 text-xs text-slate-500">dari datum</div>
                  </div>
                  <div className="rounded-3xl border border-white/60 bg-white/80 p-4 shadow-soft">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Trend</div>
                    <div className="mt-2 flex items-center gap-2 text-2xl font-black text-slate-900">
                      <ArrowRight className="rotate-90 h-5 w-5 text-slate-900" />
                      TURUN
                    </div>
                    <div className="mt-1 text-xs text-slate-500">-0.03 m (1 jam)</div>
                    <div className="mt-3 text-xs text-slate-500">Perkiraan menuju siaga</div>
                    <div className="mt-1 text-lg font-black text-slate-900">02:35:24</div>
                  </div>
                  <div className="rounded-3xl border border-white/60 bg-white/80 p-4 shadow-soft">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Jadwal Hari Ini</div>
                    <div className="mt-4 space-y-3 text-sm text-slate-700">
                      <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2">
                        <div>
                          <div className="font-semibold text-slate-900">00:30</div>
                          <div className="text-[11px] text-slate-500">Surut minimum</div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-slate-900">+0.62 m</div>
                          <div className="text-[11px] text-slate-500">Aman</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2">
                        <div>
                          <div className="font-semibold text-slate-900">06:45</div>
                          <div className="text-[11px] text-slate-500">Pasang naik</div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-slate-900">+1.18 m</div>
                          <div className="text-[11px] text-amber-600">Waspada</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2">
                        <div>
                          <div className="font-semibold text-slate-900">12:00</div>
                          <div className="text-[11px] text-slate-500">Pasang maksimum</div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-slate-900">+1.36 m</div>
                          <div className="text-[11px] text-red-600">Siaga</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2">
                        <div>
                          <div className="font-semibold text-slate-900">18:20</div>
                          <div className="text-[11px] text-slate-500">Surut turun</div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-slate-900">+0.84 m</div>
                          <div className="text-[11px] text-slate-500">Aman</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-3xl border border-white/60 bg-white/80 p-4 shadow-soft">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Gelombang</div>
                    <div className="mt-4 overflow-hidden rounded-3xl bg-gradient-to-t from-cyan-200/30 to-white p-4">
                      <div className="siaga-wave h-24 w-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="siaga-glass-card">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">Peta Monitoring Ringkas</div>
                    <div className="text-xs text-slate-500">Titik sebaran dan status</div>
                  </div>
                  <Link href="/peta" className="text-xs font-bold text-sky-600 hover:underline">Lihat Semua</Link>
                </div>
                <div className="mt-4 overflow-hidden rounded-[26px] border border-white/60 bg-gradient-to-br from-cyan-100 via-slate-100 to-white p-3 shadow-soft">
                  <div className="relative h-36 overflow-hidden rounded-[22px] bg-gradient-to-br from-sky-100 via-cyan-50 to-white">
                    <div className="absolute left-5 top-6 h-3.5 w-3.5 rounded-full bg-cyan-500 shadow-[0_0_0_12px_rgba(56,189,248,0.18)] animate-pulse-marker" />
                    <div className="absolute left-24 top-14 h-3.5 w-3.5 rounded-full bg-amber-400 shadow-[0_0_0_12px_rgba(251,191,36,0.16)] animate-pulse-marker" />
                    <div className="absolute right-6 top-12 h-3.5 w-3.5 rounded-full bg-rose-400 shadow-[0_0_0_12px_rgba(244,63,94,0.18)] animate-pulse-marker" />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-cyan-200/40 to-transparent" />
                  </div>
                </div>
                <div className="mt-4 grid gap-2 text-[12px] text-slate-600">
                  <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-red-500"></span>2 Kritis</div>
                  <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-500"></span>1 Waspada</div>
                  <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-sky-500"></span>2 Aman</div>
                  <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-slate-400"></span>5 Perlu perhatian</div>
                </div>
                <div className="mt-3 rounded-3xl bg-white/80 p-3 text-sm text-slate-700 shadow-soft">
                  <div className="font-semibold text-slate-900">Lokasi Prioritas</div>
                  <div className="mt-3 grid gap-2">
                    <div className="rounded-2xl bg-slate-50 px-3 py-2">Sungai Dumai</div>
                    <div className="rounded-2xl bg-slate-50 px-3 py-2">Drainase Sudirman</div>
                    <div className="rounded-2xl bg-slate-50 px-3 py-2">Pintu Air Pelintung</div>
                  </div>
                </div>
                <Link href="/peta" className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-2xl border border-white/60 bg-white/90 text-sm font-extrabold text-slate-900 shadow-sm transition duration-300 hover:border-cyan-200 hover:bg-white hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-1">
                  Buka Peta Monitoring
                </Link>
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              <div className="siaga-glass-card">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">Aktivitas Terbaru</div>
                    <div className="text-xs text-slate-500">Update log penting</div>
                  </div>
                  <Link href="/audit-log" className="text-xs font-bold text-blue-600 hover:underline">Lihat Semua</Link>
                </div>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  {recentActivity.slice(0, 4).map((log) => (
                    <Link
                      key={log.id}
                      href="/audit-log"
                      className="block rounded-2xl border border-slate-100 bg-slate-50 p-3 hover:bg-slate-100"
                    >
                      <div className="font-semibold text-slate-900">{log.action}</div>
                      <div className="mt-1 text-[11px] text-slate-500">{log.detail}</div>
                      <div className="mt-1 text-[10px] text-slate-400">{formatDateTime(log.timestamp)}</div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="siaga-glass-card">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">Jelajah Modul</div>
                    <div className="text-xs text-slate-500">Navigasi cepat ke area utama</div>
                  </div>
                  <span className="rounded-2xl bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-600">Modul</span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    { label: 'Peta Monitoring', href: '/peta', icon: MapPin },
                    { label: 'Paket Pekerjaan', href: '/proyek', icon: FolderOpen },
                    { label: 'Survey Investigasi', href: '/survey', icon: FileText },
                    { label: 'Surat Masuk', href: '/pengumuman', icon: MessageSquare },
                    { label: 'Peil Banjir', href: '/peta', icon: Waves },
                    { label: 'Asset SDA', href: '/peta', icon: Building2 },
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="rounded-3xl border border-slate-200 bg-slate-50 p-3 text-center text-[11px] font-black text-slate-700 transition transform hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-200"
                      >
                        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-white transition group-hover:bg-gradient-to-br group-hover:from-[#3730A3] group-hover:to-[#06B6D4] group-hover:text-white">
                            <Icon className="h-5 w-5 text-slate-700 group-hover:text-white" />
                          </div>
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
        </div>

        {activeTab === 'pasang-surut' && (
          <TideDashboardPanel />
        )}

        {activeTab === 'survey' && (
          <SurveyInvestigationTab projects={visibleProjects} />
        )}

        <div className={`transition-all duration-300 ease-in-out ${activeTab === 'paket' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
          {activeTab === 'paket' && (
            <PackageWorkspaceTab projects={visibleProjects} stats={stats} />
          )}
        </div>

        {activeTab === 'surat' && (
          <ModulePreparationTab
            icon={FileText}
            title="Surat Masuk & Keluar"
            subtitle="Disposisi, undangan rapat, tindak lanjut surat, dan relasi ke survey/paket/peil."
            route="/pengumuman"
            routeLabel="Buka Surat & Pengumuman"
            cards={[
              { label: 'Surat Penting', value: '0', desc: 'Belum ada tabel surat resmi' },
              { label: 'Disposisi Pending', value: '0', desc: 'Menunggu workflow surat' },
              { label: 'Tindak Lanjut', value: '0', desc: 'Belum tersambung paket/survey' },
            ]}
            checklist={['Input surat masuk/keluar', 'Disposisi berbasis role', 'Relasi ke survey, paket, peil', 'Audit log surat dan approval']}
          />
        )}

        {activeTab === 'peil' && (
          <ModulePreparationTab
            icon={Landmark}
            title="Peil Banjir"
            subtitle="Ringkasan titik peil, elevasi banjir, status genangan, dan histori pengukuran."
            route="/peta"
            routeLabel="Buka Peta Monitoring"
            cards={[
              { label: 'Titik Peil Aktif', value: '0', desc: 'Belum ada tabel peil' },
              { label: 'Status Siaga', value: '0', desc: 'Menunggu threshold peil' },
              { label: 'Update Hari Ini', value: '0', desc: 'Belum ada observasi peil' },
            ]}
            checklist={['Master titik peil', 'Input tinggi muka air lapangan', 'Threshold aman/waspada/siaga/kritis', 'Approval dan audit peil']}
          />
        )}

        {activeTab === 'asset' && (
          <ModulePreparationTab
            icon={Building2}
            title="Asset SDA"
            subtitle="Inventaris pintu air, rumah pompa, pompa mobile, tanggul, drainase utama, dan kolam retensi."
            route="/peta"
            routeLabel="Buka Peta Monitoring"
            cards={[
              { label: 'Asset Aktif', value: '0', desc: 'Belum ada tabel asset' },
              { label: 'Asset Perlu Respon', value: '0', desc: 'Menunggu status operasional' },
              { label: 'Laporan Asset', value: '0', desc: 'Belum tersambung laporan operasi' },
            ]}
            checklist={['Peta asset SDA', 'Status operasi pintu air/rumah pompa', 'Riwayat pemeliharaan', 'Relasi asset ke warning dan operasional']}
          />
        )}

        {activeTab === 'operasional' && (
          <ModulePreparationTab
            icon={HardHat}
            title="Operasional SDA"
            subtitle="Operasi pintu air, rumah pompa, shift mandor, petugas, dan respon warning lapangan."
            route="/chat"
            routeLabel="Buka Chat Koordinasi"
            cards={[
              { label: 'Shift Aktif', value: '0', desc: 'Belum ada tabel shift' },
              { label: 'Laporan Operasi', value: '0', desc: 'Menunggu modul operasional' },
              { label: 'Respon Warning', value: '0', desc: 'Belum tersambung warning center' },
            ]}
            checklist={['Mandor memilih petugas dari master data', 'Laporan operasi pintu air/pompa', 'Chat operasional per asset', 'Respon pasang surut/banjir tercatat']}
          />
        )}

        {activeTab === 'warning' && (
          <WarningCenterTab stats={stats} approvalPending={approvalPending} riskProjects={riskProjects} />
        )}

        {activeTab === 'waktu' && (
          <div className="space-y-5">
            <PrayerTimeWidget />
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-slate-700">
              <div className="font-extrabold text-[#0D2C54]">Catatan operasional</div>
              <p className="mt-1">
                Pengingat salat memakai notifikasi browser. Pada HP, izinkan notifikasi dari browser agar alarm muncul.
                Jadwal akan mengambil data online saat tersedia dan memakai fallback lokal Dumai bila koneksi/API bermasalah.
              </p>
            </div>
          </div>
        )}

        <div className={`transition-all duration-300 ease-in-out ${activeTab === 'monitoring' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
          {activeTab === 'monitoring' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
              <div className="siaga-card p-5 lg:col-span-3">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-800">Progress Fisik vs Keuangan</div>
                    <div className="mt-0.5 text-xs text-slate-400">Paket pada filter aktif</div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barData} barSize={14} barGap={3}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: number) => [`${value}%`]} />
                    <Bar dataKey="fisik" radius={[3, 3, 0, 0]}>
                      {barData.map((item, index) => (
                        <Cell key={index} fill={item.health === 'kritis' ? '#E53935' : item.health === 'warning' ? '#FFB300' : '#1976D2'} />
                      ))}
                    </Bar>
                    <Bar dataKey="keuangan" fill="#43A047" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="siaga-card p-5 lg:col-span-2">
                <div className="mb-1 text-sm font-semibold text-slate-800">Status Paket</div>
                <div className="mb-3 text-xs text-slate-400">Distribusi health</div>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={170}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} dataKey="value" paddingAngle={3}>
                        {pieData.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
                      </Pie>
                      <Legend iconSize={10} iconType="circle" formatter={(value) => <span style={{ fontSize: 11 }}>{value}</span>} />
                      <Tooltip formatter={(value: number) => [`${value} paket`]} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-40 items-center justify-center text-sm text-slate-300">Tidak ada data</div>
                )}
                <div className="mt-2 space-y-2">
                  {[
                    { label: 'Avg Progress Fisik', value: stats.avgFisik, color: 'bg-[#1976D2]', text: 'text-blue-700' },
                    { label: 'Avg Progress Keuangan', value: stats.avgKeuangan, color: 'bg-[#43A047]', text: 'text-green-700' },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-slate-500">{item.label}</span>
                        <span className={`font-bold ${item.text}`}>{item.value.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <ProjectTable projects={visibleProjects} />
          </div>
          )}
        </div>

        {activeTab === 'approval' && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
            <div className="siaga-card p-5 lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-extrabold text-slate-900">Ringkasan Approval</div>
                  <div className="text-xs text-slate-500">Item pending dari data aktif</div>
                </div>
                <Link href="/approval" className="text-xs font-bold text-blue-700 hover:underline">Buka</Link>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Laporan', value: stats.laporanMenunggu },
                  { label: 'RAB', value: stats.rabMenunggu },
                  { label: 'Survey', value: stats.surveyMenunggu },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-slate-50 p-3 text-center">
                    <div className="text-2xl font-black text-[#0D2C54]">{item.value}</div>
                    <div className="text-xs text-slate-500">{item.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
                Approval pending harus ditutup agar data progress bisa dipakai sebagai dasar rekap dan audit.
              </div>
            </div>

            <div className="siaga-card p-5 lg:col-span-3">
              <div className="mb-4 text-sm font-extrabold text-slate-900">Paket Risiko Prioritas</div>
              {riskProjects.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">Tidak ada paket risiko pada filter aktif.</div>
              ) : (
                <div className="space-y-3">
                  {riskProjects.slice(0, 6).map((project) => {
                    const badge = getHealthBadge(project.health)
                    const openIssues = project.masalah.filter((item) => item.status === 'open').length
                    return (
                      <Link key={project.id} href={`/proyek/${project.id}?from=dashboard`} className="block rounded-xl border border-slate-100 p-3 hover:bg-slate-50">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-bold text-slate-900">{project.kode} - {project.nama}</div>
                            <div className="text-xs text-slate-500">Deviasi {project.deviasi}% - masalah open {openIssues}</div>
                          </div>
                          <span className={`w-fit rounded-full border px-2 py-0.5 text-[10px] font-bold ${badge.bg} ${badge.text} ${badge.border}`}>{badge.label}</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'aktivitas' && (
          <div className="siaga-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-800">Aktivitas Terbaru</div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-xs text-slate-400">Realtime</span>
              </div>
            </div>
            {recentActivity.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400">
                <Activity className="mx-auto mb-2 h-8 w-8 opacity-30" />
                Belum ada aktivitas
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 rounded-xl border border-slate-100 p-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                      <ClipboardList className="h-4 w-4 text-blue-700" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-slate-700">{log.action}</div>
                      <div className="truncate text-[11px] text-slate-400">{log.detail}</div>
                      <div className="mt-0.5 text-[10px] text-slate-300">{log.userName} - {formatDateTime(log.timestamp)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link href="/audit-log" className="mt-4 flex items-center justify-center gap-1.5 border-t border-slate-100 pt-3 text-xs font-medium text-blue-600 hover:text-blue-800">
              Lihat semua log <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="siaga-card p-5 lg:col-span-2">
              <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <Bot className="h-4 w-4 text-blue-700" />
                AI Analisis Dashboard
              </div>
              <div className="space-y-3">
                {aiFindings.map((item, index) => (
                  <div key={index} className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm leading-relaxed text-blue-950">{item}</div>
                ))}
              </div>
            </div>
            <div className="siaga-card p-5">
              <div className="mb-3 text-sm font-extrabold text-slate-900">Saran Tindakan</div>
              <div className="space-y-2 text-sm text-slate-700">
                <div>1. Tutup approval yang memengaruhi rekap progress.</div>
                <div>2. Prioritaskan paket dengan status kritis/warning.</div>
                <div>3. Pastikan survey, masalah, laporan, dan chat diinput lengkap agar analisis lintas tab akurat.</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function SurveyInvestigationTab({ projects }: { projects: ReturnType<typeof useAppStore.getState>['projects'] }) {
  const totalSurvey = projects.reduce((sum, project) => sum + project.surveys.length, 0)
  const submitted = projects.reduce((sum, project) => sum + project.surveys.filter((item) => item.status === 'submitted').length, 0)
  const approved = projects.reduce((sum, project) => sum + project.surveys.filter((item) => item.status === 'approved').length, 0)
  const withGps = projects.reduce((sum, project) => sum + project.surveys.filter((item) => item.koordinat).length, 0)
  const latest = projects.flatMap((project) => project.surveys.map((survey) => ({ ...survey, projectName: project.nama, projectCode: project.kode, projectId: project.id }))).slice(0, 6)

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
      <div className="siaga-card p-5 lg:col-span-2">
        <ModuleHeader icon={MapPin} title="Survey Investigasi" subtitle="Ringkasan laporan awal lapangan dan tindak lanjut." />
        <div className="mt-4 grid grid-cols-2 gap-3">
          <MiniMetric label="Total Survey" value={totalSurvey} href="/survey" />
          <MiniMetric label="Menunggu Review" value={submitted} tone="amber" href="/survey" />
          <MiniMetric label="Disetujui" value={approved} tone="green" href="/survey" />
          <MiniMetric label="Dengan GPS" value={withGps} tone="blue" href="/survey" />
        </div>
        <Link href="/survey" className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1976D2] to-[#0D47A1] px-4 text-sm font-extrabold text-white hover:from-[#13589e] hover:to-[#0A3B86] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-200">
          Buka Survey Investigasi <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="siaga-card p-5 lg:col-span-3">
        <div className="mb-3 text-sm font-extrabold text-slate-900">Survey Terbaru</div>
        {latest.length === 0 ? (
          <EmptyModuleState text="Belum ada survey pada filter aktif." />
        ) : (
          <div className="space-y-3">
            {latest.map((survey) => (
              <Link key={survey.id} href={`/proyek/${survey.projectId}?from=dashboard`} className="block rounded-xl border border-slate-100 p-3 transition hover:bg-slate-50">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-slate-900">{survey.projectCode} - {survey.projectName}</div>
                    <div className="text-xs text-slate-500">{survey.kondisiEksisting || survey.permasalahan || 'Survey lapangan'}</div>
                  </div>
                  <span className="w-fit rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-700">{survey.status}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function PackageWorkspaceTab({ projects, stats }: { projects: ReturnType<typeof useAppStore.getState>['projects']; stats: any }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniMetric label="Paket Aktif" value={stats.total} tone="blue" href="/proyek" />
        <MiniMetric label="On Track" value={stats.onTrack} tone="green" href="/proyek" />
        <MiniMetric label="Warning" value={stats.warning} tone="amber" href="/proyek" />
        <MiniMetric label="Kritis" value={stats.kritis} tone="red" href="/proyek" />
      </div>
      <ProjectTable projects={projects} />
    </div>
  )
}

function WarningCenterTab({ stats, approvalPending, riskProjects }: { stats: any; approvalPending: number; riskProjects: ReturnType<typeof useAppStore.getState>['projects'] }) {
  const warningItems = [
    { label: 'Paket Kritis', value: stats.kritis, desc: 'Perlu eskalasi teknis', tone: 'red', icon: XCircle, href: '/proyek' },
    { label: 'Paket Warning', value: stats.warning, desc: 'Pantau deviasi', tone: 'amber', icon: AlertTriangle, href: '/proyek' },
    { label: 'Approval Pending', value: approvalPending, desc: 'Menghambat rekap sah', tone: 'blue', icon: ClipboardList, href: '/approval' },
    { label: 'Masalah Open', value: stats.openMasalah, desc: 'Perlu tindak lanjut', tone: 'red', icon: ShieldAlert, href: '/masalah' },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
      <div className="siaga-card p-5 lg:col-span-2">
        <ModuleHeader icon={LifeBuoy} title="Warning Center" subtitle="Pusat ringkasan peringatan proyek dan SDA." />
        <div className="mt-4 space-y-3">
            {warningItems.map((item) => {
            const Icon = item.icon
            const ring = item.tone === 'red' ? 'focus:ring-red-200' : item.tone === 'amber' ? 'focus:ring-amber-200' : 'focus:ring-blue-200'
            return (
              <Link key={item.label} href={item.href} className={`flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-1 ${ring}`}>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.tone === 'red' ? 'bg-red-50 text-red-700' : item.tone === 'amber' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-slate-900">{item.label}</div>
                  <div className="text-xs text-slate-500">{item.desc}</div>
                </div>
                <div className="text-2xl font-black text-slate-900">{item.value}</div>
              </Link>
            )
          })}
        </div>
      </div>
      <div className="siaga-card p-5 lg:col-span-3">
        <div className="mb-3 text-sm font-extrabold text-slate-900">Prioritas Tindakan</div>
        {riskProjects.length === 0 ? (
          <EmptyModuleState text="Tidak ada paket warning/kritis pada filter aktif." />
        ) : (
          <div className="space-y-3">
            {riskProjects.slice(0, 6).map((project) => {
              const badge = getHealthBadge(project.health)
              return (
                <Link key={project.id} href={`/proyek/${project.id}?from=dashboard`} className="block rounded-xl border border-slate-100 p-3 hover:bg-slate-50">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-bold text-slate-900">{project.kode} - {project.nama}</div>
                      <div className="text-xs text-slate-500">Progress fisik {project.progressFisik}% - deviasi {project.deviasi}%</div>
                    </div>
                    <span className={`w-fit rounded-full border px-2 py-0.5 text-[10px] font-bold ${badge.bg} ${badge.text} ${badge.border}`}>{badge.label}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function ModulePreparationTab({
  icon: Icon,
  title,
  subtitle,
  route,
  routeLabel,
  cards,
  checklist,
}: {
  icon: any
  title: string
  subtitle: string
  route: string
  routeLabel: string
  cards: { label: string; value: string; desc: string }[]
  checklist: string[]
}) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
      <div className="siaga-card p-5 lg:col-span-3">
        <ModuleHeader icon={Icon} title={title} subtitle={subtitle} />
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {cards.map((card) => (
            <Link key={card.label} href={route} className="block rounded-xl bg-slate-50 p-4 transition hover:bg-blue-50">
              <div className="text-2xl font-black text-[#0D2C54]">{card.value}</div>
              <div className="mt-1 text-xs font-bold text-slate-700">{card.label}</div>
              <div className="mt-0.5 text-[11px] text-slate-400">{card.desc}</div>
            </Link>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-3 text-sm text-amber-900">
          Tab ini sudah disiapkan di dashboard sebagai UI tahap awal. Data resmi belum ditampilkan karena belum ada migration/database modul ini.
        </div>
        <Link href={route} className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3730A3] to-[#06B6D4] px-4 text-sm font-extrabold text-white hover:from-[#2b2f6b] hover:to-[#05a3c0] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-cyan-200">
          {routeLabel} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="siaga-card p-5 lg:col-span-2">
        <div className="mb-3 text-sm font-extrabold text-slate-900">Kebutuhan Tahap Database</div>
        <div className="space-y-2">
          {checklist.map((item) => (
            <div key={item} className="flex gap-2 rounded-xl border border-slate-100 p-3 text-sm text-slate-700">
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#43A047]" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ModuleHeader({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1976D2]">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-lg font-extrabold text-slate-900">{title}</div>
        <div className="mt-0.5 text-sm text-slate-500">{subtitle}</div>
      </div>
    </div>
  )
}

function MiniMetric({ label, value, tone = 'slate', href }: { label: string; value: number | string; tone?: 'slate' | 'blue' | 'green' | 'amber' | 'red'; href?: string }) {
  const toneClass = {
    slate: 'bg-slate-50 text-slate-900',
    blue: 'bg-blue-50 text-blue-800',
    green: 'bg-green-50 text-green-800',
    amber: 'bg-amber-50 text-amber-800',
    red: 'bg-red-50 text-red-800',
  }[tone]
  const content = (
    <>
      <div className="text-2xl font-black">{value}</div>
      <div className="mt-0.5 text-xs font-bold opacity-70">{label}</div>
    </>
  )

  if (href) {
    return (
      <Link href={href} className={`block rounded-xl p-3 transition hover:-translate-y-0.5 hover:shadow-sm ${toneClass}`}>
        {content}
      </Link>
    )
  }

  return (
    <div className={`rounded-xl p-3 ${toneClass}`}>
      {content}
    </div>
  )
}

function EmptyModuleState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">
      <Waves className="mx-auto mb-2 h-8 w-8 text-slate-300" />
      <div className="text-sm text-slate-400">{text}</div>
    </div>
  )
}

function ProjectTable({ projects }: { projects: ReturnType<typeof useAppStore.getState>['projects'] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
        <div className="text-sm font-semibold text-slate-800">Daftar Paket Pekerjaan</div>
        <Link href="/proyek" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
          Lihat Semua <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2.5 text-left font-semibold text-slate-500">Paket</th>
              <th className="px-3 py-2.5 text-left font-semibold text-slate-500">Kelompok</th>
              <th className="px-3 py-2.5 text-center font-semibold text-slate-500">Fisik</th>
              <th className="px-3 py-2.5 text-center font-semibold text-slate-500">Deviasi</th>
              <th className="px-3 py-2.5 text-left font-semibold text-slate-500">Health</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {projects.map((project) => {
              const badge = getHealthBadge(project.health)
              return (
                <tr key={project.id} className="transition-colors hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <Link href={`/proyek/${project.id}?from=dashboard`} className="block">
                      <div className="line-clamp-1 font-semibold text-slate-800 transition-colors hover:text-blue-600">{project.nama}</div>
                      <div className="mt-0.5 text-[10px] text-slate-400">{project.kode} - {project.kecamatan}</div>
                    </Link>
                  </td>
                  <td className="px-3 py-3">
                    <div className="text-[11px] font-bold text-blue-700">{getProjectCategoryLabel((project as any).kategoriPekerjaan)}</div>
                    <div className="text-[10px] text-slate-500">{getProjectPackageTypeLabel(getProjectPackageType(project))}</div>
                    <div className="text-[10px] text-slate-400">{getProjectWorkStageLabel(getProjectWorkStage(project))}</div>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <div className="font-bold text-blue-600">{project.progressFisik}%</div>
                    <div className="mx-auto mt-1 h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-blue-500" style={{ width: `${project.progressFisik}%` }} />
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className={`font-bold ${project.deviasi < -10 ? 'text-red-600' : project.deviasi < 0 ? 'text-amber-600' : 'text-green-600'}`}>
                      {project.deviasi > 0 ? '+' : ''}{project.deviasi}%
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <Link href={`/proyek/${project.id}?from=dashboard`} className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${badge.bg} ${badge.text} ${badge.border}`}>
                      {badge.label}
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
