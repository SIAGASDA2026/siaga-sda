'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Activity, AlertTriangle, ArrowRight, BarChart2, Bot, Building2, Camera, CalendarDays, CheckCircle, Clock, ClipboardList, Eye, FileText, FolderOpen, HardHat, Landmark, LifeBuoy, MapPin, Megaphone, MessageSquare, Menu, Plus, ShieldAlert, TrendingDown, TrendingUp, Users, Waves, XCircle, LucideIcon } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { Topbar } from '@/components/layout/Topbar'
import { ProjectScopeFilters } from '@/components/project/ProjectScopeFilters'
import { DashboardRoleHeader } from '@/components/dashboard/DashboardRoleHeader'
import { CommandCenterOverview } from '@/components/dashboard/CommandCenterOverview'
import { TaskCenterPanel } from '@/components/dashboard/TaskCenterPanel'
import { useApprovalSummary } from '@/components/approval/ApprovalSummaryProvider'
import { PrayerTimeWidget } from '@/components/dashboard/PrayerTimeWidget'
import { TideDashboardPanel } from '@/components/dashboard/TideDashboardPanel'
import { BRAND } from '@/lib/brand'
import { canAccessPage, canViewAllProjects } from '@/lib/rbac'
import { getScopedProjects } from '@/lib/dashboard-scope'
import type { TaskCenterIdentity } from '@/lib/task-center-ui'
import { filterProjectsByScope, getProjectBudgetYear, getProjectBudgetYears, getProjectCategoryLabel, getProjectPackageType, getProjectPackageTypeLabel, getProjectPrograms, getProjectSubKegiatan, getProjectWorkStage, getProjectWorkStageLabel } from '@/lib/reporting'
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

const DASHBOARD_TABS: { id: DashboardTab; label: string; desc: string; icon: LucideIcon }[] = [
  { id: 'ringkasan', label: 'Ringkasan', desc: 'KPI utama', icon: BarChart2 },
  { id: 'monitoring', label: 'Monitoring', desc: 'Progress dan paket', icon: MapPin },
  { id: 'survey', label: 'Survey', desc: 'Investigasi lapangan', icon: Camera },
  { id: 'paket', label: 'Paket', desc: 'Ruang kerja paket', icon: HardHat },
  { id: 'approval', label: 'Approval & Risiko', desc: 'Pending dan kritis', icon: ClipboardList },
  { id: 'surat', label: 'Surat', desc: 'Masuk dan keluar', icon: MessageSquare },
  { id: 'peil', label: 'Peil Banjir', desc: 'Titik peil', icon: Landmark },
  { id: 'asset', label: 'Asset SDA', desc: 'Pintu air/pompa', icon: Building2 },
  { id: 'operasional', label: 'Operasional', desc: 'Mandor dan shift', icon: Users },
  { id: 'pasang-surut', label: 'Pasang Surut', desc: 'Rob dan muka air', icon: Waves },
  { id: 'warning', label: 'Warning Center', desc: 'Peringatan SDA', icon: AlertTriangle },
  { id: 'waktu', label: 'Waktu & Salat', desc: 'Jam dan pengingat', icon: Clock },
  { id: 'aktivitas', label: 'Aktivitas', desc: 'Audit terbaru', icon: Activity },
  { id: 'ai', label: 'Insight Lokal', desc: 'Rule-based, bukan resmi', icon: Bot },
]

const DASHBOARD_TAB_ACCESS_PATH: Partial<Record<DashboardTab, string>> = {
  monitoring: '/peta',
  survey: '/survey',
  paket: '/proyek',
  approval: '/approval',
  surat: '/surat',
  peil: '/peil',
  asset: '/asset',
  operasional: '/asset',
  'pasang-surut': '/peta',
  warning: '/masalah',
  aktivitas: '/audit-log',
  ai: '/audit-log',
}

export default function DashboardPage() {
  const projects = useAppStore((state) => state.projects)
  const currentUser = useAppStore((state) => state.currentUser)
  const auditLogs = useAppStore((state) => state.auditLogs)
  const dashboardDataSource = useAppStore((state) => state.dashboardDataSource)
  const { summary: approvalSummary } = useApprovalSummary()
  const [activeTab, setActiveTab] = useState<DashboardTab>('ringkasan')
  const [filterKategori, setFilterKategori] = useState('all')
  const [filterJenisProyek, setFilterJenisProyek] = useState('all')
  const [filterTahap, setFilterTahap] = useState('all')
  const [filterTahun, setFilterTahun] = useState('all')
  const [filterProgram, setFilterProgram] = useState('all')
  const [filterSubKegiatan, setFilterSubKegiatan] = useState('all')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [showDetailedSummary, setShowDetailedSummary] = useState(false)

  const currentRole = currentUser?.role || 'pptk'
  const normalizedRole = currentRole.toLowerCase()
  const scopedProjects = useMemo(() => getScopedProjects(projects, currentUser), [currentUser, projects])
  const availableTabs = useMemo(
    () => DASHBOARD_TABS.filter((tab) => {
      const accessPath = DASHBOARD_TAB_ACCESS_PATH[tab.id]
      return accessPath ? canAccessPage(currentRole, accessPath) : true
    }),
    [currentRole],
  )

  useEffect(() => {
    if (!availableTabs.some((tab) => tab.id === activeTab)) {
      setActiveTab('ringkasan')
    }
  }, [activeTab, availableTabs])

  const budgetYears = useMemo(() => getProjectBudgetYears(scopedProjects), [scopedProjects])
  const programs = useMemo(() => getProjectPrograms(scopedProjects), [scopedProjects])
  const subKegiatanOptions = useMemo(() => getProjectSubKegiatan(scopedProjects), [scopedProjects])
  const visibleProjects = useMemo(
    () => filterProjectsByScope(scopedProjects, filterKategori, filterJenisProyek, filterTahap, filterTahun, filterProgram, filterSubKegiatan),
    [scopedProjects, filterKategori, filterJenisProyek, filterTahap, filterTahun, filterProgram, filterSubKegiatan],
  )

  const activeFilterLabels = [
    filterKategori !== 'all' ? `Metode: ${getProjectCategoryLabel(filterKategori)}` : null,
    filterJenisProyek !== 'all' ? `Jenis: ${getProjectPackageTypeLabel(filterJenisProyek)}` : null,
    filterTahap !== 'all' ? `Tahap: ${getProjectWorkStageLabel(filterTahap)}` : null,
    filterTahun !== 'all' ? `Tahun: ${filterTahun}` : null,
    filterProgram !== 'all' ? `Program: ${filterProgram}` : null,
    filterSubKegiatan !== 'all' ? `Sub Kegiatan: ${filterSubKegiatan}` : null,
  ].filter(Boolean)

  const hasFilterActive = activeFilterLabels.length > 0
  const compactFilterSummary = hasFilterActive
    ? `${visibleProjects.length} paket difilter` 
    : 'Menampilkan semua data tahun aktif'
  const compactFilterValues = {
    tahun: filterTahun !== 'all' ? filterTahun : 'Semua',
    jenis: filterJenisProyek !== 'all' ? getProjectPackageTypeLabel(filterJenisProyek) : 'Semua',
    metode: filterKategori !== 'all' ? getProjectCategoryLabel(filterKategori) : 'Semua',
    tahap: filterTahap !== 'all' ? getProjectWorkStageLabel(filterTahap) : 'Semua',
  }

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

  const recentActivity = useMemo(() => {
    if (!currentUser || canViewAllProjects(currentRole)) return auditLogs.slice(0, 7)

    const scopedProjectIds = new Set(scopedProjects.map((project) => project.id))
    return auditLogs
      .filter((log) => log.userId === currentUser.id || Boolean(log.entityId && scopedProjectIds.has(log.entityId)))
      .slice(0, 7)
  }, [auditLogs, currentRole, currentUser, scopedProjects])
  const approvalPending = approvalSummary.pending
  const riskProjects = visibleProjects
    .filter((project) => project.health === 'kritis' || project.health === 'warning' || project.masalah.some((item) => item.status === 'open'))
    .sort((a, b) => (b.health === 'kritis' ? 2 : b.health === 'warning' ? 1 : 0) - (a.health === 'kritis' ? 2 : a.health === 'warning' ? 1 : 0))

  const activeYear = useMemo(() => {
    if (filterTahun !== 'all' && !Number.isNaN(Number(filterTahun))) {
      return Number(filterTahun)
    }
    return budgetYears.length ? budgetYears[0] : new Date().getFullYear()
  }, [filterTahun, budgetYears])

  const previousYear = activeYear - 1

  const previousYearProjects = useMemo(
    () => scopedProjects.filter((project) => getProjectBudgetYear(project) === previousYear),
    [scopedProjects, previousYear],
  )

  const previousYearStats = useMemo(() => {
    const total = previousYearProjects.length
    const selesai = previousYearProjects.filter((project) => project.status === 'selesai').length
    const stuck = previousYearProjects.filter(
      (project) =>
        project.health === 'kritis' ||
        project.health === 'warning' ||
        project.masalah.some((item) => item.status === 'open'),
    ).length
    const avgFisik = total
      ? previousYearProjects.reduce((sum, project) => sum + (project.progressFisik || 0), 0) / total
      : 0
    return { total, selesai, stuck, avgFisik }
  }, [previousYearProjects])

  const statusSda = useMemo(() => {
    if (stats.kritis > 0 || stats.warning > 0 || stats.openMasalah > 0) return 'WASPADA'
    return 'STABIL'
  }, [stats.kritis, stats.warning, stats.openMasalah])

  const mainCauses = useMemo(() => {
    const causes: string[] = []
    if (approvalPending > 0) causes.push('Masih terdapat approval pending yang menghambat pengesahan data.')
    if (stats.kritis + stats.warning > 0) causes.push('Terdapat paket stuck/kritis yang perlu tindak lanjut.')
    if (stats.openMasalah > 0) causes.push('Masalah lapangan belum seluruhnya ditutup.')
    if (stats.avgFisik < 60) causes.push('Progres fisik perlu evaluasi.')
    if (statusSda !== 'STABIL') causes.push('Kondisi air perlu dipantau pada jam puncak.')
    return causes.length ? causes : ['Kondisi umum terlihat stabil, tetap awasi approval dan progress harian.']
  }, [approvalPending, stats.kritis, stats.warning, stats.openMasalah, stats.avgFisik, statusSda])

  const currentUserName = currentUser?.name?.trim() || 'Nama user belum tersedia'
  const taskCenterIdentity: TaskCenterIdentity = {
    kind: ['kontraktor', 'konsultan_perencana', 'konsultan_pengawasan'].includes(currentRole) ? 'external' : 'internal',
    name: currentUser?.name || 'Nama User',
    nip: currentUser?.nip,
    roleLabel: getRoleLabel(currentRole),
    unit: currentUser?.jabatan || 'Bidang SDA',
    companyName: 'Nama Perusahaan',
    position: currentUser?.jabatan || 'Posisi',
  }
  const currentDate = new Date()
  const currentDateLabel = currentDate.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const currentTimeLabel = currentDate.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  const tideOverview = useMemo(
    () => ({
      currentLevel: '+1.36 m',
      status: 'WASPADA',
      trend: 'Air Naik',
      peakTime: '23:18 WIB',
      updateLabel: 'Update terakhir',
      weeklyHighest: {
        date: 'Jumat, 14 Juni 2025',
        time: '23:40 WIB',
        height: '+1.58 m',
        status: 'Siaga',
        note: 'Data simulasi sementara — menunggu integrasi API pasang surut resmi.',
      },
      monthlyHighest: {
        date: 'Selasa, 24 Juni 2025',
        time: '00:15 WIB',
        height: '+1.72 m',
        status: 'Siaga Tinggi',
        note: 'Data simulasi sementara — menunggu integrasi API pasang surut resmi.',
      },
      note: 'Petugas disarankan memeriksa pintu air, pompa, outfall drainase, dan titik rawan rob sebelum jam puncak pasang tertinggi.',
    }),
    [],
  )
  const tideScheduleRows = [
    { time: '00:30', condition: 'Surut Minimum', height: '+0.62 m', status: 'Aman' },
    { time: '06:45', condition: 'Pasang Naik', height: '+1.18 m', status: 'Waspada' },
    { time: '12:00', condition: 'Pasang Maksimum', height: '+1.36 m', status: 'Siaga' },
    { time: '18:20', condition: 'Surut Turun', height: '+0.84 m', status: 'Aman' },
  ]
  const broadRoleView = ['super_admin', 'admin', 'kabid', 'pimpinan'].includes(normalizedRole)
  const currentUserAction = {
    ppk: { label: 'PPK', task: 'Review approval pending dan evaluasi paket kritis', module: '/approval', priority: 'Tinggi' },
    pptk: { label: 'PPTK', task: 'Update progres dan tindak lanjut paket stuck', module: '/laporan', priority: 'Tinggi' },
    admin_sub_kegiatan: { label: 'Admin Sub Kegiatan', task: 'Lengkapi data paket, kontrak, dan dokumen', module: '/proyek', priority: 'Sedang' },
    konsultan_pengawas: { label: 'Konsultan Pengawas', task: 'Cek deviasi dan catatan lapangan', module: '/peta', priority: 'Sedang' },
    konsultan_perencana: { label: 'Konsultan Perencana', task: 'Lengkapi dokumen perencanaan/survey', module: '/survey', priority: 'Sedang' },
    kontraktor: { label: 'Kontraktor', task: 'Update laporan harian dan dokumentasi', module: '/laporan', priority: 'Sedang' },
  }[normalizedRole] || { label: getRoleLabel(currentRole), task: 'Tindak lanjut sesuai peran Anda', module: '/peta', priority: 'Sedang' }

  const roleActions = useMemo(() => {
    const actionDefinitions = [
      { role: 'PPK', task: 'Review approval pending dan evaluasi paket kritis', module: '/approval', priority: 'Tinggi' },
      { role: 'PPTK', task: 'Update progres dan tindak lanjut paket stuck', module: '/laporan', priority: 'Tinggi' },
      { role: 'Admin Sub Kegiatan', task: 'Lengkapi data paket, kontrak, dan dokumen', module: '/proyek', priority: 'Sedang' },
      { role: 'Konsultan Pengawas', task: 'Cek deviasi dan catatan lapangan', module: '/peta', priority: 'Sedang' },
      { role: 'Konsultan Perencana', task: 'Lengkapi dokumen perencanaan/survey', module: '/survey', priority: 'Sedang' },
      { role: 'Kontraktor', task: 'Update laporan harian dan dokumentasi', module: '/laporan', priority: 'Sedang' },
      { role: 'Mandor/Petugas', task: 'Update kondisi lapangan, pintu air, pompa, pasang surut', module: '/peta', priority: 'Tinggi' },
      { role: 'Admin Surat/Peil/Asset', task: 'Lengkapi data modul masing-masing', module: '/pengumuman', priority: 'Sedang' },
    ]
    if (broadRoleView) {
      return actionDefinitions.map((item) => ({ ...item, name: currentUserName }))
    }
    return [{ role: currentUserAction.label, task: currentUserAction.task, module: currentUserAction.module, priority: currentUserAction.priority, name: currentUserName }]
  }, [broadRoleView, currentUserAction, currentUserName])

  const router = useRouter()

  const subKegiatanSummaries = useMemo(() => {
    const groups: Record<
      string,
      {
        subKegiatan: string
        totalPagu: number
        totalKontrak: number
        serapan: number
        paketCount: number
        paketProgres: number
        paketSelesai: number
        paketStuck: number
        sumFisik: number
        sumKeuangan: number
        openIssues: number
        fallbackKontrakCount: number
      }
    > = {}

    visibleProjects.forEach((project) => {
      const subKegiatan = String(project.subKegiatan || 'Lainnya').trim() || 'Lainnya'
      const anggaran = Number(project.anggaran || 0)
      const nilaiKontrak = Number(project.nilaiKontrak ?? anggaran)
      const progressFisik = Number(project.progressFisik || 0)
      const progressKeuangan = Number(project.progressKeuangan || 0)
      const openIssues = Array.isArray(project.masalah)
        ? project.masalah.filter((item) => item.status === 'open').length
        : 0
      const stuck = project.health === 'kritis' || project.health === 'warning' || openIssues > 0

      if (!groups[subKegiatan]) {
        groups[subKegiatan] = {
          subKegiatan,
          totalPagu: 0,
          totalKontrak: 0,
          serapan: 0,
          paketCount: 0,
          paketProgres: 0,
          paketSelesai: 0,
          paketStuck: 0,
          sumFisik: 0,
          sumKeuangan: 0,
          openIssues: 0,
          fallbackKontrakCount: 0,
        }
      }

      groups[subKegiatan].totalPagu += anggaran
      groups[subKegiatan].totalKontrak += nilaiKontrak
      groups[subKegiatan].serapan += anggaran * progressKeuangan / 100
      groups[subKegiatan].paketCount += 1
      groups[subKegiatan].paketProgres += project.status !== 'selesai' ? 1 : 0
      groups[subKegiatan].paketSelesai += project.status === 'selesai' ? 1 : 0
      groups[subKegiatan].paketStuck += stuck ? 1 : 0
      groups[subKegiatan].sumFisik += progressFisik
      groups[subKegiatan].sumKeuangan += progressKeuangan
      groups[subKegiatan].openIssues += openIssues
      groups[subKegiatan].fallbackKontrakCount += project.nilaiKontrak == null ? 1 : 0
    })

    return Object.values(groups)
      .map((group) => {
        const avgFisik = group.paketCount ? group.sumFisik / group.paketCount : 0
        const avgKeuangan = group.paketCount ? group.sumKeuangan / group.paketCount : 0
        const deviasiFisikKeuangan = avgFisik - avgKeuangan
        const persenSerapan = group.totalPagu > 0 ? (group.serapan / group.totalPagu) * 100 : 0
        const isKritis = group.paketStuck > 0 || group.openIssues > 2 || deviasiFisikKeuangan > 20
        const statusSerapan = isKritis
          ? 'Kritis'
          : avgFisik - avgKeuangan > 10
          ? 'Perlu Percepatan'
          : avgFisik < 40 && avgKeuangan < 40
          ? 'Perlu Evaluasi'
          : 'Aman'

        const penyebab: string[] = []
        if (avgFisik - avgKeuangan > 10) {
          penyebab.push('Serapan keuangan tertinggal dari progres fisik. Kemungkinan administrasi pembayaran/opname belum mengikuti progres lapangan.')
        }
        if (avgFisik < 40 && avgKeuangan < 40) {
          penyebab.push('Progres pekerjaan dan serapan masih rendah. Perlu evaluasi paket berjalan.')
        }
        if (group.paketStuck > 0) {
          penyebab.push('Terdapat paket stuck/kritis yang menghambat capaian sub kegiatan.')
        }
        if (approvalPending > 0) {
          penyebab.push('Masih terdapat approval pending yang dapat menghambat pengesahan data.')
        }
        if (!penyebab.length) {
          penyebab.push('Serapan masih berjalan normal, monitor approval dan realisasi keuangan secara bersamaan.')
        }

        const solusi = [
          'Percepat review approval pending.',
          'Evaluasi paket stuck/kritis.',
          'Lengkapi dokumen kontrak, laporan, dan opname.',
          'Sinkronkan progres fisik dengan progres keuangan.',
          'Lakukan rapat evaluasi sub kegiatan prioritas.',
        ]

        const tindakan = broadRoleView
          ? [
              'PPK: review approval, deviasi, dan paket kritis.',
              'PPTK: cek progres paket stuck dan validasi laporan.',
              'Admin Sub Kegiatan: lengkapi pagu, kontrak, dokumen, dan klasifikasi paket.',
              'Konsultan Pengawas: validasi progres lapangan dan catatan deviasi.',
              'Kontraktor/Mandor: update laporan dan dokumentasi lapangan.',
            ]
          : [`${currentUserName}: ${currentUserAction.task}`]

        return {
          ...group,
          avgFisik: Math.round(avgFisik),
          avgKeuangan: Math.round(avgKeuangan),
          deviasiFisikKeuangan: Math.round(deviasiFisikKeuangan),
          persenSerapan: Math.round(persenSerapan),
          statusSerapan,
          penyebab,
          solusi,
          tindakan,
          usesContractFallback: group.fallbackKontrakCount > 0,
          estimationLabel: 'Estimasi berbasis progres keuangan',
          rowLink: `/proyek?subKegiatan=${encodeURIComponent(group.subKegiatan)}`,
        }
      })
      .sort((a, b) => {
        const rank = { Kritis: 0, 'Perlu Percepatan': 1, 'Perlu Evaluasi': 2, Aman: 3 }
        const diff = rank[a.statusSerapan] - rank[b.statusSerapan]
        if (diff !== 0) return diff
        if (b.serapan !== a.serapan) return b.serapan - a.serapan
        if (b.paketCount !== a.paketCount) return b.paketCount - a.paketCount
        return b.totalPagu - a.totalPagu
      })
      .slice(0, 5)
  }, [visibleProjects, broadRoleView, currentUserAction.task, currentUserName, approvalPending])

  const lastAuditUpdate = auditLogs[0]?.timestamp || null
  const lastAuditLabel = lastAuditUpdate ? formatDateTime(new Date(lastAuditUpdate).toISOString()) : 'Belum ada pembaruan audit'

  const comparisonRows = useMemo(
    () => [
      { label: 'Total paket', current: stats.total, previous: previousYearStats.total },
      { label: 'Paket selesai', current: stats.selesai, previous: previousYearStats.selesai },
      { label: 'Paket stuck', current: stats.kritis + stats.warning, previous: previousYearStats.stuck },
      { label: 'Rata-rata progres fisik', current: Math.round(stats.avgFisik), previous: Math.round(previousYearStats.avgFisik) },
    ],
    [previousYearStats, stats.avgFisik, stats.kritis, stats.selesai, stats.total, stats.warning],
  )

  const hasPreviousYearStats = previousYearProjects.length > 0

  const commandBriefItems = [
    { label: 'Total Paket', value: stats.total, icon: FolderOpen, tone: 'blue', accessPath: '/proyek' },
    { label: 'Progres', value: stats.onTrack, icon: TrendingUp, tone: 'emerald', accessPath: '/proyek' },
    { label: 'Selesai', value: stats.selesai, icon: CheckCircle, tone: 'slate', accessPath: '/proyek' },
    { label: 'Stuck / Kritis', value: stats.kritis + stats.warning, icon: XCircle, tone: 'red', accessPath: '/proyek' },
    { label: 'Approval Pending', value: approvalPending, icon: ClipboardList, tone: 'amber', accessPath: '/approval' },
    { label: 'Survey Belum Ditindaklanjuti', value: stats.surveyMenunggu, icon: FileText, tone: 'violet', accessPath: '/survey' },
    { label: 'Masalah Open', value: stats.openMasalah, icon: AlertTriangle, tone: 'rose', accessPath: '/masalah' },
    { label: 'Titik Kritis', value: riskProjects.length, icon: LifeBuoy, tone: 'orange', accessPath: '/peta' },
  ].filter((item) => canAccessPage(currentRole, item.accessPath))

  const alertItems = [
    { label: 'Paket Kritis', value: stats.kritis, icon: AlertTriangle, href: `/proyek?tahun=${activeYear}&health=kritis&source_module=dashboard`, badge: 'Kritis', badgeClass: 'bg-rose-50 text-rose-700' },
    { label: 'Approval Pending', value: approvalPending, icon: ClipboardList, href: '/approval?approval_status=pending&source_module=dashboard', badge: 'Pending', badgeClass: 'bg-amber-50 text-amber-700' },
    { label: 'Survey Belum Ditindaklanjuti', value: stats.surveyMenunggu, icon: FileText, href: `/survey?tahun=${activeYear}&status=belum-ditindaklanjuti&source_module=dashboard`, badge: 'Survei', badgeClass: 'bg-violet-50 text-violet-700' },
    { label: 'Laporan Harian Belum Masuk', value: stats.laporanMenunggu, icon: FileText, href: `/laporan`, badge: 'Laporan', badgeClass: 'bg-sky-50 text-sky-700' },
    { label: 'Status Pasang Surut (Simulasi)', value: tideOverview.status, icon: Waves, href: '/peta', badge: tideOverview.status, badgeClass: 'bg-amber-50 text-amber-700' },
    { label: 'Masalah Open', value: stats.openMasalah, icon: AlertTriangle, href: `/masalah?status=open&source_module=dashboard`, badge: 'Open', badgeClass: 'bg-slate-50 text-slate-700' },
  ].filter((item) => canAccessPage(currentRole, item.href.split('?')[0]))

  const packageTypeSummary = useMemo(() => {
    const counts: Record<string, { label: string; count: number }> = {}
    visibleProjects.forEach((project) => {
      const type = getProjectPackageType(project)
      const label = getProjectPackageTypeLabel(type).replace('Paket ', '')
      if (!counts[label]) counts[label] = { label, count: 0 }
      counts[label].count += 1
    })
    return Object.values(counts)
  }, [visibleProjects])

  const recentActivityItems = recentActivity.slice(0, 3)

  const subKegiatanBudget = useMemo(() => {
    const totals = visibleProjects.reduce<Record<string, { amount: number; count: number }>>((acc, project) => {
      const name = String(project.subKegiatan || 'Lainnya').trim() || 'Lainnya'
      if (!acc[name]) acc[name] = { amount: 0, count: 0 }
      acc[name].amount += project.anggaran || 0
      acc[name].count += 1
      return acc
    }, {})

    return Object.entries(totals)
      .sort(([, a], [, b]) => b.amount - a.amount)
      .slice(0, 3)
      .map(([label, value]) => ({
        label,
        amount: value.amount,
        count: value.count,
        percent: stats.totalAnggaran ? Math.round((value.amount / stats.totalAnggaran) * 100) : 0,
      }))
  }, [visibleProjects, stats.totalAnggaran])

  const quickActions = {
    admin: [
      { label: 'Kelola Paket', href: '/proyek', icon: FolderOpen, color: 'bg-cyan-50 text-cyan-700', desc: 'Data paket aktif', badge: stats.total },
      { label: 'Approval', href: '/approval', icon: CheckCircle, color: 'bg-emerald-50 text-emerald-700', desc: 'Validasi pending', badge: approvalPending },
      { label: 'Audit Log', href: '/audit-log', icon: Activity, color: 'bg-slate-100 text-slate-700', desc: 'Aktivitas sistem', badge: auditLogs.length },
      { label: 'Pengaturan', href: '/pengaturan', icon: Users, color: 'bg-blue-50 text-blue-700', desc: 'Akun dan akses' },
    ],
    super_admin: [
      { label: 'Kelola Paket', href: '/proyek', icon: FolderOpen, color: 'bg-cyan-50 text-cyan-700', desc: 'Data paket aktif', badge: stats.total },
      { label: 'Approval', href: '/approval', icon: CheckCircle, color: 'bg-emerald-50 text-emerald-700', desc: 'Validasi pending', badge: approvalPending },
      { label: 'Audit Log', href: '/audit-log', icon: Activity, color: 'bg-slate-100 text-slate-700', desc: 'Aktivitas sistem', badge: auditLogs.length },
      { label: 'Pengaturan', href: '/pengaturan', icon: Users, color: 'bg-blue-50 text-blue-700', desc: 'Akun dan akses' },
    ],
    ppk: [
      { label: 'Paket Saya', href: '/proyek', icon: FolderOpen, color: 'bg-cyan-50 text-cyan-700', desc: 'Pantau paket', badge: visibleProjects.length },
      { label: 'Approval Pending', href: '/approval', icon: CheckCircle, color: 'bg-emerald-50 text-emerald-700', desc: 'Perlu keputusan', badge: approvalPending },
      { label: 'Progress', href: '/laporan', icon: TrendingUp, color: 'bg-blue-50 text-blue-700', desc: 'Laporan harian', badge: stats.laporanMenunggu },
      { label: 'Dokumen', href: '/dokumen', icon: FileText, color: 'bg-amber-50 text-amber-700', desc: 'RAB dan arsip' },
    ],
    pptk: [
      { label: 'Paket Saya', href: '/proyek', icon: FolderOpen, color: 'bg-cyan-50 text-cyan-700', desc: 'Tindak lanjut', badge: visibleProjects.length },
      { label: 'Progress', href: '/laporan', icon: TrendingUp, color: 'bg-blue-50 text-blue-700', desc: 'Input laporan', badge: stats.laporanMenunggu },
      { label: 'Dokumen', href: '/dokumen', icon: FileText, color: 'bg-amber-50 text-amber-700', desc: 'Lengkapi arsip' },
      { label: 'Peta Lokasi', href: '/peta', icon: MapPin, color: 'bg-emerald-50 text-emerald-700', desc: 'Pantau lokasi' },
    ],
    tim_survey: [
      { label: 'Input Survey', href: '/survey', icon: Camera, color: 'bg-blue-50 text-blue-700', desc: 'Data lapangan', badge: stats.surveyMenunggu },
      { label: 'Belum Tindak Lanjut', href: '/survey', icon: ClipboardList, color: 'bg-amber-50 text-amber-700', desc: 'Survey pending', badge: stats.surveyMenunggu },
      { label: 'Peta Lokasi', href: '/peta', icon: MapPin, color: 'bg-emerald-50 text-emerald-700', desc: 'Koordinat survey' },
      { label: 'Aktivitas', href: '/audit-log', icon: Activity, color: 'bg-slate-100 text-slate-700', desc: 'Riwayat input' },
    ],
    tim_pengawasan: [
      { label: 'Paket Berjalan', href: '/proyek', icon: HardHat, color: 'bg-cyan-50 text-cyan-700', desc: 'Pengawasan aktif', badge: stats.total - stats.selesai },
      { label: 'Masalah Lapangan', href: '/masalah', icon: AlertTriangle, color: 'bg-rose-50 text-rose-700', desc: 'Kendala aktif', badge: stats.openMasalah },
      { label: 'Laporan Harian', href: '/laporan', icon: FileText, color: 'bg-blue-50 text-blue-700', desc: 'Validasi progres' },
      { label: 'Peta Lokasi', href: '/peta', icon: MapPin, color: 'bg-emerald-50 text-emerald-700', desc: 'Sebaran paket' },
    ],
    pimpinan: [
      { label: 'Dashboard', href: '/dashboard', icon: BarChart2, color: 'bg-blue-50 text-blue-700', desc: 'Ringkasan kota' },
      { label: 'Risiko Kritis', href: '/masalah', icon: ShieldAlert, color: 'bg-rose-50 text-rose-700', desc: 'Perlu perhatian', badge: stats.kritis + stats.warning },
      { label: 'Serapan Anggaran', href: '/serapan-anggaran', icon: TrendingUp, color: 'bg-emerald-50 text-emerald-700', desc: 'Realisasi tahun' },
      { label: 'Peta Monitoring', href: '/peta', icon: MapPin, color: 'bg-cyan-50 text-cyan-700', desc: 'Sebaran SDA' },
    ],
    kabid: [
      { label: 'Paket Kritis', href: `/proyek?health=kritis&source_module=dashboard`, icon: ShieldAlert, color: 'bg-rose-50 text-rose-700', desc: 'Perlu perhatian', badge: stats.kritis },
      { label: 'Approval Pending', href: `/approval?approval_status=pending&source_module=dashboard`, icon: CheckCircle, color: 'bg-emerald-50 text-emerald-700', desc: 'Pantau keputusan', badge: approvalPending },
      { label: 'Serapan Anggaran', href: '/serapan-anggaran', icon: TrendingUp, color: 'bg-blue-50 text-blue-700', desc: 'Realisasi bidang' },
      { label: 'Peta Monitoring', href: '/peta', icon: MapPin, color: 'bg-cyan-50 text-cyan-700', desc: 'Sebaran SDA' },
    ],
    auditor: [
      { label: 'Audit Log', href: '/audit-log', icon: Activity, color: 'bg-slate-100 text-slate-700', desc: 'Jejak aktivitas' },
      { label: 'Dokumen', href: '/dokumen', icon: FileText, color: 'bg-amber-50 text-amber-700', desc: 'Pemeriksaan arsip' },
      { label: 'Paket Kritis', href: `/proyek?health=kritis&source_module=dashboard`, icon: ShieldAlert, color: 'bg-rose-50 text-rose-700', desc: 'Review risiko', badge: stats.kritis },
      { label: 'Serapan Anggaran', href: '/serapan-anggaran', icon: TrendingUp, color: 'bg-blue-50 text-blue-700', desc: 'Review realisasi' },
    ],
    admin_sub_kegiatan: [
      { label: 'Paket Ditugaskan', href: '/proyek', icon: FolderOpen, color: 'bg-cyan-50 text-cyan-700', desc: 'Kelola paket', badge: visibleProjects.length },
      { label: 'Administrasi', href: '/administrasi', icon: FileText, color: 'bg-blue-50 text-blue-700', desc: 'Kontrak dan dokumen' },
      { label: 'Dokumen', href: '/dokumen', icon: ClipboardList, color: 'bg-amber-50 text-amber-700', desc: 'Lengkapi arsip' },
      { label: 'Approval', href: '/approval', icon: CheckCircle, color: 'bg-emerald-50 text-emerald-700', desc: 'Pantau status', badge: approvalPending },
    ],
    direksi_teknis: [
      { label: 'Paket Ditugaskan', href: '/proyek', icon: HardHat, color: 'bg-cyan-50 text-cyan-700', desc: 'Monitoring teknis', badge: visibleProjects.length },
      { label: 'Masalah Lapangan', href: '/masalah', icon: AlertTriangle, color: 'bg-rose-50 text-rose-700', desc: 'Tindak lanjut', badge: stats.openMasalah },
      { label: 'Laporan', href: '/laporan', icon: FileText, color: 'bg-blue-50 text-blue-700', desc: 'Review progres' },
      { label: 'Peta Monitoring', href: '/peta', icon: MapPin, color: 'bg-emerald-50 text-emerald-700', desc: 'Lokasi paket' },
    ],
    konsultan_pengawasan: [
      { label: 'Paket Ditugaskan', href: '/proyek', icon: HardHat, color: 'bg-cyan-50 text-cyan-700', desc: 'Pengawasan aktif', badge: visibleProjects.length },
      { label: 'Masalah Lapangan', href: '/masalah', icon: AlertTriangle, color: 'bg-rose-50 text-rose-700', desc: 'Catatan teknis', badge: stats.openMasalah },
      { label: 'Laporan', href: '/laporan', icon: FileText, color: 'bg-blue-50 text-blue-700', desc: 'Laporan pengawasan' },
      { label: 'Peta Monitoring', href: '/peta', icon: MapPin, color: 'bg-emerald-50 text-emerald-700', desc: 'Lokasi paket' },
    ],
    konsultan_perencana: [
      { label: 'Survey', href: '/survey', icon: Camera, color: 'bg-blue-50 text-blue-700', desc: 'Data perencanaan', badge: stats.surveyMenunggu },
      { label: 'RAB', href: '/rab', icon: ClipboardList, color: 'bg-amber-50 text-amber-700', desc: 'Dokumen rencana' },
      { label: 'Dokumen', href: '/dokumen', icon: FileText, color: 'bg-slate-100 text-slate-700', desc: 'Arsip perencanaan' },
      { label: 'Paket Ditugaskan', href: '/proyek', icon: FolderOpen, color: 'bg-cyan-50 text-cyan-700', desc: 'Paket perencanaan', badge: visibleProjects.length },
    ],
    kontraktor: [
      { label: 'Paket Saya', href: '/proyek', icon: HardHat, color: 'bg-cyan-50 text-cyan-700', desc: 'Paket ditugaskan', badge: visibleProjects.length },
      { label: 'Masalah', href: '/masalah', icon: AlertTriangle, color: 'bg-rose-50 text-rose-700', desc: 'Kendala pekerjaan', badge: stats.openMasalah },
      { label: 'Dokumen', href: '/dokumen', icon: FileText, color: 'bg-amber-50 text-amber-700', desc: 'Dokumen paket' },
      { label: 'Chat Proyek', href: '/chat', icon: MessageSquare, color: 'bg-blue-50 text-blue-700', desc: 'Koordinasi paket' },
    ],
    pejabat_pengadaan: [
      { label: 'Paket Pengadaan', href: '/proyek', icon: FolderOpen, color: 'bg-cyan-50 text-cyan-700', desc: 'Status pengadaan', badge: visibleProjects.length },
      { label: 'RAB', href: '/rab', icon: ClipboardList, color: 'bg-amber-50 text-amber-700', desc: 'Dokumen pengadaan' },
      { label: 'Kontrak', href: '/kontrak', icon: FileText, color: 'bg-blue-50 text-blue-700', desc: 'Informasi kontrak' },
      { label: 'Dokumen', href: '/dokumen', icon: FileText, color: 'bg-slate-100 text-slate-700', desc: 'Arsip pengadaan' },
    ],
    pphp: [
      { label: 'Approval Pemeriksaan', href: `/approval?approval_status=pending&source_module=dashboard`, icon: CheckCircle, color: 'bg-emerald-50 text-emerald-700', desc: 'Perlu pemeriksaan', badge: approvalPending },
      { label: 'Paket Pemeriksaan', href: '/proyek', icon: HardHat, color: 'bg-cyan-50 text-cyan-700', desc: 'Hasil pekerjaan', badge: visibleProjects.length },
      { label: 'Dokumen', href: '/dokumen', icon: FileText, color: 'bg-amber-50 text-amber-700', desc: 'Serah terima' },
      { label: 'Masalah', href: '/masalah', icon: AlertTriangle, color: 'bg-rose-50 text-rose-700', desc: 'Catatan pemeriksaan', badge: stats.openMasalah },
    ],
    tim_perencanaan: [
      { label: 'Survey', href: '/survey', icon: Camera, color: 'bg-blue-50 text-blue-700', desc: 'Data perencanaan', badge: stats.surveyMenunggu },
      { label: 'RAB', href: '/rab', icon: ClipboardList, color: 'bg-amber-50 text-amber-700', desc: 'Rencana anggaran' },
      { label: 'Paket Perencanaan', href: '/proyek', icon: FolderOpen, color: 'bg-cyan-50 text-cyan-700', desc: 'Paket ditugaskan', badge: visibleProjects.length },
      { label: 'Peta Monitoring', href: '/peta', icon: MapPin, color: 'bg-emerald-50 text-emerald-700', desc: 'Lokasi rencana' },
    ],
    default: [
      { label: 'Input Data', href: '/laporan', icon: Plus, color: 'bg-blue-50 text-blue-700', desc: 'Laporan kerja' },
      { label: 'Surat/Dokumen', href: '/dokumen', icon: FileText, color: 'bg-amber-50 text-amber-700', desc: 'Arsip modul' },
      { label: 'Aktivitas', href: '/audit-log', icon: Activity, color: 'bg-slate-100 text-slate-700', desc: 'Log terbaru' },
      { label: 'Peta Monitoring', href: '/peta', icon: MapPin, color: 'bg-cyan-50 text-cyan-700', desc: 'Pantau lokasi' },
    ],
  }
  const actions = (quickActions[normalizedRole as keyof typeof quickActions] || quickActions.default)
    .filter((action) => canAccessPage(currentRole, action.href.split('?')[0]))

  const commandCenterKpis = [
    {
      id: 'packages',
      label: 'Total Paket Aktif',
      value: stats.total,
      helper: `${stats.onTrack} on track`,
      href: `/proyek?tahun=${activeYear}&status=aktif&source_module=dashboard`,
      tone: 'blue' as const,
      accessPath: '/proyek',
    },
    {
      id: 'progress',
      label: 'Progres Fisik / Keuangan',
      value: `${Math.round(stats.avgFisik)}% / ${Math.round(stats.avgKeuangan)}%`,
      helper: 'Rata-rata scoped',
      href: `/proyek?tahun=${activeYear}&source_module=dashboard`,
      tone: 'cyan' as const,
      accessPath: '/proyek',
    },
    {
      id: 'risk',
      label: 'Deviasi / Risiko',
      value: stats.kritis + stats.warning,
      helper: `${stats.kritis} paket kritis`,
      href: `/proyek?tahun=${activeYear}&health=kritis&source_module=dashboard`,
      tone: 'red' as const,
      accessPath: '/proyek',
    },
    {
      id: 'approval',
      label: 'Approval Pending',
      value: approvalPending,
      helper: `${approvalSummary.revision} minta revisi`,
      href: '/approval?approval_status=pending&source_module=dashboard',
      tone: 'amber' as const,
      accessPath: '/approval',
    },
    {
      id: 'survey',
      label: 'Survey Belum Ditindaklanjuti',
      value: stats.surveyMenunggu,
      helper: 'Perlu tindak lanjut',
      href: `/survey?status=belum-ditindaklanjuti&source_module=dashboard`,
      tone: 'violet' as const,
      accessPath: '/survey',
    },
  ].filter((item) => canAccessPage(currentRole, item.accessPath))

  const commandCenterPriorities = alertItems.slice(0, 4).map((item, index) => ({
    id: `${item.label}-${index}`,
    label: item.label,
    detail: typeof item.value === 'number' ? `${item.value} item perlu perhatian` : String(item.value),
    href: item.href,
    tone: item.label.includes('Kritis') ? 'red' as const : item.label.includes('Approval') ? 'amber' as const : item.label.includes('Survey') ? 'violet' as const : 'slate' as const,
  }))

  const commandCenterActivities = recentActivityItems.map((item) => ({
    id: item.id,
    userName: item.userName || item.userId || 'Nama user belum tersedia',
    detail: item.detail || item.action,
    time: new Date(item.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }),
  }))

  const commandNavigationItems = [
    {
      id: 'summary' as const,
      label: 'Ringkasan',
      description: 'Kondisi utama sesuai role dan assignment aktif.',
      value: `${stats.total} paket aktif`,
      status: dashboardDataSource === 'database' ? 'Database' : 'Data Demo/Fallback',
      href: '/dashboard',
      tone: 'navy' as const,
      accessPath: '/dashboard',
    },
    {
      id: 'risk' as const,
      label: 'Risiko & Approval',
      description: 'Paket kritis, masalah, dan approval formal.',
      value: canAccessPage(currentRole, '/approval') ? `${stats.kritis} kritis | ${approvalPending} pending` : `${stats.kritis} paket kritis`,
      status: canAccessPage(currentRole, '/approval') ? 'Approval formal' : 'Paket scoped',
      href: canAccessPage(currentRole, '/approval') ? '/approval?approval_status=pending&source_module=dashboard' : '/proyek?health=kritis&source_module=dashboard',
      tone: 'rose' as const,
      accessPath: canAccessPage(currentRole, '/approval') ? '/approval' : '/proyek',
    },
    {
      id: 'progress' as const,
      label: 'Progress',
      description: 'Ringkasan fisik, keuangan, dan jenis paket.',
      value: `${Math.round(stats.avgFisik)}% fisik | ${Math.round(stats.avgKeuangan)}% keuangan`,
      status: dashboardDataSource === 'database' ? 'Database' : 'Data Demo/Fallback',
      href: `/proyek?tahun=${activeYear}&source_module=dashboard`,
      tone: 'cyan' as const,
      accessPath: '/proyek',
    },
    {
      id: 'activity' as const,
      label: 'Aktivitas',
      description: 'Pembaruan terbaru yang tersedia dalam scope.',
      value: `${commandCenterActivities.length} pembaruan terbaru`,
      status: 'Scoped activity',
      href: '/audit-log?source_module=dashboard',
      tone: 'slate' as const,
      accessPath: '/audit-log',
    },
    {
      id: 'map' as const,
      label: 'Peta Monitoring',
      description: 'Akses pusat spasial tanpa memuat peta besar di dashboard.',
      value: `${visibleProjects.length} lokasi dalam scope`,
      status: 'Shortcut modul',
      href: '/peta?source_module=dashboard',
      tone: 'cyan' as const,
      accessPath: '/peta',
    },
    {
      id: 'support' as const,
      label: 'Modul Pendukung',
      description: 'Surat, administrasi, peil, asset, dan utilitas.',
      value: 'Ringkasan modul pendukung',
      status: 'Campuran database/persiapan',
      href: canAccessPage(currentRole, '/administrasi')
        ? '/administrasi?source_module=dashboard'
        : canAccessPage(currentRole, '/surat')
        ? '/surat?source_module=dashboard'
        : canAccessPage(currentRole, '/asset')
        ? '/asset?source_module=dashboard'
        : '/dashboard',
      tone: 'amber' as const,
      accessPath: '/dashboard',
    },
  ].filter((item) => canAccessPage(currentRole, item.accessPath))

  const commandSupportItems = [
    { id: 'letters' as const, label: 'Surat Masuk & Keluar', status: 'Buka rekap surat', source: 'Persiapan', href: '/surat?source_module=dashboard', accessPath: '/surat' },
    { id: 'flood' as const, label: 'Peil Banjir', status: 'Modul persiapan', source: 'Persiapan', href: '/peil?source_module=dashboard', accessPath: '/peil' },
    { id: 'assets' as const, label: 'Asset SDA', status: 'Modul persiapan', source: 'Persiapan', href: '/asset?source_module=dashboard', accessPath: '/asset' },
    { id: 'administration' as const, label: 'Administrasi', status: 'Kontrak dan dokumen', source: 'Modul', href: '/administrasi?source_module=dashboard', accessPath: '/administrasi' },
    { id: 'prayer' as const, label: 'Waktu & Salat', status: 'Utility dashboard', source: 'Utility', accessPath: '/dashboard' },
    { id: 'insight' as const, label: 'Insight Lokal', status: 'Bukan rekomendasi resmi', source: 'Insight Lokal', accessPath: '/dashboard' },
  ].filter((item) => canAccessPage(currentRole, item.accessPath))

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
      <div className="space-y-4 p-3 sm:p-4 siaga-gemini-bg">
        <div className={activeTab === 'ringkasan' ? 'hidden' : 'contents'}>
          <DashboardRoleHeader
            currentUser={currentUser}
            projects={scopedProjects}
            dateLabel={currentDateLabel}
            timeLabel={currentTimeLabel}
            notificationCount={recentActivity.length}
          />

          {dashboardDataSource === 'demo' && (
            <div className="relative z-10 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
              Data demo/fallback ditampilkan sementara karena data database belum berhasil dimuat.
            </div>
          )}
        </div>

        <section className={`relative z-10 rounded-[24px] border border-slate-200/70 bg-white/90 p-2 shadow-sm ${activeTab === 'ringkasan' ? 'hidden' : ''}`}>
          <div className="flex items-center justify-between gap-3 px-1.5 pb-2 pt-1">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-cyan-700">Navigasi Dashboard</div>
              <div className="mt-0.5 text-[11px] text-slate-500">Pilih ringkasan atau ruang monitoring sesuai kebutuhan.</div>
            </div>
          </div>
          <div className="flex min-w-full gap-1.5 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible">
            {availableTabs.map((tab) => {
              const TabIcon = tab.icon
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex min-w-[82px] items-center gap-1.5 rounded-2xl border px-2 py-1.5 text-xs transition duration-200 ${activeTab === tab.id ? 'border-cyan-400 bg-cyan-50 text-slate-950 shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-cyan-200 hover:bg-slate-50'}`}
                  aria-pressed={activeTab === tab.id}
                >
                  <span className={`inline-flex h-6 w-6 items-center justify-center rounded-xl ${activeTab === tab.id ? 'bg-cyan-100 text-cyan-800' : 'bg-slate-100 text-slate-600'}`}>
                    <TabIcon className="h-3.5 w-3.5" />
                  </span>
                  <span className="whitespace-nowrap font-semibold">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </section>

        <section className={`relative z-10 rounded-[24px] border border-slate-200/70 bg-white/75 p-2 shadow-sm ${activeTab === 'ringkasan' ? 'hidden' : ''}`}>
          <div className="flex items-center justify-between gap-3 px-1.5 pb-2 pt-1">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-cyan-700">Indikator Utama</div>
              <div className="mt-0.5 text-[11px] text-slate-500">Rekap cepat kondisi paket, approval, dan tindak lanjut.</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {[
            {
              label: 'Total Paket Aktif',
              value: stats.total,
              icon: FolderOpen,
              href: `/proyek?tahun=${activeYear}&status=aktif&source_module=dashboard`,
              tone: 'blue',
            },
            {
              label: 'Paket Deviasi/Kritis',
              value: stats.kritis,
              icon: XCircle,
              href: `/proyek?tahun=${activeYear}&health=kritis&source_module=dashboard`,
              tone: 'red',
            },
            {
              label: 'Approval Pending',
              value: approvalPending,
              icon: ClipboardList,
              href: '/approval?approval_status=pending&source_module=dashboard',
              tone: 'amber',
            },
            {
              label: 'Survey Belum Ditindaklanjuti',
              value: stats.surveyMenunggu,
              icon: FileText,
              href: `/survey?tahun=${activeYear}&status=belum-ditindaklanjuti&source_module=dashboard`,
              tone: 'violet',
            },
            ].filter((card) => canAccessPage(currentRole, card.href.split('?')[0])).map((card) => {
              const Icon = card.icon
              return (
                <Link
                  key={card.label}
                  href={card.href}
                  className={`group relative z-10 flex min-h-[96px] items-center justify-between gap-3 rounded-[22px] border p-3.5 text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${card.tone === 'blue' ? 'border-sky-200/80 bg-sky-50/90' : card.tone === 'red' ? 'border-rose-200/80 bg-rose-50/85' : card.tone === 'amber' ? 'border-amber-200/80 bg-amber-50/85' : 'border-violet-200/80 bg-violet-50/85'}`}
                >
                  <div className="min-w-0">
                    <div className="line-clamp-2 text-[11px] font-bold leading-snug text-slate-700 sm:text-xs">{card.label}</div>
                    <div className="mt-2 text-2xl font-black leading-none text-slate-950">{card.value}</div>
                  </div>
                  <div className={`inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl text-white ${card.tone === 'blue' ? 'bg-gradient-to-br from-[#2b6cb0] to-[#06b6d4] shadow-[0_8px_30px_rgba(14,165,233,0.12)]' : card.tone === 'red' ? 'bg-gradient-to-br from-[#d32f2f] to-[#f44336] shadow-[0_8px_30px_rgba(244,63,94,0.12)]' : card.tone === 'amber' ? 'bg-gradient-to-br from-[#ffb300] to-[#ff8a00] shadow-[0_8px_30px_rgba(255,167,38,0.12)]' : 'bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] shadow-[0_8px_30px_rgba(124,58,237,0.12)]'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        <section className={`relative z-10 rounded-[24px] border border-sky-200/70 bg-gradient-to-br from-white via-sky-50/80 to-cyan-50/70 p-3 shadow-sm ${activeTab === 'ringkasan' ? 'hidden' : ''}`}>
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Filter Ringkas</div>
              <div className="mt-1 text-xs text-slate-600">Saring paket aktif berdasarkan tahun, jenis, metode, dan tahap.</div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-full border border-sky-100 bg-white/85 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700">Tahun: <span className="font-bold text-slate-900">{compactFilterValues.tahun}</span></span>
              <span className="rounded-full border border-emerald-100 bg-white/85 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700">Jenis: <span className="font-bold text-slate-900">{compactFilterValues.jenis}</span></span>
              <span className="rounded-full border border-amber-100 bg-white/85 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700">Metode: <span className="font-bold text-slate-900">{compactFilterValues.metode}</span></span>
              <span className="rounded-full border border-violet-100 bg-white/85 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700">Tahap: <span className="font-bold text-slate-900">{compactFilterValues.tahap}</span></span>
              <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1.5 text-[11px] font-semibold text-cyan-900">{visibleProjects.length} paket</span>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            <span>{compactFilterSummary}</span>
            {hasFilterActive && activeFilterLabels.map((label) => (
              <span key={label} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-semibold text-slate-700">{label}</span>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap justify-end gap-2">
            {hasFilterActive && (
              <button
                type="button"
                onClick={() => {
                  setFilterKategori('all')
                  setFilterJenisProyek('all')
                  setFilterTahap('all')
                  setFilterTahun('all')
                  setFilterProgram('all')
                  setFilterSubKegiatan('all')
                }}
                className="inline-flex h-9 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
              >
                Reset Filter
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowAdvancedFilters((prev) => !prev)}
              className="inline-flex h-9 items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 px-3 text-xs font-semibold text-cyan-900 transition hover:border-cyan-300 hover:bg-cyan-100"
            >
              {showAdvancedFilters ? 'Sembunyikan Filter' : 'Filter Lanjutan'}
            </button>
          </div>
        </section>

        {activeTab !== 'ringkasan' && showAdvancedFilters && (
          <div className="relative z-10 rounded-3xl border border-slate-200/70 bg-white p-4 shadow-sm sm:p-5">
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
          </div>
        )}

        <section className={`relative z-10 overflow-hidden rounded-[24px] border border-cyan-200/70 bg-gradient-to-br from-cyan-50/95 via-white to-teal-50/90 p-4 text-slate-900 shadow-[0_18px_50px_rgba(14,116,144,0.10)] backdrop-blur-sm ${activeTab === 'ringkasan' ? 'hidden' : ''}`}>
          <div className="pointer-events-none absolute -right-12 -top-16 h-36 w-36 rounded-full bg-cyan-200/35 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 bottom-0 h-24 w-24 rounded-full bg-emerald-200/30 blur-3xl" />
          <div className="relative flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="text-xs font-extrabold uppercase tracking-[0.22em] text-cyan-700">AKSES CEPAT ROLE</div>
              <h2 className="mt-1 text-base font-extrabold text-slate-900">Shortcut kerja hari ini</h2>
              <p className="mt-0.5 text-xs font-medium text-slate-600">Aksi utama disesuaikan dengan role aktif: {getRoleLabel(currentRole)}.</p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:min-w-[620px]">
              {actions.slice(0, 4).map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group relative min-w-0 rounded-2xl border border-cyan-100 bg-white/90 p-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-[0_12px_32px_rgba(14,116,144,0.14)] active:translate-y-0 active:scale-[0.99]"
                >
                  <div className="flex items-start gap-2">
                    <span className={`inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl ${action.color}`}>
                      <action.icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-extrabold text-slate-900">{action.label}</div>
                      <div className="mt-0.5 truncate text-[10px] font-medium text-slate-600">{action.desc}</div>
                    </div>
                    {'badge' in action && typeof action.badge === 'number' && (
                      <span className="absolute right-2 top-2 rounded-full bg-slate-900 px-1.5 py-0.5 text-[10px] font-black text-white">{action.badge}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {activeTab !== 'ringkasan' && (
          <button
            type="button"
            onClick={() => setActiveTab('ringkasan')}
            className="relative z-10 inline-flex h-10 w-fit items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-white px-4 text-sm font-extrabold text-slate-950 shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Kembali ke Ringkasan Dashboard
          </button>
        )}

        <div className={`relative z-10 transition-all duration-200 ease-out ${activeTab === 'ringkasan' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'}`}>
          {activeTab === 'ringkasan' && (
          <div className="space-y-3">
            <CommandCenterOverview
              userName={currentUserName}
              roleLabel={getRoleLabel(currentRole)}
              scopeLabel={`${visibleProjects.length} paket terlihat sesuai role, assignment, dan filter aktif`}
              activeYear={activeYear}
              dataSource={dashboardDataSource}
              lastUpdate={lastAuditLabel}
              kpis={commandCenterKpis}
              priorities={commandCenterPriorities}
              avgPhysical={stats.avgFisik}
              avgFinancial={stats.avgKeuangan}
              health={{ onTrack: stats.onTrack, warning: stats.warning, critical: stats.kritis }}
              packageTypes={packageTypeSummary}
              risk={{ critical: stats.kritis, approvalPending, revision: approvalSummary.revision, openIssues: stats.openMasalah }}
              canViewApproval={canAccessPage(currentRole, '/approval')}
              quickActions={actions}
              activities={commandCenterActivities}
              canViewAudit={canAccessPage(currentRole, '/audit-log')}
              mapLocations={visibleProjects.length}
              mapWarnings={riskProjects.length}
              navigationItems={commandNavigationItems}
              supportItems={commandSupportItems}
              filterLabel={hasFilterActive ? `${activeFilterLabels.length} Filter Aktif` : 'Filter'}
              onToggleFilters={() => setShowAdvancedFilters((current) => !current)}
              filterPanel={showAdvancedFilters ? (
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
              ) : undefined}
              afterKpiContent={(
                <TaskCenterPanel
                  identity={taskCenterIdentity}
                  tasks={[]}
                  completedTasks={[]}
                  appreciationEvents={[]}
                  dataSourceLabel="Belum Terhubung Data Resmi"
                />
              )}
              focusPackage={riskProjects[0] ? {
                kode: riskProjects[0].kode,
                nama: riskProjects[0].nama,
                lokasi: riskProjects[0].lokasi,
                health: riskProjects[0].health || 'warning',
                jenis: getProjectPackageTypeLabel(getProjectPackageType(riskProjects[0])),
                metode: getProjectCategoryLabel(riskProjects[0].kategoriPekerjaan),
                progressFisik: riskProjects[0].progressFisik,
                progressKeuangan: riskProjects[0].progressKeuangan,
                ppk: riskProjects[0].ppk,
                pptk: riskProjects[0].pptk,
              } : undefined}
            />

            <div className="flex justify-center pt-0.5 xl:hidden">
              <button
                type="button"
                onClick={() => setShowDetailedSummary((current) => !current)}
                className="inline-flex h-8 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-bold text-slate-600 shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800"
              >
                {showDetailedSummary ? 'Sembunyikan Rekap Tambahan' : 'Buka Rekap Tambahan'}
              </button>
            </div>

            {showDetailedSummary && (
            <div className="space-y-3 xl:hidden">
            <div className="grid gap-3 xl:grid-cols-[1.08fr_0.92fr]">
              <section className="siaga-glass-card flex h-full flex-col border border-cyan-200/70 bg-gradient-to-br from-cyan-50/90 via-white to-sky-50/90 p-3.5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-cyan-700">COMMAND BRIEF SIAGA-SDA</div>
                    <h2 className="mt-1 text-base font-extrabold text-slate-950">Operasi dan prioritas hari ini</h2>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusSda === 'WASPADA' ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}>{statusSda}</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
                  {commandBriefItems.map((item) => {
                    const toneClass = item.tone === 'blue' ? 'bg-blue-50 text-blue-700' : item.tone === 'emerald' ? 'bg-emerald-50 text-emerald-700' : item.tone === 'slate' ? 'bg-slate-100 text-slate-700' : item.tone === 'red' ? 'bg-rose-50 text-rose-700' : item.tone === 'amber' ? 'bg-amber-50 text-amber-700' : 'bg-violet-50 text-violet-700'
                    return (
                       <div key={item.label} className={`rounded-2xl border p-2.5 shadow-sm ${item.tone === 'blue' ? 'border-blue-100 bg-blue-50/80' : item.tone === 'emerald' ? 'border-emerald-100 bg-emerald-50/80' : item.tone === 'slate' ? 'border-slate-200 bg-slate-50/90' : item.tone === 'red' ? 'border-rose-100 bg-rose-50/80' : item.tone === 'amber' ? 'border-amber-100 bg-amber-50/80' : 'border-violet-100 bg-violet-50/80'}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="line-clamp-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{item.label}</div>
                            <div className="mt-1.5 text-2xl font-black text-slate-950">{item.value}</div>
                          </div>
                          <span className={`inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl ${toneClass}`}>
                            <item.icon className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-3 rounded-2xl border border-cyan-100 bg-white/85 p-2.5">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Kesimpulan Singkat</div>
                  <p className="mt-1 text-sm leading-5 text-slate-700">{mainCauses[0] || 'Kondisi umum stabil. Tetap awasi approval dan progress harian.'}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Link href="/proyek" className="inline-flex h-8 items-center justify-center rounded-xl bg-slate-950 px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800">Paket</Link>
                  <Link href="/approval" className="inline-flex h-8 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-950 transition hover:border-cyan-300 hover:bg-cyan-50">Approval</Link>
                  <Link href="/peta" className="inline-flex h-8 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-950 transition hover:border-cyan-300 hover:bg-cyan-50">Peta</Link>
                  <Link href="/audit-log" className="inline-flex h-8 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-950 transition hover:border-cyan-300 hover:bg-cyan-50">Audit</Link>
                </div>
              </section>

              <section className="siaga-glass-card flex h-full flex-col border border-amber-200/70 bg-gradient-to-br from-amber-50/90 via-white to-rose-50/80 p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-700">Alert & Risiko Lintas Modul</div>
                    <h3 className="mt-1 text-base font-extrabold text-slate-950">Prioritas hari ini</h3>
                  </div>
                  <Link href="/peta" className="text-xs font-bold text-sky-600 hover:underline">Lihat Semua</Link>
                </div>
                <div className="mt-3 space-y-1.5">
                  {alertItems.map((item) => (
                    <Link key={item.label} href={item.href} className="flex items-center justify-between gap-3 rounded-2xl border border-amber-100 bg-white/90 p-2.5 text-sm transition hover:border-amber-200 hover:bg-amber-50/60">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700"><item.icon className="h-4 w-4" /></span>
                        <div>
                          <div className="font-semibold text-slate-900">{item.label}</div>
                          <div className="text-xs text-slate-500">{typeof item.value === 'number' ? `${item.value} item` : item.value}</div>
                        </div>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${item.badgeClass}`}>{item.badge}</span>
                    </Link>
                  ))}
                </div>
              </section>

            </div>

            <section className="siaga-glass-card overflow-hidden border border-sky-200/70 bg-gradient-to-br from-sky-50/90 via-white to-emerald-50/80 p-3.5 sm:p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-sky-700">Paket & Anggaran Tahun Aktif</div>
                  <h3 className="mt-1 text-lg font-extrabold leading-tight text-slate-950">Paket dan serapan</h3>
                  <p className="mt-1 text-xs font-medium leading-5 text-slate-600">Rekap sub kegiatan tahun aktif dalam format tabel ringkas untuk monitoring pagu, serapan, progres, dan status.</p>
                </div>
                <Link href="/proyek" className="inline-flex h-9 w-fit items-center justify-center rounded-2xl border border-sky-200 bg-white px-3 text-xs font-bold text-sky-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-50">Lihat Semua</Link>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-sky-100 bg-white/90 p-3 shadow-sm">
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-700">Total Paket</div>
                  <div className="mt-1 text-2xl font-black leading-none text-slate-950">{stats.total}</div>
                </div>
                <div className="rounded-2xl border border-rose-100 bg-rose-50/80 p-3 shadow-sm">
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-rose-700">Stuck / Kritis</div>
                  <div className="mt-1 text-2xl font-black leading-none text-slate-950">{stats.kritis + stats.warning}</div>
                </div>
                {packageTypeSummary.slice(0, 2).map((item, index) => (
                  <div key={item.label} className={`rounded-2xl border p-3 shadow-sm ${index === 0 ? 'border-emerald-100 bg-emerald-50/80' : 'border-violet-100 bg-violet-50/80'}`}>
                    <div className="line-clamp-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600">{item.label}</div>
                    <div className="mt-1 text-2xl font-black leading-none text-slate-950">{item.count}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 overflow-hidden rounded-[20px] border border-slate-200/80 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[920px] border-collapse text-left text-sm">
                    <thead className="bg-sky-50 text-[11px] font-black uppercase tracking-[0.12em] text-slate-600">
                      <tr>
                        <th className="border-b border-slate-200 px-4 py-3">Sub Kegiatan / Paket</th>
                        <th className="border-b border-slate-200 px-3 py-3 text-center">Jumlah Paket</th>
                        <th className="border-b border-slate-200 px-3 py-3 text-right">Pagu</th>
                        <th className="border-b border-slate-200 px-3 py-3 text-right">Serapan</th>
                        <th className="border-b border-slate-200 px-3 py-3">Progress</th>
                        <th className="border-b border-slate-200 px-3 py-3">Status</th>
                        <th className="border-b border-slate-200 px-4 py-3">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {subKegiatanSummaries.length > 0 ? subKegiatanSummaries.slice(0, 6).map((row, index) => (
                        <tr
                          key={row.subKegiatan}
                          className={`cursor-pointer transition hover:bg-sky-50/80 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}
                          role="link"
                          tabIndex={0}
                          onClick={() => router.push(row.rowLink)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') router.push(row.rowLink)
                          }}
                        >
                          <td className="max-w-[310px] px-4 py-3 align-top">
                            <div className="line-clamp-2 font-extrabold leading-snug text-slate-900">{row.subKegiatan}</div>
                            <div className="mt-1 text-xs font-medium text-slate-500">{row.estimationLabel}</div>
                          </td>
                          <td className="px-3 py-3 text-center align-top">
                            <span className="inline-flex min-w-10 justify-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-black text-slate-800">{row.paketCount}</span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 text-right align-top font-bold text-slate-900">{formatCurrency(row.totalPagu)}</td>
                          <td className="whitespace-nowrap px-3 py-3 text-right align-top">
                            <div className="font-black text-slate-900">{row.persenSerapan}%</div>
                            <div className="text-[11px] font-medium text-slate-500">Keu {row.avgKeuangan}%</div>
                          </td>
                          <td className="px-3 py-3 align-top">
                            <div className="flex min-w-[130px] items-center gap-2">
                              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                                <div className={`h-full rounded-full ${row.avgFisik >= 80 ? 'bg-emerald-500' : row.avgFisik >= 50 ? 'bg-sky-500' : row.avgFisik >= 30 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${Math.min(100, Math.max(0, row.avgFisik))}%` }} />
                              </div>
                              <span className="w-10 text-right text-xs font-black text-slate-800">{row.avgFisik}%</span>
                            </div>
                          </td>
                          <td className="px-3 py-3 align-top">
                            <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-black ${row.statusSerapan === 'Aman' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : row.statusSerapan === 'Perlu Percepatan' ? 'border-amber-200 bg-amber-50 text-amber-700' : row.statusSerapan === 'Perlu Evaluasi' ? 'border-orange-200 bg-orange-50 text-orange-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>{row.statusSerapan}</span>
                          </td>
                          <td className="px-4 py-3 align-top text-xs leading-5 text-slate-600">
                            <span className="line-clamp-2">{row.penyebab[0]}</span>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={7} className="px-4 py-6 text-center text-sm font-semibold text-slate-500">Belum ada data paket untuk filter aktif.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <div className="grid gap-3 xl:grid-cols-2">
              <section className="siaga-glass-card flex h-full flex-col border border-teal-200/70 bg-gradient-to-br from-teal-50/90 via-white to-blue-50/80 p-3.5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-cyan-700">STATUS SDA & PASANG SURUT HARI INI</div>
                    <h3 className="mt-1 text-base font-extrabold text-slate-950">Kondisi air dan kesiapsiagaan</h3>
                  </div>
                  <span className={`w-fit rounded-full border px-3 py-1 text-xs font-bold ${tideOverview.status === 'KRITIS' ? 'border-rose-200 bg-rose-50 text-rose-700' : tideOverview.status === 'WASPADA' ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>
                    {tideOverview.status}
                  </span>
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-teal-100 bg-white/90 p-3 shadow-sm">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status SDA</div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-[11px] text-slate-500">Tinggi muka air</div>
                        <div className="mt-0.5 text-xl font-black text-slate-950">{tideOverview.currentLevel}</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-500">Tren</div>
                        <div className="mt-0.5 text-sm font-bold text-slate-900">{tideOverview.trend}</div>
                      </div>
                      <div className="col-span-2 rounded-xl border border-teal-100 bg-teal-50/60 p-2">
                        <div className="text-[11px] text-slate-500">Menuju puncak</div>
                        <div className="mt-0.5 text-sm font-bold text-slate-900">{tideOverview.peakTime}</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-3 shadow-sm">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Pasang Surut</div>
                    <div className="mt-2 grid gap-2">
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-blue-100 bg-white/90 p-2 text-sm">
                        <span className="text-slate-600">Maksimum hari ini</span>
                        <span className="font-bold text-slate-900">{tideScheduleRows.find((row) => row.condition === 'Pasang Maksimum')?.height || tideOverview.currentLevel}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-blue-100 bg-white/90 p-2 text-sm">
                        <span className="text-slate-600">Tertinggi 1 minggu</span>
                        <span className="font-bold text-slate-900">{tideOverview.weeklyHighest.height}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-blue-100 bg-white/90 p-2 text-sm">
                        <span className="text-slate-600">Tertinggi 1 bulan</span>
                        <span className="font-bold text-slate-900">{tideOverview.monthlyHighest.height}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 rounded-2xl border border-blue-200 bg-blue-50/80 p-2.5 text-xs leading-5 text-slate-700">
                  <span className="font-semibold text-blue-900">Kesiapsiagaan:</span> {tideOverview.note}
                </div>
              </section>

              <section className="siaga-glass-card flex h-full flex-col border border-indigo-200/70 bg-gradient-to-br from-indigo-50/85 via-white to-cyan-50/80 p-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-cyan-700">Peta Monitoring Ringkas</div>
                    <h3 className="mt-1 text-base font-extrabold text-slate-950">Sebaran status</h3>
                  </div>
                  <Link href="/peta" className="text-xs font-bold text-sky-600 hover:underline">Buka Peta</Link>
                </div>
                <div className="mt-3 overflow-hidden rounded-[22px] border border-cyan-200 bg-gradient-to-br from-cyan-100 via-slate-100 to-white p-2 shadow-soft">
                  <div className="relative h-32 overflow-hidden rounded-[18px] bg-gradient-to-br from-sky-100 via-cyan-50 to-white sm:h-36">
                    <div className="absolute left-6 top-8 h-3 w-3 rounded-full bg-cyan-500 shadow-[0_0_0_14px_rgba(56,189,248,0.18)]" />
                    <div className="absolute left-28 top-18 h-3 w-3 rounded-full bg-amber-400 shadow-[0_0_0_14px_rgba(251,191,36,0.16)]" />
                    <div className="absolute right-8 top-14 h-3 w-3 rounded-full bg-rose-400 shadow-[0_0_0_14px_rgba(244,63,94,0.18)]" />
                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-cyan-200/40 to-transparent" />
                  </div>
                </div>
                <div className="mt-3 grid gap-2 text-sm font-semibold text-slate-700 sm:grid-cols-3 xl:grid-cols-1">
                  <div className="flex items-center gap-2 rounded-xl border border-rose-100 bg-white/80 p-2"><span className="h-2 w-2 rounded-full bg-rose-500"></span>7 Titik Kritis</div>
                  <div className="flex items-center gap-2 rounded-xl border border-amber-100 bg-white/80 p-2"><span className="h-2 w-2 rounded-full bg-amber-500"></span>14 Titik Waspada</div>
                  <div className="flex items-center gap-2 rounded-xl border border-sky-100 bg-white/80 p-2"><span className="h-2 w-2 rounded-full bg-sky-500"></span>22 Titik Aman</div>
                </div>
              </section>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <section className="siaga-glass-card border border-slate-200/70 bg-gradient-to-br from-slate-50/90 via-white to-cyan-50/80 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-cyan-700">Tugas Per Role / User</div>
                    <h3 className="mt-1 text-lg font-extrabold text-slate-950">Fokus lintas peran</h3>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {roleActions.slice(0, 5).map((action) => (
                    <div key={`${action.role}-${action.task}`} className="rounded-3xl border border-violet-100 bg-white/90 p-3 shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-xs font-bold text-slate-800">{action.name?.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900">{action.name}</div>
                            <div className="text-xs text-slate-500">{action.role}</div>
                          </div>
                        </div>
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">{action.priority}</span>
                      </div>
                      <div className="mt-2 text-xs text-slate-700">{action.task}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="siaga-glass-card border border-violet-200/70 bg-gradient-to-br from-violet-50/85 via-white to-slate-50/90 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-cyan-700">Aktivitas Terbaru</div>
                    <h3 className="mt-1 text-lg font-extrabold text-slate-950">Log audit terbaru</h3>
                  </div>
                  <Link href="/audit-log" className="text-xs font-bold text-sky-600 hover:underline">Lihat Semua</Link>
                </div>
                <div className="mt-3 space-y-2">
                  {recentActivityItems.map((item) => {
                    const userName = item.userName || item.userId || 'Nama user belum tersedia'
                    const initials = userName.split(' ').filter(Boolean).map((word) => word[0]).join('').slice(0, 2).toUpperCase()
                    return (
                      <div key={item.id} className="rounded-3xl border border-slate-200 bg-white/90 p-3 shadow-sm">
                        <div className="flex items-start gap-2">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-xs font-bold text-slate-800">{initials}</div>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-slate-900">{userName}</div>
                            <div className="mt-0.5 truncate text-xs text-slate-500">{item.detail || item.action}</div>
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-slate-500">{new Date(item.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
                      </div>
                    )
                  })}
                </div>
              </section>
            </div>
            </div>
            )}
          </div>
        )}
        </div>

        {activeTab === 'pasang-surut' && (
          <div className="relative z-10 text-slate-900">
            <div className="mb-2 flex justify-end">
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-800">Data Simulasi</span>
            </div>
            <TideDashboardPanel />
          </div>
        )}

        {activeTab === 'survey' && (
          <SurveyInvestigationTab projects={visibleProjects} />
        )}

        <div className={`relative z-10 text-slate-900 transition-all duration-300 ease-in-out ${activeTab === 'paket' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
          {activeTab === 'paket' && (
            <PackageWorkspaceTab projects={visibleProjects} stats={stats} />
          )}
        </div>

        {activeTab === 'surat' && (
          <ModulePreparationTab
            icon={FileText}
            title="Surat Masuk & Keluar"
            subtitle="Disposisi, undangan rapat, tindak lanjut surat, dan relasi ke survey/paket/peil."
            route="/surat"
            routeLabel="Buka Surat Masuk & Keluar"
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
            route="/peil"
            routeLabel="Buka Peil Banjir"
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
            route="/asset"
            routeLabel="Buka Asset SDA"
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
            route="/asset?subtab=operasional&source_module=dashboard"
            routeLabel="Buka Asset SDA (Operasional belum final)"
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
          <div className="relative z-10 space-y-5 text-slate-900">
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

        <div className={`relative z-10 text-slate-900 transition-all duration-300 ease-in-out ${activeTab === 'monitoring' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
          {activeTab === 'monitoring' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
              <div className="siaga-card p-5 lg:col-span-3">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-800">Progress Fisik vs Keuangan</div>
                    <div className="mt-0.5 text-xs text-slate-600">Paket pada filter aktif</div>
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
                <div className="mb-3 text-xs text-slate-600">Distribusi health</div>
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
                  <div className="flex h-40 items-center justify-center text-sm text-slate-600">Tidak ada data</div>
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
          <div className="relative z-10 grid grid-cols-1 gap-5 text-slate-900 lg:grid-cols-5">
            <div className="siaga-card p-5 lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-extrabold text-slate-900">Ringkasan Approval</div>
                  <div className="text-xs text-slate-500">Data formal sesuai role dan penugasan aktif</div>
                </div>
                <Link href="/approval" className="text-xs font-bold text-blue-700 hover:underline">Buka</Link>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Pending', value: approvalSummary.pending },
                  { label: 'Revisi', value: approvalSummary.revision },
                  { label: 'Selesai', value: approvalSummary.approved },
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
                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-600">Tidak ada paket risiko pada filter aktif.</div>
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
          <div className="siaga-card relative z-10 p-5 text-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm font-extrabold text-slate-900">Aktivitas Terbaru</div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-xs font-semibold text-slate-600">Realtime</span>
              </div>
            </div>
            {recentActivity.length === 0 ? (
              <div className="py-8 text-center text-sm font-medium text-slate-600">
                <Activity className="mx-auto mb-2 h-8 w-8 text-slate-500" />
                Belum ada aktivitas
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white/95 p-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                      <ClipboardList className="h-4 w-4 text-blue-700" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-extrabold text-slate-900">{log.action}</div>
                      <div className="truncate text-[11px] font-medium text-slate-700">{log.detail}</div>
                      <div className="mt-0.5 text-[10px] font-medium text-slate-600">{log.userName} - {formatDateTime(log.timestamp)}</div>
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
          <div className="relative z-10 grid grid-cols-1 gap-5 text-slate-900 lg:grid-cols-3">
            <div className="siaga-card p-5 lg:col-span-2">
              <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <Bot className="h-4 w-4 text-blue-700" />
                Insight Lokal Dashboard
              </div>
              <div className="space-y-3">
                {aiFindings.map((item, index) => (
                  <div key={index} className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm leading-relaxed text-blue-950">{item}</div>
                ))}
              </div>
            </div>
            <div className="siaga-card p-5">
              <div className="mb-1 text-sm font-extrabold text-slate-900">Saran Tindakan</div>
              <div className="mb-3 text-xs font-medium text-slate-500">Rule-based lokal, bukan rekomendasi resmi.</div>
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
    <div className="relative z-10 grid grid-cols-1 gap-5 text-slate-900 lg:grid-cols-5">
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
    <div className="relative z-10 grid grid-cols-1 gap-5 text-slate-900 lg:grid-cols-5">
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
    <div className="relative z-10 grid grid-cols-1 gap-5 text-slate-900 lg:grid-cols-5">
      <div className="siaga-card p-5 lg:col-span-3">
        <ModuleHeader icon={Icon} title={title} subtitle={subtitle} />
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {cards.map((card) => (
            <Link key={card.label} href={route} className="block rounded-xl bg-slate-50 p-4 transition hover:bg-blue-50">
              <div className="text-2xl font-black text-[#0D2C54]">{card.value}</div>
              <div className="mt-1 text-xs font-bold text-slate-700">{card.label}</div>
              <div className="mt-0.5 text-[11px] font-medium text-slate-600">{card.desc}</div>
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
        <div className="mt-0.5 text-sm text-slate-600">{subtitle}</div>
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
      <div className="mt-0.5 text-xs font-bold text-slate-600">{label}</div>
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
      <Waves className="mx-auto mb-2 h-8 w-8 text-slate-500" />
      <div className="text-sm font-medium text-slate-600">{text}</div>
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
                      <div className="mt-0.5 text-[10px] text-slate-500">{project.kode} - {project.kecamatan}</div>
                    </Link>
                  </td>
                  <td className="px-3 py-3">
                    <div className="text-[11px] font-bold text-blue-700">{getProjectCategoryLabel((project as any).kategoriPekerjaan)}</div>
                    <div className="text-[10px] text-slate-500">{getProjectPackageTypeLabel(getProjectPackageType(project))}</div>
                    <div className="text-[10px] text-slate-500">{getProjectWorkStageLabel(getProjectWorkStage(project))}</div>
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
