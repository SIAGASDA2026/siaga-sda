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
  const role = currentUser?.role || 'pptk'
  const approvalPending = stats.laporanMenunggu + stats.rabMenunggu + stats.surveyMenunggu
  const riskProjects = visibleProjects
    .filter((project) => project.health === 'kritis' || project.health === 'warning' || project.masalah.some((item) => item.status === 'open'))
    .sort((a, b) => (b.health === 'kritis' ? 2 : b.health === 'warning' ? 1 : 0) - (a.health === 'kritis' ? 2 : a.health === 'warning' ? 1 : 0))

  const quickActions: Record<string, { label: string; href: string; icon: any; color: string; desc: string }[]> = {
    pptk: [
      { label: 'Input Laporan Harian', href: '/laporan', icon: FileText, color: 'bg-[#1976D2]', desc: 'Upload progress dan foto GPS' },
      { label: 'Laporkan Masalah', href: '/masalah', icon: AlertTriangle, color: 'bg-[#E53935]', desc: 'Catat kendala lapangan' },
      { label: 'Chat Proyek', href: '/chat', icon: MessageSquare, color: 'bg-[#00ACC1]', desc: 'Koordinasi tim' },
    ],
    ppk: [
      { label: 'Approval Center', href: '/approval', icon: CheckCircle, color: 'bg-[#43A047]', desc: `${approvalPending} item menunggu` },
      { label: 'Review Risiko', href: '/masalah', icon: ShieldAlert, color: 'bg-[#E53935]', desc: `${stats.openMasalah} masalah open` },
      { label: 'Audit Log', href: '/audit-log', icon: ClipboardList, color: 'bg-[#0D2C54]', desc: 'Rekam jejak aktivitas' },
    ],
    pimpinan: [
      { label: 'Buka Peta Monitoring', href: '/peta', icon: MapPin, color: 'bg-[#1976D2]', desc: 'Pantau sebaran paket' },
      { label: 'Proyek Kritis', href: '/proyek', icon: XCircle, color: 'bg-[#E53935]', desc: `${stats.kritis} paket kritis` },
      { label: 'Ringkasan Approval', href: '/approval', icon: ClipboardList, color: 'bg-[#0D2C54]', desc: `${approvalPending} item pending` },
    ],
    admin: [
      { label: 'Kelola Pengguna', href: '/pengguna', icon: Users, color: 'bg-[#1976D2]', desc: 'Tambah/edit akun' },
      { label: 'Tambah Paket', href: '/proyek', icon: Plus, color: 'bg-[#43A047]', desc: 'Daftarkan paket baru' },
      { label: 'Surat & Pengumuman', href: '/pengumuman', icon: Megaphone, color: 'bg-[#FFB300]', desc: 'Informasi resmi' },
    ],
  }

  const actions = quickActions[role] || quickActions.pptk

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
        subtitle={`${BRAND.tagline} - ${currentUser?.name?.split(' ')[0] || 'Pengguna'} - ${getRoleLabel(role)}`}
      />
      <div className="space-y-5 p-4 sm:p-5">
        <section className="siaga-command-band rounded-2xl p-4 text-white shadow-lg shadow-blue-950/10 md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-100">{BRAND.unit}</div>
              <h2 className="mt-1 text-2xl font-extrabold leading-tight md:text-3xl">{BRAND.name}</h2>
              <p className="mt-1 max-w-3xl text-sm text-blue-100">{BRAND.fullName} untuk monitoring proyek dan respons cepat SDA.</p>
            </div>
            <Link href="/peta" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-extrabold text-[#0D2C54] shadow-sm hover:bg-blue-50">
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

        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
          {/* Mobile: scroll horizontal */}
          <div className="flex gap-1.5 overflow-x-auto p-2 md:hidden" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
            {DASHBOARD_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 rounded-xl px-3 py-2 text-left transition ${activeTab === tab.id ? 'bg-[#0D2C54] text-white shadow-sm' : 'bg-slate-50 text-slate-600'}`}
                style={{ minWidth: 88 }}
              >
                <div className="text-xs font-extrabold leading-tight whitespace-nowrap">{tab.label}</div>
                <div className={`mt-0.5 text-[10px] leading-tight whitespace-nowrap ${activeTab === tab.id ? 'text-white/70' : 'text-slate-400'}`}>{tab.desc}</div>
              </button>
            ))}
          </div>
          {/* Desktop: grid */}
          <div className="hidden p-2 md:grid md:grid-cols-4 md:gap-1.5 lg:grid-cols-7">
            {DASHBOARD_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-[58px] rounded-xl px-3 py-2 text-left transition ${activeTab === tab.id ? 'bg-[#0D2C54] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <div className="text-xs font-extrabold leading-tight">{tab.label}</div>
                <div className={`mt-0.5 text-[10px] leading-tight ${activeTab === tab.id ? 'text-white/70' : 'text-slate-400'}`}>{tab.desc}</div>
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

        {activeTab === 'ringkasan' && (
          <div className="space-y-5">
            <PrayerTimeWidget compact />
            <TideDashboardPanel compact />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {actions.map((action) => {
                const Icon = action.icon
                return (
                  <Link key={action.href + action.label} href={action.href}>
                    <div className={`${action.color} min-w-0 rounded-2xl p-4 transition-opacity hover:opacity-90`}>
                      <div className="mb-2 flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/20">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="text-sm font-extrabold leading-tight text-white">{action.label}</div>
                      </div>
                      <div className="text-xs text-white/75">{action.desc}</div>
                    </div>
                  </Link>
                )
              })}
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: 'Total Paket', val: stats.total, icon: FolderOpen, color: 'bg-blue-50 text-blue-700', trend: null, sub: 'Filter aktif', href: '/proyek' },
                { label: 'On Track', val: stats.onTrack, icon: CheckCircle, color: 'bg-green-50 text-green-700', trend: 'up', sub: `${((stats.onTrack / Math.max(stats.total, 1)) * 100).toFixed(0)}% dari total`, href: '/proyek' },
                { label: 'Warning', val: stats.warning, icon: AlertTriangle, color: 'bg-amber-50 text-amber-700', trend: null, sub: 'Perlu perhatian', href: '/proyek' },
                { label: 'Kritis', val: stats.kritis, icon: XCircle, color: 'bg-red-50 text-red-700', trend: 'down', sub: 'Butuh tindakan', href: '/proyek' },
              ].map((card) => {
                const Icon = card.icon
                return (
                  <Link key={card.label} href={card.href} className="siaga-card block p-4 transition hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-md">
                    <div className="mb-3 flex items-start justify-between">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      {card.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                      {card.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                    </div>
                    <div className="text-3xl font-bold text-slate-800">{card.val}</div>
                    <div className="mt-0.5 text-xs font-medium text-slate-600">{card.label}</div>
                    <div className="mt-0.5 text-xs text-slate-400">{card.sub}</div>
                  </Link>
                )
              })}
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: 'Total Anggaran', val: formatCurrency(stats.totalAnggaran), icon: BarChart2, bg: 'bg-slate-50', tone: 'text-slate-700', href: '/proyek' },
                { label: 'Masalah Open', val: stats.openMasalah, icon: AlertTriangle, bg: stats.openMasalah > 0 ? 'bg-red-50' : 'bg-green-50', tone: stats.openMasalah > 0 ? 'text-red-700' : 'text-green-700', href: '/masalah' },
                { label: 'Approval Pending', val: approvalPending, icon: ClipboardList, bg: approvalPending > 0 ? 'bg-amber-50' : 'bg-green-50', tone: approvalPending > 0 ? 'text-amber-700' : 'text-green-700', href: '/approval' },
                { label: 'Paket Selesai', val: stats.selesai, icon: CheckCircle, bg: 'bg-blue-50', tone: 'text-blue-700', href: '/proyek' },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.label} href={item.href} className={`${item.bg} block rounded-2xl border border-slate-100 p-4 transition hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-md`}>
                    <Icon className={`mb-2 h-5 w-5 ${item.tone}`} />
                    <div className="break-words text-xl font-bold text-slate-800">{item.val}</div>
                    <div className="mt-0.5 text-xs text-slate-500">{item.label}</div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'pasang-surut' && (
          <TideDashboardPanel />
        )}

        {activeTab === 'survey' && (
          <SurveyInvestigationTab projects={visibleProjects} />
        )}

        {activeTab === 'paket' && (
          <PackageWorkspaceTab projects={visibleProjects} stats={stats} />
        )}

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
        <Link href="/survey" className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#1976D2] px-4 text-sm font-extrabold text-white hover:bg-[#0D2C54]">
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
            return (
              <Link key={item.label} href={item.href} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:bg-slate-50">
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
        <Link href={route} className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0D2C54] px-4 text-sm font-extrabold text-white hover:bg-[#1976D2]">
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
