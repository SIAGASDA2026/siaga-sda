'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { useAppStore } from '@/store/useAppStore'
import { Topbar } from '@/components/layout/Topbar'
import { SubfeatureEntryPoints } from '@/components/navigation/SubfeatureEntryPoints'
import { Modal, ConfirmDialog, FormField, Input, Select, EmptyState, ActionButtons } from '@/components/ui'
import { formatCurrency, getStatusLabel, formatDate, canAccess, getRoleLabel } from '@/lib/utils'
import { getProjectComputedBadge, getProjectComputedHealth, getProjectComputedStatus } from '@/lib/project-status'
import {
  PROJECT_CATEGORIES,
  PROJECT_PACKAGE_TYPES,
  PROJECT_WORK_STAGES,
  filterProjectsByScope,
  getProjectBudgetYear,
  getProjectBudgetYears,
  getProjectCategory,
  getProjectCategoryLabel,
  getProjectPackageType,
  getProjectPackageTypeLabel,
  getProjectPrograms,
  getProjectSubKegiatan,
  getProjectWorkStage,
  getProjectWorkStageLabel,
} from '@/lib/reporting'
import { Proyek, ProjectStatus } from '@/types'
import { getScopedProjects } from '@/lib/dashboard-scope'
import {
  AlertTriangle,
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Eye,
  FileText,
  FolderOpen,
  MapPin,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Settings2,
  TrendingDown,
  TrendingUp,
  UserRound,
  WalletCards,
  Waves,
  X,
} from 'lucide-react'

const EMPTY_FORM = {
  tahun: new Date().getFullYear(),
  program: '',
  subProgram: '',
  kode: '',
  nama: '',
  lokasi: '',
  kecamatan: '',
  anggaran: 0,
  nilaiKontrak: 0,
  status: 'belum_survey' as ProjectStatus,
  kategoriPekerjaan: 'lelang',
  jenisProyek: 'fisik',
  progressFisik: 0,
  progressKeuangan: 0,
  tanggalMulai: '',
  tanggalSelesai: '',
  kontraktor: '',
  konsultanPerencana: '',
  konsultanPengawasan: '',
  pptk: '',
  ppk: '',
  koordinat: { lat: 1.6781, lng: 101.4473 },
  assignedUsers: [] as string[],
}

type FormData = typeof EMPTY_FORM
type QuickType = 'all' | 'fisik' | 'konsultan' | 'rutin'

export default function ProyekPage() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.toString()
  const { projects, users, currentUser, addProject, updateProject, deleteProject } = useAppStore()
  const [search, setSearch] = useState('')
  const [quickType, setQuickType] = useState<QuickType>(() => {
    const value = searchParams.get('jenis_paket')
    return value === 'fisik' || value === 'konsultan' || value === 'rutin' ? value : 'all'
  })
  const [filterHealth, setFilterHealth] = useState(() => searchParams.get('health') || searchParams.get('deviasi_status') || 'all')
  const [filterKategori, setFilterKategori] = useState(() => searchParams.get('metode_pengadaan') || 'all')
  const [filterJenisProyek, setFilterJenisProyek] = useState(() => searchParams.get('sub_jenis_paket') || 'all')
  const [filterTahap, setFilterTahap] = useState('all')
  const [filterTahun, setFilterTahun] = useState(() => searchParams.get('tahun') || 'all')
  const [filterProgram, setFilterProgram] = useState('all')
  const [filterSubKegiatan, setFilterSubKegiatan] = useState(() => searchParams.get('sub_kegiatan_id') || 'all')
  const [filterKec, setFilterKec] = useState('all')
  const [filterStatus, setFilterStatus] = useState(() => searchParams.get('status') || 'all')
  const [filterMasalah, setFilterMasalah] = useState(() => searchParams.get('masalah') || 'all')
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState<Proyek | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Proyek | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(searchQuery)
    const packageType = params.get('jenis_paket')
    setQuickType(packageType === 'fisik' || packageType === 'konsultan' || packageType === 'rutin' ? packageType : 'all')
    setFilterHealth(params.get('health') || params.get('deviasi_status') || 'all')
    setFilterKategori(params.get('metode_pengadaan') || 'all')
    setFilterJenisProyek(params.get('sub_jenis_paket') || 'all')
    setFilterTahun(params.get('tahun') || 'all')
    setFilterSubKegiatan(params.get('sub_kegiatan_id') || 'all')
    setFilterStatus(params.get('status') || 'all')
    setFilterMasalah(params.get('masalah') || 'all')
  }, [searchQuery])

  const canManage = canAccess(currentUser?.role || 'pptk', 'manage_projects')
  const ppkUsers = users.filter((user) => user.role === 'ppk')
  const pptkUsers = users.filter((user) => user.role === 'pptk')
  const kontraktorUsers = users.filter((user) => user.role === 'kontraktor')
  const konsultanPerencanaUsers = users.filter((user) => user.role === 'konsultan_perencana')
  const konsultanPengawasanUsers = users.filter((user) => user.role === 'konsultan_pengawasan')
  const projectTeamUsers = users.filter((user) => user.role !== 'super_admin')

  const assignmentScopedProjects = useMemo(() => getScopedProjects(projects, currentUser), [currentUser, projects])
  const budgetYears = getProjectBudgetYears(assignmentScopedProjects)
  const programs = getProjectPrograms(assignmentScopedProjects)
  const subKegiatanOptions = getProjectSubKegiatan(assignmentScopedProjects)
  const kecamatanList = [...new Set(assignmentScopedProjects.map((project) => project.kecamatan).filter(Boolean))]

  const scopedProjects = useMemo(
    () => filterProjectsByScope(assignmentScopedProjects, filterKategori, filterJenisProyek, filterTahap, filterTahun, filterProgram, filterSubKegiatan),
    [assignmentScopedProjects, filterKategori, filterJenisProyek, filterTahap, filterTahun, filterProgram, filterSubKegiatan]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()

    return scopedProjects.filter((project) => {
      const packageType = getProjectPackageType(project)
      const projectCategory = getProjectCategory(project)
      const matchQuick =
        quickType === 'all' ||
        (quickType === 'fisik' && packageType === 'fisik') ||
        (quickType === 'konsultan' && ['konsultan_perencanaan', 'konsultan_pengawasan'].includes(packageType)) ||
        (quickType === 'rutin' && projectCategory === 'rutin')
      const matchSearch =
        !q ||
        [project.nama, project.kode, project.lokasi, project.kecamatan, project.kontraktor, project.ppk, project.pptk, (project as any).program, (project as any).subKegiatan]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(q)
      const matchHealth = filterHealth === 'all' || getProjectComputedHealth(project) === filterHealth
      const matchKec = filterKec === 'all' || project.kecamatan === filterKec
      const matchStatus =
        filterStatus === 'all' ||
        (filterStatus === 'aktif' ? project.status !== 'selesai' : project.status === filterStatus)
      const matchMasalah =
        filterMasalah === 'all' ||
        (filterMasalah === 'open' && project.masalah.some((item) => item.status === 'open'))

      return matchQuick && matchSearch && matchHealth && matchKec && matchStatus && matchMasalah
    })
  }, [filterHealth, filterKec, filterMasalah, filterStatus, quickType, scopedProjects, search])

  const selectedProject = useMemo(() => filtered.find((project) => project.id === selectedId) || filtered[0] || null, [filtered, selectedId])

  const healthLabelMap: Record<string, string> = {
    on_track: 'On Track',
    warning: 'Warning',
    kritis: 'Kritis',
  }

  const activeFilterLabels = [
    filterKategori !== 'all' ? `Metode: ${getProjectCategoryLabel(filterKategori)}` : null,
    filterJenisProyek !== 'all' ? `Jenis Paket: ${getProjectPackageTypeLabel(filterJenisProyek)}` : null,
    filterTahap !== 'all' ? `Tahap: ${getProjectWorkStageLabel(filterTahap)}` : null,
    filterTahun !== 'all' ? `Tahun: ${filterTahun}` : null,
    filterProgram !== 'all' ? `Program: ${filterProgram}` : null,
    filterSubKegiatan !== 'all' ? `Sub Kegiatan: ${filterSubKegiatan}` : null,
    filterHealth !== 'all' ? `Status: ${healthLabelMap[filterHealth] || filterHealth}` : null,
    filterStatus !== 'all' ? `Status Paket: ${filterStatus}` : null,
    filterMasalah !== 'all' ? `Masalah: ${filterMasalah}` : null,
    filterKec !== 'all' ? `Kecamatan: ${filterKec}` : null,
    searchParams.get('source_module') ? `Sumber: ${searchParams.get('source_module')}` : null,
  ].filter(Boolean)

  const paketStats = useMemo(() => {
    const total = filtered.length
    const fisik = filtered.filter((project) => getProjectPackageType(project) === 'fisik').length
    const konsultan = filtered.filter((project) => ['konsultan_perencanaan', 'konsultan_pengawasan'].includes(getProjectPackageType(project))).length
    const rutin = filtered.filter((project) => getProjectCategory(project) === 'rutin').length
    const terlambat = filtered.filter((project) => {
      const status = getProjectComputedStatus(project)
      return status.isLate || status.isAtRisk || status.health === 'kritis'
    }).length
    const selesai = filtered.filter((project) => getProjectComputedStatus(project).isCompleted).length
    const berjalan = filtered.filter((project) => project.status !== 'selesai').length
    const avgFisik = total ? Math.round(filtered.reduce((sum, project) => sum + Number(project.progressFisik || 0), 0) / total) : 0
    const nilaiKontrak = filtered.reduce((sum, project) => sum + Number(project.nilaiKontrak || project.anggaran || 0), 0)

    return { total, fisik, konsultan, rutin, terlambat, selesai, berjalan, avgFisik, nilaiKontrak }
  }, [filtered])

  const openAdd = () => {
    setForm(EMPTY_FORM)
    setEditTarget(null)
    setShowForm(true)
  }

  const openEdit = (project: Proyek) => {
    setEditTarget(project)
    setForm({
      kode: project.kode,
      nama: project.nama,
      lokasi: project.lokasi,
      kecamatan: project.kecamatan,
      tahun: (project as any).tahunAnggaran || (project as any).tahun || new Date().getFullYear(),
      program: (project as any).program || '',
      subProgram: (project as any).kegiatan || (project as any).subProgram || '',
      anggaran: project.anggaran,
      nilaiKontrak: project.nilaiKontrak || 0,
      status: project.status,
      progressFisik: project.progressFisik,
      progressKeuangan: project.progressKeuangan,
      kategoriPekerjaan: (project as any).kategoriPekerjaan || 'lelang',
      jenisProyek: (project as any).jenisProyek || getProjectPackageType(project),
      tanggalMulai: project.tanggalMulai,
      tanggalSelesai: project.tanggalSelesai,
      kontraktor: project.kontraktor || '',
      konsultanPerencana: project.konsultanPerencana || '',
      konsultanPengawasan: project.konsultanPengawasan || '',
      pptk: project.pptk || '',
      ppk: project.ppk || '',
      koordinat: project.koordinat || EMPTY_FORM.koordinat,
      assignedUsers: project.assignedUsers || [],
    })
    setShowForm(true)
  }

  const f = (field: keyof FormData, val: any) => setForm((prev) => ({ ...prev, [field]: val }))

  const handleSubmit = () => {
    if (!form.kode || !form.nama || !form.lokasi || !form.kecamatan) return toast.error('Kode, nama, lokasi, kecamatan wajib diisi')
    if (!form.tanggalMulai || !form.tanggalSelesai) return toast.error('Tanggal mulai dan selesai wajib diisi')
    if (form.anggaran <= 0) return toast.error('Anggaran harus lebih dari 0')

    if (editTarget) {
      updateProject(editTarget.id, form)
      toast.success('Proyek berhasil diperbarui')
    } else {
      addProject(form)
      toast.success('Proyek berhasil ditambahkan')
    }
    setShowForm(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteProject(deleteTarget.id)
      toast.success('Proyek berhasil dihapus dari database')
      setDeleteTarget(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menghapus proyek')
    }
  }

  const resetFilters = () => {
    setSearch('')
    setQuickType('all')
    setFilterHealth('all')
    setFilterKategori('all')
    setFilterJenisProyek('all')
    setFilterTahap('all')
    setFilterTahun('all')
    setFilterProgram('all')
    setFilterSubKegiatan('all')
    setFilterKec('all')
    setFilterStatus('all')
    setFilterMasalah('all')
  }

  return (
    <>
      <Topbar title="Paket Pekerjaan" subtitle="Kelola dan pantau seluruh paket pekerjaan Bidang Sumber Daya Air" />
      <div className="siaga-page-canvas min-h-[calc(100vh-56px)] p-3 pb-24 sm:p-5">
        <div className="mx-auto max-w-[1680px] space-y-4">
          <section className="siaga-section-canvas p-4 md:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-700">
                  <Waves className="h-4 w-4" />
                  SIAGA-SDA Package Workspace
                </div>
                <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950 md:text-3xl">Paket Pekerjaan</h1>
                <p className="mt-1 max-w-2xl text-sm text-slate-500">
                  Monitoring paket, kontrak, progres fisik/keuangan, penyedia, jadwal, deviasi, dan kelengkapan administrasi.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="siaga-card-compact px-4 py-3">
                  <div className="text-[11px] font-bold uppercase text-slate-400">Nilai kontrak aktif</div>
                  <div className="text-lg font-black text-slate-900">{formatCurrency(paketStats.nilaiKontrak)}</div>
                </div>
                {canManage && (
                  <button onClick={openAdd} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:bg-[#0D2C54]">
                    <Plus className="h-4 w-4" />
                    Tambah Paket
                  </button>
                )}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
              <PackageStatCard icon={BriefcaseBusiness} label="Total Paket" value={paketStats.total} desc="Semua paket" tone="blue" />
              <PackageStatCard icon={FolderOpen} label="Fisik" value={paketStats.fisik} desc={`${percentOf(paketStats.fisik, paketStats.total)}% dari total`} tone="green" />
              <PackageStatCard icon={UserRound} label="Konsultan" value={paketStats.konsultan} desc={`${percentOf(paketStats.konsultan, paketStats.total)}% dari total`} tone="cyan" />
              <PackageStatCard icon={CalendarDays} label="Rutin" value={paketStats.rutin} desc={`${percentOf(paketStats.rutin, paketStats.total)}% dari total`} tone="amber" />
              <PackageStatCard icon={AlertTriangle} label="Deviasi" value={paketStats.terlambat} desc="Paket perlu perhatian" tone="red" />
              <PackageStatCard icon={CheckCircle2} label="Selesai" value={paketStats.selesai} desc={`${paketStats.avgFisik}% progres rata-rata`} tone="sky" />
            </div>
          </section>

          <SubfeatureEntryPoints parentId="projects" title="Ruang Kerja Paket" />

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_360px]">
            <main className="min-w-0 space-y-4">
              <section className="siaga-filter-canvas p-4 md:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Filter Paket Pekerjaan</div>
                    <p className="mt-2 max-w-2xl text-sm text-slate-500">Cari, sortir, dan latih filter sesuai metodologi, status, tahun, program, dan lokasi.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-black uppercase tracking-wide text-slate-500">{filtered.length} paket</span>
                    <button type="button" onClick={resetFilters} className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-blue-100 bg-blue-50 px-4 text-sm font-black text-blue-700 transition hover:bg-blue-100">
                      <RotateCcw className="h-4 w-4" />
                      Reset Filter
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 xl:grid-cols-[minmax(360px,1fr)_1fr]">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Cari paket pekerjaan, kode, lokasi, penyedia..."
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'all', label: 'Semua' },
                      { key: 'fisik', label: 'Fisik' },
                      { key: 'konsultan', label: 'Konsultan' },
                      { key: 'rutin', label: 'Rutin' },
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setQuickType(item.key as QuickType)}
                        className={`rounded-full border px-4 py-2 text-sm font-black transition ${
                          quickType === item.key
                            ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-100'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-cyan-200 hover:bg-cyan-50'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <FilterSelect label="Metode" value={filterKategori} onChange={setFilterKategori}>
                    <option value="all">Semua Metode</option>
                    {PROJECT_CATEGORIES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </FilterSelect>
                  <FilterSelect label="Jenis Paket" value={filterJenisProyek} onChange={setFilterJenisProyek}>
                    <option value="all">Semua Jenis Paket</option>
                    {PROJECT_PACKAGE_TYPES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </FilterSelect>
                  <FilterSelect label="Tahap" value={filterTahap} onChange={setFilterTahap}>
                    <option value="all">Semua Tahap</option>
                    {PROJECT_WORK_STAGES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </FilterSelect>
                  <FilterSelect label="Status" value={filterHealth} onChange={setFilterHealth}>
                    <option value="all">Semua Status</option>
                    <option value="on_track">On Track</option>
                    <option value="warning">Warning</option>
                    <option value="kritis">Kritis</option>
                  </FilterSelect>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <FilterSelect label="Tahun" value={filterTahun} onChange={setFilterTahun}>
                    <option value="all">Semua Tahun</option>
                    {budgetYears.map((year) => <option key={year} value={year}>{year}</option>)}
                  </FilterSelect>
                  <FilterSelect label="Kecamatan" value={filterKec} onChange={setFilterKec}>
                    <option value="all">Semua Kecamatan</option>
                    {kecamatanList.map((item) => <option key={item} value={item}>{item}</option>)}
                  </FilterSelect>
                  <FilterSelect label="Program" value={filterProgram} onChange={setFilterProgram}>
                    <option value="all">Semua Program</option>
                    {programs.map((item) => <option key={item} value={item}>{item}</option>)}
                  </FilterSelect>
                  <FilterSelect label="Sub Kegiatan" value={filterSubKegiatan} onChange={setFilterSubKegiatan}>
                    <option value="all">Semua Sub Kegiatan</option>
                    {subKegiatanOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                  </FilterSelect>
                </div>

                {activeFilterLabels.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                    {activeFilterLabels.map((label) => (
                      <span key={label} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-slate-500">{label}</span>
                    ))}
                  </div>
                )}
              </section>

              {filtered.length > 0 ? (
                <>
                  <section className="siaga-table-canvas hidden xl:block">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50/90">
                        <tr>
                          <TableHead>Kode Paket</TableHead>
                          <TableHead>Nama Paket</TableHead>
                          <TableHead>Jenis</TableHead>
                          <TableHead>Metode</TableHead>
                          <TableHead>Lokasi</TableHead>
                          <TableHead>Progress Fisik</TableHead>
                          <TableHead>Deviasi</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>PPK</TableHead>
                          <TableHead>PPTK</TableHead>
                          <TableHead align="center">Aksi</TableHead>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filtered.map((project) => (
                          <PackageTableRow
                            key={project.id}
                            project={project}
                            canManage={canManage}
                            active={selectedProject?.id === project.id}
                            onSelect={() => setSelectedId(project.id)}
                            onEdit={openEdit}
                            onDelete={setDeleteTarget}
                          />
                        ))}
                      </tbody>
                    </table>
                    <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
                      <span>Menampilkan 1 - {filtered.length} dari {filtered.length} data</span>
                      <div className="flex items-center gap-2">
                        <button className="rounded-xl border border-slate-200 px-3 py-2 font-bold text-slate-400" disabled>Prev</button>
                        <span className="rounded-xl bg-blue-600 px-3 py-2 font-black text-white">1</span>
                        <button className="rounded-xl border border-slate-200 px-3 py-2 font-bold text-slate-400" disabled>Next</button>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-3 xl:hidden 2xl:hidden">
                    {filtered.map((project) => (
                      <MobilePackageCard
                        key={project.id}
                        project={project}
                        canManage={canManage}
                        active={selectedProject?.id === project.id}
                        onSelect={() => setSelectedId(project.id)}
                        onEdit={openEdit}
                        onDelete={setDeleteTarget}
                      />
                    ))}
                  </section>
                </>
              ) : (
                <EmptyState icon={<FolderOpen className="h-8 w-8" />} title="Belum ada data untuk filter ini" description="Silakan ubah filter atau tambah data sesuai kewenangan Anda." />
              )}
            </main>

            <ProjectDetailPanel project={selectedProject} canManage={canManage} onEdit={openEdit} />
          </div>
        </div>
      </div>

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editTarget ? 'Edit Proyek' : 'Tambah Proyek Baru'}
        subtitle={editTarget ? `Editing: ${editTarget.kode}` : 'Isi data proyek baru'}
        size="xl"
        footer={
          <div className="flex gap-3">
            <button onClick={() => setShowForm(false)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-white">Batal</button>
            <button onClick={handleSubmit} className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
              {editTarget ? 'Simpan Perubahan' : 'Tambah Proyek'}
            </button>
          </div>
        }
      >
        <ProjectForm
          form={form}
          f={f}
          ppkUsers={ppkUsers}
          pptkUsers={pptkUsers}
          kontraktorUsers={kontraktorUsers}
          konsultanPerencanaUsers={konsultanPerencanaUsers}
          konsultanPengawasanUsers={konsultanPengawasanUsers}
          projectTeamUsers={projectTeamUsers}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Hapus Proyek?"
        message={`Proyek "${deleteTarget?.nama}" dan semua data terkait akan dihapus permanen.`}
      />
    </>
  )
}

function PackageStatCard({
  icon: Icon,
  label,
  value,
  desc,
  tone,
}: {
  icon: any
  label: string
  value: number
  desc: string
  tone: 'blue' | 'cyan' | 'green' | 'red' | 'amber' | 'sky'
}) {
  const toneClass = {
    blue: 'bg-blue-50 text-blue-700',
    cyan: 'bg-cyan-50 text-cyan-700',
    green: 'bg-emerald-50 text-emerald-700',
    red: 'bg-red-50 text-red-700',
    amber: 'bg-amber-50 text-amber-700',
    sky: 'bg-sky-50 text-sky-700',
  }[tone]
  const cardToneClass = {
    blue: 'siaga-card-info',
    cyan: 'siaga-card-recommendation',
    green: 'siaga-card-success',
    red: 'siaga-card-critical',
    amber: 'siaga-card-warning',
    sky: 'siaga-card-success',
  }[tone]

  return (
    <div className={`siaga-card-compact p-4 ${cardToneClass}`}>
      <div className="flex items-center gap-3">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${toneClass}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] font-black text-slate-500">{label}</div>
          <div className="text-2xl font-black leading-tight text-slate-950">{value}</div>
          <div className="truncate text-[10px] text-slate-400">{desc}</div>
        </div>
      </div>
    </div>
  )
}

function FilterSelect({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-black uppercase tracking-wide text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100"
      >
        {children}
      </select>
    </label>
  )
}

function TableHead({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'center' }) {
  return <th className={`px-2.5 py-3 text-${align} text-[10px] font-black uppercase tracking-wide text-slate-400`}>{children}</th>
}

function PackageTableRow({
  project,
  canManage,
  active,
  onSelect,
  onEdit,
  onDelete,
}: {
  project: Proyek
  canManage: boolean
  active: boolean
  onSelect: () => void
  onEdit: (project: Proyek) => void
  onDelete: (project: Proyek) => void
}) {
  const badge = getProjectComputedBadge(project)
  const deviasi = Number(project.deviasi || 0)

  return (
    <tr onClick={onSelect} className={`cursor-pointer transition ${active ? 'bg-blue-50/80 shadow-[inset_3px_0_0_#2563eb]' : 'hover:bg-slate-50'}`}>
      <td className="px-2.5 py-3 font-mono text-[10px] font-black text-blue-700">{project.kode}</td>
      <td className="px-2.5 py-3">
        <div className="max-w-[220px] text-[11px] font-black leading-snug text-slate-900">{project.nama}</div>
        <div className="mt-1 text-[11px] text-slate-400">{project.tanggalMulai ? formatDate(project.tanggalMulai) : '-'} - {project.tanggalSelesai ? formatDate(project.tanggalSelesai) : '-'}</div>
      </td>
      <td className="px-2.5 py-3">
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase text-blue-700">{getProjectPackageTypeLabel(getProjectPackageType(project)).replace('Paket ', '')}</span>
      </td>
      <td className="px-2.5 py-3 text-[11px] text-slate-600">{getProjectCategoryLabel(getProjectCategory(project))}</td>
      <td className="px-2.5 py-3 text-[11px] text-slate-600">{project.kecamatan}</td>
      <td className="px-2.5 py-3">
        <ProgressMeter value={project.progressFisik} />
      </td>
      <td className={`px-2.5 py-3 text-[11px] font-black ${deviasi < -10 ? 'text-red-600' : deviasi < 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
        {deviasi > 0 ? '+' : ''}{deviasi}%
      </td>
      <td className="px-2.5 py-3">
        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black ${badge.bg} ${badge.text} ${badge.border}`}>{badge.label}</span>
      </td>
      <td className="px-2.5 py-3 text-[11px] text-slate-600">{project.ppk || '-'}</td>
      <td className="px-2.5 py-3 text-[11px] text-slate-600">{project.pptk || '-'}</td>
      <td className="px-2.5 py-3">
        <div className="flex justify-center gap-1">
          <button type="button" onClick={(event) => { event.stopPropagation(); onSelect() }} className="rounded-xl p-2 text-blue-600 hover:bg-blue-50" title="Lihat ringkasan">
            <Eye className="h-4 w-4" />
          </button>
          {canManage && <ActionButtons small onEdit={() => onEdit(project)} onDelete={() => onDelete(project)} />}
        </div>
      </td>
    </tr>
  )
}

function MobilePackageCard({
  project,
  canManage,
  active,
  onSelect,
  onEdit,
  onDelete,
}: {
  project: Proyek
  canManage: boolean
  active: boolean
  onSelect: () => void
  onEdit: (project: Proyek) => void
  onDelete: (project: Proyek) => void
}) {
  const badge = getProjectComputedBadge(project)
  const deviasi = Number(project.deviasi || 0)

  return (
    <article onClick={onSelect} className={`siaga-card-interactive p-4 ${project.health === 'kritis' ? 'siaga-card-critical' : project.health === 'warning' ? 'siaga-card-warning' : project.status === 'selesai' ? 'siaga-card-success' : 'siaga-card-info'} ${active ? 'ring-2 ring-blue-100' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
          <Waves className="h-7 w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="line-clamp-2 text-base font-black leading-snug text-slate-900">{project.nama}</h3>
              <div className="mt-1 text-xs font-mono text-slate-400">Kode: {project.kode}</div>
            </div>
            <span className={`shrink-0 rounded-xl border px-2 py-1 text-[10px] font-black ${badge.bg} ${badge.text} ${badge.border}`}>{badge.label}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1"><ClipboardList className="h-3.5 w-3.5" />{getProjectPackageTypeLabel(getProjectPackageType(project)).replace('Paket ', '')}</span>
            <span className="inline-flex items-center gap-1"><Settings2 className="h-3.5 w-3.5" />{getProjectCategoryLabel(getProjectCategory(project))}</span>
            <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{project.kecamatan}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_92px] gap-4">
        <div>
          <div className="mb-1 flex justify-between text-xs">
            <span className="font-bold text-slate-500">Progress</span>
            <span className="font-black text-blue-700">{project.progressFisik}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.min(100, Math.max(0, project.progressFisik))}%` }} />
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-slate-500">Deviasi</div>
          <div className={`text-lg font-black ${deviasi < -10 ? 'text-red-600' : deviasi < 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {deviasi > 0 ? '+' : ''}{deviasi}%
          </div>
        </div>
      </div>

      {active && (
        <div className="siaga-card-neutral mt-4 p-3">
          <div className="grid gap-2 text-xs">
            <CompactInfo icon={UserRound} label="PPK" value={project.ppk || '-'} />
            <CompactInfo icon={UserRound} label="PPTK" value={project.pptk || '-'} />
            <CompactInfo icon={BriefcaseBusiness} label="Penyedia" value={project.kontraktor || '-'} />
            <CompactInfo icon={WalletCards} label="Nilai Kontrak" value={formatCurrency(project.nilaiKontrak || project.anggaran)} />
            <CompactInfo icon={CalendarDays} label="Jadwal" value={`${formatDate(project.tanggalMulai)} - ${formatDate(project.tanggalSelesai)}`} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link href={`/proyek/${project.id}?from=paket`} className="siaga-card-interactive siaga-card-info inline-flex h-11 items-center justify-center gap-2 text-sm font-black text-blue-700">
              <FileText className="h-4 w-4" />
              Buka Detail
            </Link>
            <Link href={`/laporan?proyek=${project.id}&from=paket`} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-black text-white">
              <BarChart3 className="h-4 w-4" />
              Monitoring
            </Link>
            <Link href={`/peta?proyek=${project.id}&from=paket`} className="siaga-card-interactive siaga-card-recommendation col-span-2 inline-flex h-11 items-center justify-center gap-2 text-sm font-black text-cyan-700">
              <MapPin className="h-4 w-4" />
              Lihat di Peta Monitoring
            </Link>
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="text-xs text-slate-400">Tahap: <span className="font-bold text-slate-600">{getProjectWorkStageLabel(getProjectWorkStage(project))}</span></div>
        <div className="flex items-center gap-2">
          {canManage && <ActionButtons onEdit={() => onEdit(project)} onDelete={() => onDelete(project)} />}
          <ChevronRight className={`h-5 w-5 text-slate-300 transition ${active ? 'rotate-90 text-blue-600' : ''}`} />
        </div>
      </div>
    </article>
  )
}

function ProjectDetailPanel({
  project,
  canManage,
  onEdit,
}: {
  project: Proyek | null
  canManage: boolean
  onEdit: (project: Proyek) => void
}) {
  if (!project) {
    return (
      <aside className="siaga-empty-canvas p-6 text-center text-sm text-slate-500 xl:sticky xl:top-20 xl:h-fit">
        Pilih paket untuk melihat detail.
      </aside>
    )
  }

  const computedStatus = getProjectComputedStatus(project)
  const badge = getProjectComputedBadge(project)
  const packageType = getProjectPackageTypeLabel(getProjectPackageType(project))
  const category = getProjectCategoryLabel(getProjectCategory(project))
  const deviasi = Number(project.deviasi || 0)
  const docs = [
    { label: 'Kontrak', status: project.kontraktor ? 'Selesai' : 'Belum', tone: project.kontraktor ? 'green' : 'amber' },
    { label: 'RAB / Rencana Kerja', status: project.rabList.length > 0 ? 'Selesai' : 'Belum', tone: project.rabList.length > 0 ? 'green' : 'amber' },
    { label: 'Laporan', status: project.laporanHarian.length > 0 ? 'Dalam Proses' : 'Belum', tone: project.laporanHarian.length > 0 ? 'amber' : 'slate' },
    { label: 'Pembayaran / Termin', status: project.progressKeuangan > 0 ? 'Dalam Proses' : 'Belum', tone: project.progressKeuangan > 0 ? 'amber' : 'slate' },
    { label: 'PHO / FHO', status: project.status === 'selesai' ? 'Selesai' : 'Belum', tone: project.status === 'selesai' ? 'green' : 'slate' },
  ] as const

  return (
    <aside className="space-y-4 xl:sticky xl:top-20 xl:h-fit">
      <div className={`siaga-card p-5 ${deviasi < -10 ? 'siaga-card-critical' : deviasi < 0 ? 'siaga-card-warning' : project.status === 'selesai' ? 'siaga-card-success' : 'siaga-card-info'}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-black text-blue-700">{project.kode}</div>
            <h2 className="mt-2 text-xl font-black leading-tight text-slate-950">{project.nama}</h2>
          </div>
          <button type="button" className="rounded-xl border border-slate-200 p-2 text-slate-400 xl:hidden">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className={`rounded-full border px-2.5 py-1 text-[11px] font-black ${badge.bg} ${badge.text} ${badge.border}`}>{badge.label}</span>
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-black text-blue-700">{packageType}</span>
          <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-[11px] font-black text-cyan-700">{category}</span>
        </div>
        <p className="siaga-card-compact siaga-card-neutral mt-3 px-3 py-2 text-xs leading-5 text-slate-600">
          Status sinkron: <span className="font-black text-slate-900">{computedStatus.label}</span>. {computedStatus.reason}
        </p>

        <div className="mt-5 space-y-3">
          <ProgressLine label="Progress Fisik" value={project.progressFisik} color="bg-blue-600" />
          <ProgressLine label="Progress Keuangan" value={project.progressKeuangan} color="bg-emerald-500" />
          <div className={`siaga-card-compact p-3 ${deviasi < -10 ? 'siaga-card-critical' : deviasi < 0 ? 'siaga-card-warning' : 'siaga-card-success'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Deviasi / Rencana</span>
              <span className={`flex items-center gap-1 text-sm font-black ${deviasi < -10 ? 'text-red-600' : deviasi < 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {deviasi < 0 ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                {deviasi > 0 ? '+' : ''}{deviasi}%
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-2 border-t border-slate-100 pt-4 text-xs">
          <InfoRow label="Lokasi" value={`${project.kecamatan} - ${project.lokasi}`} />
          <InfoRow label="PPK" value={project.ppk || '-'} />
          <InfoRow label="PPTK" value={project.pptk || '-'} />
          <InfoRow label="Metode" value={category} />
          <InfoRow label="Sumber Dana" value={`APBD Kota Dumai TA ${getProjectBudgetYear(project) || '-'}`} />
          <InfoRow label="Nilai Kontrak" value={formatCurrency(project.nilaiKontrak || project.anggaran)} />
          <InfoRow label="Tanggal Kontrak" value={project.tanggalMulai ? formatDate(project.tanggalMulai) : '-'} />
          <InfoRow label="Selesai Pekerjaan" value={project.tanggalSelesai ? formatDate(project.tanggalSelesai) : '-'} />
        </div>

        <div className="siaga-card-recommendation mt-5 p-3">
          <div className="mb-3 text-xs font-black text-slate-900">Checklist Dokumen & Administrasi</div>
          <div className="space-y-2">
            {docs.map((doc) => (
              <div key={doc.label} className={`siaga-card-compact flex items-center justify-between gap-3 px-3 py-2 ${doc.tone === 'green' ? 'siaga-card-success' : doc.tone === 'amber' ? 'siaga-card-warning' : 'siaga-card-neutral'}`}>
                <div className="flex min-w-0 items-center gap-2">
                  <ClipboardCheck className="h-4 w-4 shrink-0 text-blue-600" />
                  <span className="truncate text-xs font-bold text-slate-700">{doc.label}</span>
                </div>
                <span className={`rounded-full px-2 py-1 text-[10px] font-black ${doc.tone === 'green' ? 'bg-emerald-50 text-emerald-700' : doc.tone === 'amber' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-1">
          <Link href={`/proyek/${project.id}?from=paket`} className="siaga-card-interactive siaga-card-info inline-flex h-11 items-center justify-center gap-2 px-4 text-sm font-black text-blue-700">
            <FileText className="h-4 w-4" />
            Buka Detail
          </Link>
          <Link href={`/dokumen?proyek=${project.id}&from=paket`} className="siaga-card-interactive siaga-card-neutral inline-flex h-11 items-center justify-center gap-2 px-4 text-sm font-black text-slate-700">
            <ClipboardList className="h-4 w-4" />
            Lihat Dokumen
          </Link>
          <Link href={`/laporan?proyek=${project.id}&from=paket`} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-black text-white shadow-lg shadow-blue-200 hover:bg-[#0D2C54]">
            <BarChart3 className="h-4 w-4" />
            Monitoring
          </Link>
          <Link href={`/peta?proyek=${project.id}&from=paket`} className="siaga-card-interactive siaga-card-recommendation inline-flex h-11 items-center justify-center gap-2 px-4 text-sm font-black text-cyan-700">
            <MapPin className="h-4 w-4" />
            Lihat di Peta
          </Link>
          {canManage && (
            <button type="button" onClick={() => onEdit(project)} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-black text-slate-600 hover:bg-slate-50 sm:col-span-2 lg:col-span-4 xl:col-span-1">
              <Pencil className="h-4 w-4" />
              Edit Paket
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}

function ProjectForm({
  form,
  f,
  ppkUsers,
  pptkUsers,
  kontraktorUsers,
  konsultanPerencanaUsers,
  konsultanPengawasanUsers,
  projectTeamUsers,
}: {
  form: FormData
  f: (field: keyof FormData, val: any) => void
  ppkUsers: Array<{ id: string; name: string; role: string }>
  pptkUsers: Array<{ id: string; name: string; role: string }>
  kontraktorUsers: Array<{ id: string; name: string; role: string }>
  konsultanPerencanaUsers: Array<{ id: string; name: string; role: string }>
  konsultanPengawasanUsers: Array<{ id: string; name: string; role: string }>
  projectTeamUsers: Array<{ id: string; name: string; role: string }>
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormField label="Tahun Anggaran" required>
        <Input type="number" placeholder="2026" value={(form as any).tahun || new Date().getFullYear()} onChange={(event) => f('tahun' as any, Number(event.target.value))} />
      </FormField>
      <FormField label="Program" required>
        <Input placeholder="Program Pengelolaan SDA" value={(form as any).program || ''} onChange={(event) => f('program' as any, event.target.value)} />
      </FormField>
      <FormField label="Sub Program / Kegiatan" required>
        <Input placeholder="Pembangunan / Rehabilitasi Drainase" value={(form as any).subProgram || ''} onChange={(event) => f('subProgram' as any, event.target.value)} />
      </FormField>
      <FormField label="Kode Proyek" required>
        <Input placeholder="PU-DRN-001/2026" value={form.kode} onChange={(event) => f('kode', event.target.value)} />
      </FormField>
      <FormField label="Status Proyek" required>
        <Select value={form.status} onChange={(event) => f('status', event.target.value)}>
          <option value="belum_survey">Belum Survey</option>
          <option value="sudah_survey">Sudah Survey</option>
          <option value="rab_disusun">RAB Disusun</option>
          <option value="siap_dilaksanakan">Siap Dilaksanakan</option>
          <option value="pelaksanaan">Pelaksanaan</option>
          <option value="monitoring">Monitoring</option>
          <option value="selesai">Selesai</option>
        </Select>
      </FormField>
      <FormField label="Metode Pengadaan" required>
        <Select value={(form as any).kategoriPekerjaan} onChange={(event) => f('kategoriPekerjaan' as any, event.target.value)}>
          {PROJECT_CATEGORIES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </Select>
      </FormField>
      <FormField label="Jenis Proyek" required>
        <Select value={(form as any).jenisProyek} onChange={(event) => f('jenisProyek' as any, event.target.value)}>
          {PROJECT_PACKAGE_TYPES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </Select>
      </FormField>
      <FormField label="Nama Proyek" required className="md:col-span-2">
        <Input placeholder="Rehabilitasi Drainase Jl. Sultan Syarif Kasim" value={form.nama} onChange={(event) => f('nama', event.target.value)} />
      </FormField>
      <FormField label="Lokasi" required>
        <Input placeholder="Jl. Sultan Syarif Kasim, Kel. Ratu Sima" value={form.lokasi} onChange={(event) => f('lokasi', event.target.value)} />
      </FormField>
      <FormField label="Kecamatan" required>
        <Input placeholder="Dumai Kota" value={form.kecamatan} onChange={(event) => f('kecamatan', event.target.value)} list="kec-list" />
        <datalist id="kec-list">
          {['Dumai Kota', 'Dumai Timur', 'Dumai Barat', 'Dumai Selatan', 'Bukit Kapur', 'Medang Kampai', 'Sungai Sembilan'].map((item) => <option key={item} value={item} />)}
        </datalist>
      </FormField>
      <FormField label="Anggaran (Rp)" required>
        <Input type="number" placeholder="2850000000" value={form.anggaran || ''} onChange={(event) => f('anggaran', Number(event.target.value))} />
      </FormField>
      <FormField label="Nilai Kontrak (Rp)">
        <Input type="number" placeholder="2750000000" value={form.nilaiKontrak || ''} onChange={(event) => f('nilaiKontrak', Number(event.target.value))} />
      </FormField>
      <FormField label="Tanggal Mulai" required>
        <Input type="date" value={form.tanggalMulai} onChange={(event) => f('tanggalMulai', event.target.value)} />
      </FormField>
      <FormField label="Tanggal Selesai" required>
        <Input type="date" value={form.tanggalSelesai} onChange={(event) => f('tanggalSelesai', event.target.value)} />
      </FormField>
      <FormField label="Progress Fisik (%)">
        <div className="flex items-center gap-3">
          <Input type="range" min={0} max={100} value={form.progressFisik} onChange={(event) => f('progressFisik', Number(event.target.value))} className="flex-1" />
          <span className="w-12 text-center text-sm font-bold text-blue-600">{form.progressFisik}%</span>
        </div>
      </FormField>
      <FormField label="Progress Keuangan (%)">
        <div className="flex items-center gap-3">
          <Input type="range" min={0} max={100} value={form.progressKeuangan} onChange={(event) => f('progressKeuangan', Number(event.target.value))} className="flex-1" />
          <span className="w-12 text-center text-sm font-bold text-green-600">{form.progressKeuangan}%</span>
        </div>
      </FormField>
      <FormField label="Kontraktor">
        <Select value={form.kontraktor} onChange={(event) => f('kontraktor', event.target.value)}>
          <option value="">Pilih kontraktor/penyedia</option>
          {kontraktorUsers.map((user) => <option key={user.id} value={user.name}>{user.name}</option>)}
        </Select>
      </FormField>
      <FormField label="PPTK">
        <Select value={form.pptk} onChange={(event) => f('pptk', event.target.value)}>
          <option value="">Pilih PPTK</option>
          {pptkUsers.map((user) => <option key={user.id} value={user.name}>{user.name}</option>)}
        </Select>
      </FormField>
      <FormField label="PPK">
        <Select value={form.ppk} onChange={(event) => f('ppk', event.target.value)}>
          <option value="">Pilih PPK</option>
          {ppkUsers.map((user) => <option key={user.id} value={user.name}>{user.name}</option>)}
        </Select>
      </FormField>
      <FormField label="Konsultan Perencana">
        <Select value={form.konsultanPerencana} onChange={(event) => f('konsultanPerencana', event.target.value)}>
          <option value="">Pilih konsultan perencana</option>
          {konsultanPerencanaUsers.map((user) => <option key={user.id} value={user.name}>{user.name}</option>)}
        </Select>
      </FormField>
      <FormField label="Konsultan Pengawasan">
        <Select value={form.konsultanPengawasan} onChange={(event) => f('konsultanPengawasan', event.target.value)}>
          <option value="">Pilih konsultan pengawasan</option>
          {konsultanPengawasanUsers.map((user) => <option key={user.id} value={user.name}>{user.name}</option>)}
        </Select>
      </FormField>
      <FormField label="Personil Terlibat" hint="Dipilih dari data pengguna yang dibuat admin" className="md:col-span-2">
        <div className="grid max-h-44 grid-cols-1 gap-2 overflow-y-auto rounded-xl border border-slate-200 p-3 md:grid-cols-2">
          {projectTeamUsers.map((user) => (
            <label key={user.id} className="flex cursor-pointer items-center gap-2 rounded-lg p-2 text-xs hover:bg-slate-50">
              <input
                type="checkbox"
                checked={form.assignedUsers.includes(user.id)}
                onChange={(event) => f('assignedUsers', event.target.checked ? [...form.assignedUsers, user.id] : form.assignedUsers.filter((id) => id !== user.id))}
              />
              <span className="font-medium text-slate-700">{user.name}</span>
              <span className="ml-auto text-[10px] text-slate-400">{getRoleLabel(user.role as any)}</span>
            </label>
          ))}
        </div>
      </FormField>
      <FormField label="Koordinat Lapangan" hint="Diisi otomatis dari GPS saat PPTK melakukan survey/laporan di lapangan" className="md:col-span-2">
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
          Titik koordinat tidak diinput manual oleh admin.
        </div>
      </FormField>
    </div>
  )
}

function ProgressMeter({ value }: { value: number }) {
  return (
    <div className="min-w-[86px]">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="font-black text-slate-800">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  )
}

function ProgressLine({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-xs">
        <span className="font-bold text-slate-500">{label}</span>
        <span className="font-black text-slate-900">{value}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[116px_minmax(0,1fr)] gap-3">
      <span className="font-semibold text-slate-400">{label}</span>
      <span className="min-w-0 text-right font-black text-slate-700">{value}</span>
    </div>
  )
}

function CompactInfo({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="grid grid-cols-[22px_80px_minmax(0,1fr)] items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 text-blue-700" />
      <span className="font-bold text-slate-500">{label}</span>
      <span className="min-w-0 text-right font-black text-slate-700">{value}</span>
    </div>
  )
}

function percentOf(value: number, total: number) {
  return ((value / Math.max(total, 1)) * 100).toFixed(1)
}
