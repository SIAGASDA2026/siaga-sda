'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Activity, AlertTriangle, ArrowRight, BarChart2, Bot, Building2, Camera, CheckCircle, ClipboardList, Eye, FileText, FolderOpen, HardHat, Landmark, LifeBuoy, MapPin, Megaphone, MessageSquare, Plus, ShieldAlert, TrendingDown, TrendingUp, Users, Waves, XCircle } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { Topbar } from '@/components/layout/Topbar'
import { ProjectScopeFilters } from '@/components/project/ProjectScopeFilters'
import { PrayerTimeWidget } from '@/components/dashboard/PrayerTimeWidget'
import { TideDashboardPanel } from '@/components/dashboard/TideDashboardPanel'
import { BRAND } from '@/lib/brand'
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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

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

  const recentActivity = auditLogs.slice(0, 7)
  const currentRole = currentUser?.role || 'pptk'
  const normalizedRole = currentRole.toLowerCase()
  const roleLabel = getRoleLabel(currentRole)
  const approvalPending = stats.laporanMenunggu + stats.rabMenunggu + stats.surveyMenunggu
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
    () => projects.filter((project) => getProjectBudgetYear(project) === previousYear),
    [projects, previousYear],
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
    const pending = previousYearProjects.reduce((sum, project) => {
      return (
        sum +
        (project.laporanHarian?.filter((item) => !item.disetujui).length || 0) +
        (project.rabList?.filter((item) => item.status !== 'approved' && item.status !== 'rejected').length || 0) +
        (project.surveys?.filter((item) => item.status === 'submitted').length || 0)
      )
    }, 0)
    const avgFisik = total
      ? previousYearProjects.reduce((sum, project) => sum + (project.progressFisik || 0), 0) / total
      : 0
    return { total, selesai, stuck, pending, avgFisik }
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
  const broadRoleView = ['super_admin', 'admin', 'admin_sistem', 'kabid', 'pimpinan'].includes(normalizedRole)
  const currentUserAction = {
    ppk: { label: 'PPK', task: 'Review approval pending dan evaluasi paket kritis', module: '/approval', priority: 'Tinggi' },
    pptk: { label: 'PPTK', task: 'Update progres dan tindak lanjut paket stuck', module: '/laporan', priority: 'Tinggi' },
    admin_kegiatan: { label: 'Admin Kegiatan', task: 'Lengkapi data paket, kontrak, dan dokumen', module: '/proyek', priority: 'Sedang' },
    konsultan_pengawas: { label: 'Konsultan Pengawas', task: 'Cek deviasi dan catatan lapangan', module: '/peta', priority: 'Sedang' },
    konsultan_perencana: { label: 'Konsultan Perencana', task: 'Lengkapi dokumen perencanaan/survey', module: '/survey', priority: 'Sedang' },
    kontraktor: { label: 'Kontraktor', task: 'Update laporan harian dan dokumentasi', module: '/laporan', priority: 'Sedang' },
    mandor_operasional_sda: { label: 'Mandor/Petugas', task: 'Update kondisi lapangan, pintu air, pompa, pasang surut', module: '/peta', priority: 'Tinggi' },
    mandor_rehab_drainase: { label: 'Mandor/Petugas', task: 'Update kondisi lapangan, pintu air, pompa, pasang surut', module: '/peta', priority: 'Tinggi' },
    admin_surat: { label: 'Admin Surat/Peil/Asset', task: 'Lengkapi data modul masing-masing', module: '/pengumuman', priority: 'Sedang' },
    admin_peil: { label: 'Admin Surat/Peil/Asset', task: 'Lengkapi data modul masing-masing', module: '/peta', priority: 'Sedang' },
    admin_asset: { label: 'Admin Surat/Peil/Asset', task: 'Lengkapi data modul masing-masing', module: '/peta', priority: 'Sedang' },
  }[normalizedRole] || { label: getRoleLabel(currentRole), task: 'Tindak lanjut sesuai peran Anda', module: '/peta', priority: 'Sedang' }

  const roleActions = useMemo(() => {
    const actionDefinitions = [
      { role: 'PPK', task: 'Review approval pending dan evaluasi paket kritis', module: '/approval', priority: 'Tinggi' },
      { role: 'PPTK', task: 'Update progres dan tindak lanjut paket stuck', module: '/laporan', priority: 'Tinggi' },
      { role: 'Admin Kegiatan', task: 'Lengkapi data paket, kontrak, dan dokumen', module: '/proyek', priority: 'Sedang' },
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
              'Admin Kegiatan: lengkapi pagu, kontrak, dokumen, dan klasifikasi paket.',
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
      { label: 'Approval pending', current: approvalPending, previous: previousYearStats.pending },
      { label: 'Rata-rata progres fisik', current: Math.round(stats.avgFisik), previous: Math.round(previousYearStats.avgFisik) },
    ],
    [approvalPending, previousYearStats, stats.avgFisik, stats.kritis, stats.selesai, stats.total, stats.warning],
  )

  const hasPreviousYearStats = previousYearProjects.length > 0

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
        <section className="relative z-10 overflow-hidden rounded-3xl border border-cyan-100/80 bg-white/70 p-4 text-slate-950 shadow-lg shadow-blue-200/10 backdrop-blur-md md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600">{BRAND.unit}</div>
              <h2 className="mt-1 text-xl font-extrabold leading-tight sm:text-2xl md:text-3xl text-slate-950">{BRAND.name}</h2>
              <p className="mt-1 max-w-3xl text-sm text-slate-700">{BRAND.fullName} untuk monitoring proyek dan respons cepat SDA.</p>
            </div>
            <Link href="/peta" className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-cyan-200/70 bg-gradient-to-r from-cyan-100/80 to-blue-100/80 px-5 text-sm font-extrabold text-slate-950 shadow-md shadow-cyan-300/20 backdrop-blur-sm transition duration-300 hover:from-cyan-100 hover:to-blue-100 hover:shadow-lg hover:shadow-cyan-300/30 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-1">
              <MapPin className="h-4 w-4" />
              Buka Peta Monitoring
            </Link>
          </div>
        </section>

        <div className="relative z-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Paket Aktif', value: stats.total, icon: FolderOpen, href: '/proyek', tone: 'blue' },
            { label: 'Paket Deviasi/Kritis', value: stats.kritis, icon: XCircle, href: '/proyek', tone: 'red' },
            { label: 'Approval Pending', value: approvalPending, icon: ClipboardList, href: '/approval', tone: 'amber' },
            { label: 'Survey Belum Ditindaklanjuti', value: stats.surveyMenunggu, icon: FileText, href: '/survey', tone: 'violet' },
          ].map((card) => {
            const Icon = card.icon
            return (
              <Link
                key={card.label}
                href={card.href}
                className={`group relative z-10 siaga-glass-card border ${card.tone === 'blue' ? 'border-blue-200/70' : card.tone === 'red' ? 'border-rose-200/70' : card.tone === 'amber' ? 'border-amber-200/70' : card.tone === 'green' ? 'border-emerald-200/70' : 'border-violet-200/70'} transform-gpu transition-transform transition-shadow duration-200 ease-out will-change-transform hover:scale-[1.02] hover:shadow-lg ${card.tone === 'blue' ? 'focus:ring-blue-200' : card.tone === 'red' ? 'focus:ring-red-200' : card.tone === 'amber' ? 'focus:ring-amber-200' : card.tone === 'green' ? 'focus:ring-green-200' : 'focus:ring-violet-200'} focus:outline-none focus:ring-2 focus:ring-offset-1 text-slate-900`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-700">{card.label}</div>
                    <div className="mt-3 text-3xl font-black text-slate-950">{card.value}</div>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.tone === 'blue' ? 'bg-gradient-to-br from-[#3730A3] to-[#06B6D4]' : card.tone === 'red' ? 'bg-gradient-to-br from-[#D32F2F] to-[#E53935]' : card.tone === 'amber' ? 'bg-gradient-to-br from-[#FFB300] to-[#FF8A00]' : card.tone === 'green' ? 'bg-gradient-to-br from-[#2E7D32] to-[#66BB6A]' : 'bg-gradient-to-br from-[#7C3AED] to-[#A78BFA]'} text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="relative z-10 grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200/70 bg-white p-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Command Center</div>
            <h3 className="mt-2 text-lg font-extrabold text-slate-950">Ringkasan Aktif</h3>
            <p className="mt-1 text-xs text-slate-600">Status paket dan SDA saat ini.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-3">
                <div className="text-[10px] text-slate-500">Total Paket</div>
                <div className="mt-2 text-2xl font-black text-slate-950">{stats.total}</div>
              </div>
              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-3">
                <div className="text-[10px] text-slate-500">Kritis + Warning</div>
                <div className="mt-2 text-2xl font-black text-slate-950">{stats.kritis + stats.warning}</div>
              </div>
            </div>
          </div>
          <TideDashboardPanel compact />
        </div>

        <div className="relative z-10 rounded-3xl border border-cyan-100/80 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] items-center">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700 sm:gap-3">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">Tahun: <span className="font-bold text-slate-900">{compactFilterValues.tahun}</span></span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">Jenis: <span className="font-bold text-slate-900">{compactFilterValues.jenis}</span></span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">Metode: <span className="font-bold text-slate-900">{compactFilterValues.metode}</span></span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">Tahap: <span className="font-bold text-slate-900">{compactFilterValues.tahap}</span></span>
                <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-cyan-900">{visibleProjects.length} paket</span>
              </div>
              <div className="text-xs text-slate-500">{compactFilterSummary}</div>
              {hasFilterActive && (
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
                  {activeFilterLabels.map((label) => (
                    <span key={label} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-semibold text-slate-700">{label}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 justify-end">
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
                  className="inline-flex h-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                >
                  Reset Filter
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowAdvancedFilters((prev) => !prev)}
                className="inline-flex h-10 items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 px-4 text-xs font-bold text-cyan-900 transition hover:border-cyan-300 hover:bg-cyan-100"
              >
                {showAdvancedFilters ? 'Sembunyikan Filter' : 'Filter Lanjutan'}
              </button>
            </div>
          </div>
        </div>

        {showAdvancedFilters && (
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

        <div className="relative z-10 rounded-[32px] border border-slate-200/70 bg-white/80 p-5 shadow-lg shadow-slate-200/10 backdrop-blur-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Ringkasan Cerdas Tahun Aktif</div>
              <h2 className="mt-2 text-xl font-extrabold text-slate-950 sm:text-2xl">Kondisi Sistem & Prioritas Tindakan</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">Insight cepat berdasarkan paket aktif, approval, risiko SDA, dan pembanding tahun sebelumnya.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">Tahun aktif: {activeYear}</span>
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusSda === 'WASPADA' ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}>{statusSda}</span>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  { label: 'Total paket tahun aktif', value: stats.total },
                  { label: 'Paket progres', value: visibleProjects.filter((project) => project.status !== 'selesai').length },
                  { label: 'Paket selesai', value: stats.selesai },
                  { label: 'Stuck / perlu tindak lanjut', value: stats.kritis + stats.warning },
                  { label: 'Approval pending', value: approvalPending },
                  { label: 'Masalah open', value: stats.openMasalah },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-slate-200/70 bg-slate-50 p-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{item.label}</div>
                    <div className="mt-3 text-2xl font-black text-slate-950">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Perbandingan 1 Tahun Sebelumnya</div>
                    <div className="text-xs text-slate-500">{hasPreviousYearStats ? `Bandingkan dengan TA ${previousYear}` : 'Data pembanding tahun sebelumnya belum tersedia lengkap.'}</div>
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">{hasPreviousYearStats ? `TA ${previousYear}` : 'Tidak lengkap'}</span>
                </div>
                {hasPreviousYearStats ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {comparisonRows.map((row) => (
                      <div key={row.label} className="rounded-3xl border border-slate-200 bg-white p-3">
                        <div className="text-xs text-slate-500">{row.label}</div>
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-xl font-black text-slate-950">{row.current}</span>
                          <span className="text-xs text-slate-500">vs {row.previous}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">Penyebab Utama</div>
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  {mainCauses.map((cause) => (
                    <div key={cause} className="rounded-2xl border border-slate-200 bg-white p-3">{cause}</div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Tindakan Per Role/User</div>
                    <div className="text-xs text-slate-500">Petunjuk fokus kerja berdasarkan peran Anda.</div>
                  </div>
                </div>
                <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-2 text-sm text-slate-700">
                  {roleActions.map((action) => (
                    <div key={`${action.role}-${action.task}`} className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{action.role}</div>
                          <div className="mt-1 font-semibold text-slate-900">{action.name}</div>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">{action.priority}</span>
                      </div>
                      <div className="mt-3 text-sm text-slate-700">{action.task}</div>
                      <Link href={action.module} className="mt-3 inline-flex text-xs font-bold text-sky-600 hover:text-sky-700">Modul terkait</Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-slate-500">Update audit terakhir: {lastAuditLabel}</div>
            <div className="flex flex-wrap gap-2">
              <Link href="/proyek" className="inline-flex h-11 items-center justify-center rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">Lihat Paket</Link>
              <Link href="/approval" className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 transition hover:border-cyan-300 hover:bg-cyan-50">Lihat Approval</Link>
              <Link href="/peta" className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 transition hover:border-cyan-300 hover:bg-cyan-50">Buka Peta</Link>
            </div>
          </div>
        </div>

        <div className="relative z-10 rounded-[32px] border border-slate-200/70 bg-white/80 p-5 shadow-lg shadow-slate-200/10 backdrop-blur-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Serapan Anggaran per Sub Kegiatan</div>
              <h2 className="mt-2 text-xl font-extrabold text-slate-950 sm:text-2xl">Rekap Serapan & Kinerja Prioritas</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">Ringkas serapan anggaran, progres fisik, dan risiko untuk sub kegiatan teratas.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">Top {subKegiatanSummaries.length || 0} Sub Kegiatan</span>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900">{subKegiatanSummaries.length ? 'Prioritas terpilih' : 'Data tidak mencukupi'}</span>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-[980px] w-full border-separate border-spacing-0 text-left text-sm text-slate-700">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.18em] text-slate-500">
                  <th className="px-3 py-3">Sub Kegiatan</th>
                  <th className="px-3 py-3">Pagu</th>
                  <th className="px-3 py-3">Kontrak</th>
                  <th className="px-3 py-3">Serapan</th>
                  <th className="px-3 py-3">Sisa</th>
                  <th className="px-3 py-3">%Serapan</th>
                  <th className="px-3 py-3">Paket</th>
                  <th className="px-3 py-3">Selesai</th>
                  <th className="px-3 py-3">Stuck</th>
                  <th className="px-3 py-3">Deviasi</th>
                  <th className="px-3 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {subKegiatanSummaries.map((row) => (
                  <tr
                    key={row.subKegiatan}
                    onClick={() => router.push(row.rowLink)}
                    onKeyDown={(event) => event.key === 'Enter' && router.push(row.rowLink)}
                    className="group cursor-pointer border-b border-slate-200 bg-white transition hover:bg-slate-50"
                    role="button"
                    tabIndex={0}
                  >
                    <td className="px-3 py-4 align-top">
                      <div className="text-sm font-semibold text-slate-900">{row.subKegiatan}</div>
                      <div className="mt-1 text-xs text-slate-500">{row.estimationLabel}</div>
                    </td>
                    <td className="px-3 py-4 font-black text-slate-900">{formatCurrency(row.totalPagu)}</td>
                    <td className="px-3 py-4 text-slate-800">{formatCurrency(row.totalKontrak)}</td>
                    <td className="px-3 py-4 text-slate-900">{formatCurrency(row.serapan)}</td>
                    <td className="px-3 py-4 text-slate-800">{formatCurrency(row.totalPagu - row.serapan)}</td>
                    <td className="px-3 py-4">
                      <div className="max-w-[120px] rounded-full bg-slate-100">
                        <div className={`h-2 rounded-full ${row.persenSerapan > 80 ? 'bg-emerald-500' : row.persenSerapan > 50 ? 'bg-amber-400' : 'bg-rose-400'}`} style={{ width: `${Math.min(100, Math.max(0, row.persenSerapan))}%` }} />
                      </div>
                      <div className="mt-1 text-xs font-semibold text-slate-700">{row.persenSerapan}%</div>
                    </td>
                    <td className="px-3 py-4 text-slate-900">{row.paketCount}</td>
                    <td className="px-3 py-4 text-emerald-700">{row.paketSelesai}</td>
                    <td className="px-3 py-4 text-rose-600">{row.paketStuck}</td>
                    <td className="px-3 py-4 text-slate-900">{row.deviasiFisikKeuangan}%</td>
                    <td className="px-3 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${row.statusSerapan === 'Aman' ? 'bg-emerald-50 text-emerald-700' : row.statusSerapan === 'Perlu Percepatan' ? 'bg-amber-50 text-amber-700' : row.statusSerapan === 'Perlu Evaluasi' ? 'bg-orange-100 text-orange-700' : 'bg-rose-50 text-rose-700'}`}>{row.statusSerapan}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">Catatan Ringkas</div>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                {subKegiatanSummaries.length > 0 ? (
                  <>
                    <p>Nilai kontrak fallback jika belum tersedia akan menggunakan anggaran sebagai dasar sementara.</p>
                    <p>Estimasi serapan dihitung berdasarkan progres keuangan saat ini.</p>
                  </>
                ) : (
                  <p className="text-slate-500">Belum ada data sub kegiatan yang memenuhi kriteria untuk ringkasan ini.</p>
                )}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">Tindakan Utama</div>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <p>Percepat review approval pending.</p>
                <p>Evaluasi paket stuck/kritis.</p>
                <p>Lengkapi dokumen kontrak, laporan, dan opname.</p>
                <p>Sinkronkan progres fisik dengan progres keuangan.</p>
                <p>Lakukan rapat evaluasi sub kegiatan prioritas.</p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-slate-500">Klik baris untuk melihat sub kegiatan di daftar paket.</div>
            <Link href="/proyek" className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 transition hover:border-cyan-300 hover:bg-cyan-50">Lihat Semua Sub Kegiatan</Link>
          </div>
        </div>

        <div className="relative z-10 rounded-3xl border border-cyan-100/80 bg-white p-3 shadow-sm">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            {DASHBOARD_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-[72px] rounded-3xl border px-3 py-3 text-left transition-all duration-300 ease-out ${activeTab === tab.id ? 'border-cyan-300 bg-gradient-to-br from-cyan-500/15 via-sky-100 to-white text-slate-950 shadow-[0_18px_40px_rgba(14,165,233,0.12)]' : 'border-slate-200/70 bg-white/80 text-slate-700 hover:border-cyan-200 hover:bg-cyan-50/70 hover:shadow-[0_12px_28px_rgba(59,130,246,0.08)]'}`}
                aria-pressed={activeTab === tab.id}
              >
                <div className="text-sm font-black leading-tight text-slate-950">{tab.label}</div>
                <div className={`mt-1 text-[11px] ${activeTab === tab.id ? 'text-slate-600' : 'text-slate-400'}`}>{tab.desc}</div>
              </button>
            ))}
          </div>
        </div>

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
          <div className="space-y-5">
            <div className="relative z-10 grid gap-3 lg:grid-cols-2">
              <div className="siaga-glass-card border border-rose-200/70">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">Warning Center</div>
                    <div className="text-xs text-slate-500">Peringatan penting</div>
                  </div>
                  <Link href="/peta" className="text-xs font-bold text-sky-600 hover:underline">Lihat Semua</Link>
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <Link href="/peta" className="flex items-center justify-between rounded-2xl border border-amber-200/70 bg-amber-50/50 p-2 text-xs hover:bg-amber-100/50">
                    <span>Pasang surut saat ini</span>
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">WASPADA</span>
                  </Link>
                  <Link href="/peta" className="flex items-center justify-between rounded-2xl border border-rose-200/70 bg-rose-50/50 p-2 text-xs hover:bg-rose-100/50">
                    <span>{stats.kritis + stats.warning} titik peringatan</span>
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700">Kritis</span>
                  </Link>
                  <Link href="/proyek" className="flex items-center justify-between rounded-2xl border border-blue-200/70 bg-blue-50/50 p-2 text-xs hover:bg-blue-100/50">
                    <span>{stats.kritis} paket kritis</span>
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">Lihat</span>
                  </Link>
                </div>
              </div>

              <div className="siaga-glass-card border border-cyan-200/70">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">Peta Monitoring</div>
                    <div className="text-xs text-slate-500">Sebaran status</div>
                  </div>
                  <Link href="/peta" className="text-xs font-bold text-sky-600 hover:underline">Buka</Link>
                </div>
                <div className="mt-4 overflow-hidden rounded-[26px] border border-cyan-200/70 bg-gradient-to-br from-cyan-100 via-slate-100 to-white p-3 shadow-soft">
                  <div className="relative h-32 overflow-hidden rounded-[22px] bg-gradient-to-br from-sky-100 via-cyan-50 to-white">
                    <div className="absolute left-5 top-6 h-3 w-3 rounded-full bg-cyan-500 shadow-[0_0_0_12px_rgba(56,189,248,0.18)]" />
                    <div className="absolute left-24 top-14 h-3 w-3 rounded-full bg-amber-400 shadow-[0_0_0_12px_rgba(251,191,36,0.16)]" />
                    <div className="absolute right-6 top-12 h-3 w-3 rounded-full bg-rose-400 shadow-[0_0_0_12px_rgba(244,63,94,0.18)]" />
                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-cyan-200/40 to-transparent" />
                  </div>
                </div>
                <div className="mt-3 grid gap-1 text-[11px] text-slate-600">
                  <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-red-500"></span>2 Kritis</div>
                  <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-500"></span>1 Waspada</div>
                  <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-sky-500"></span>2 Aman</div>
                </div>
                <Link href="/peta" className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-cyan-200/80 bg-cyan-50/50 py-2 text-xs font-bold text-slate-950 transition hover:bg-cyan-100/50">
                  Buka Peta Monitoring
                </Link>
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
                  <div className="flex h-40 items-center justify-center text-sm text-slate-400">Tidak ada data</div>
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
                      <div className="mt-0.5 text-[10px] text-slate-400">{log.userName} - {formatDateTime(log.timestamp)}</div>
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
      <Waves className="mx-auto mb-2 h-8 w-8 text-slate-400" />
      <div className="text-sm text-slate-500">{text}</div>
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
