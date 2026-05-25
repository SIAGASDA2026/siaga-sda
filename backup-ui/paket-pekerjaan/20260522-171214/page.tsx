'use client'
import { useMemo, useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Topbar } from '@/components/layout/Topbar'
import { Modal, ConfirmDialog, FormField, Input, Select, EmptyState, ActionButtons, StatusBadge } from '@/components/ui'
import { formatCurrency, getHealthBadge, getStatusLabel, formatDate, canAccess, getRoleLabel } from '@/lib/utils'
import { PROJECT_CATEGORIES, PROJECT_PACKAGE_TYPES, filterProjectsByScope, getProjectBudgetYears, getProjectCategory, getProjectCategoryLabel, getProjectPackageType, getProjectPackageTypeLabel, getProjectPrograms, getProjectSubKegiatan, getProjectWorkStage, getProjectWorkStageLabel } from '@/lib/reporting'
import { ProjectScopeFilters } from '@/components/project/ProjectScopeFilters'
import { Proyek, ProjectStatus } from '@/types'
import { AlertTriangle, Briefcase, Calendar, CheckCircle, ChevronRight, ClipboardList, Eye, Filter, FolderOpen, MapPin, Pencil, Plus, Search, TrendingDown, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const EMPTY_FORM = {
  tahun: new Date().getFullYear(),
  program: '',
  subProgram: '',
  kode: '', nama: '', lokasi: '', kecamatan: '',
  anggaran: 0, nilaiKontrak: 0,
  status: 'belum_survey' as ProjectStatus,
  kategoriPekerjaan: 'lelang',
  jenisProyek: 'fisik',
  progressFisik: 0, progressKeuangan: 0,
  tanggalMulai: '', tanggalSelesai: '',
  kontraktor: '', konsultanPerencana: '', konsultanPengawasan: '',
  pptk: '', ppk: '',
  koordinat: { lat: 1.6781, lng: 101.4473 },
  assignedUsers: [] as string[],
}

type FormData = typeof EMPTY_FORM

export default function ProyekPage() {
  const { projects, users, currentUser, addProject, updateProject, deleteProject } = useAppStore()
  const [search, setSearch] = useState('')
  const [filterHealth, setFilterHealth] = useState('all')
  const [filterKategori, setFilterKategori] = useState('all')
  const [filterJenisProyek, setFilterJenisProyek] = useState('all')
  const [filterTahap, setFilterTahap] = useState('all')
  const [filterTahun, setFilterTahun] = useState('all')
  const [filterProgram, setFilterProgram] = useState('all')
  const [filterSubKegiatan, setFilterSubKegiatan] = useState('all')
  const [filterKec, setFilterKec] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState<Proyek | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Proyek | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const kecamatanList = [...new Set(projects.map(p => p.kecamatan))]
  const canManage = canAccess(currentUser?.role || 'pptk', 'manage_projects')
  const ppkUsers = users.filter(u => u.role === 'ppk')
  const pptkUsers = users.filter(u => u.role === 'pptk')
  const kontraktorUsers = users.filter(u => u.role === 'kontraktor')
  const konsultanPerencanaUsers = users.filter(u => u.role === 'konsultan_perencana')
  const konsultanPengawasanUsers = users.filter(u => u.role === 'konsultan_pengawasan')
  const projectTeamUsers = users.filter(u => u.role !== 'super_admin')

  const budgetYears = getProjectBudgetYears(projects)
  const programs = getProjectPrograms(projects)
  const subKegiatanOptions = getProjectSubKegiatan(projects)
  const scopedProjects = filterProjectsByScope(projects, filterKategori, filterJenisProyek, filterTahap, filterTahun, filterProgram, filterSubKegiatan)
  const filtered = scopedProjects.filter(p => {
    const q = search.toLowerCase()
    const ms = p.nama.toLowerCase().includes(q) || p.kode.toLowerCase().includes(q) || (p.kontraktor || '').toLowerCase().includes(q)
    const mh = filterHealth === 'all' || p.health === filterHealth
    const mk = filterKec === 'all' || p.kecamatan === filterKec
    return ms && mh && mk
  })
  const selectedProject = useMemo(() => filtered.find((project) => project.id === selectedId) || filtered[0] || null, [filtered, selectedId])
  const paketStats = useMemo(() => {
    const fisik = filtered.filter((project) => getProjectPackageType(project) === 'fisik').length
    const konsultan = filtered.filter((project) => ['konsultan_perencanaan', 'konsultan_pengawasan'].includes(getProjectPackageType(project))).length
    const rutin = filtered.filter((project) => getProjectCategory(project) === 'rutin').length
    const deviasi = filtered.filter((project) => project.health === 'kritis' || Number(project.deviasi || 0) < -10).length
    return { total: filtered.length, fisik, konsultan, rutin, deviasi }
  }, [filtered])

  const openAdd = () => { setForm(EMPTY_FORM); setEditTarget(null); setShowForm(true) }

  const openEdit = (p: Proyek) => {
    setEditTarget(p)
    setForm({
      kode: p.kode, nama: p.nama, lokasi: p.lokasi, kecamatan: p.kecamatan,
      tahun: (p as any).tahunAnggaran || (p as any).tahun || new Date().getFullYear(),
      program: (p as any).program || '',
      subProgram: (p as any).kegiatan || (p as any).subProgram || '',
      anggaran: p.anggaran, nilaiKontrak: p.nilaiKontrak || 0,
      status: p.status, progressFisik: p.progressFisik, progressKeuangan: p.progressKeuangan,
      kategoriPekerjaan: (p as any).kategoriPekerjaan || 'lelang',
      jenisProyek: (p as any).jenisProyek || getProjectPackageType(p),
      tanggalMulai: p.tanggalMulai, tanggalSelesai: p.tanggalSelesai,
      kontraktor: p.kontraktor || '', konsultanPerencana: p.konsultanPerencana || '',
      konsultanPengawasan: p.konsultanPengawasan || '',
      pptk: p.pptk || '', ppk: p.ppk || '',
      koordinat: p.koordinat, assignedUsers: p.assignedUsers || [],
    })
    setShowForm(true)
  }

  const f = (field: keyof FormData, val: any) => setForm(prev => ({ ...prev, [field]: val }))

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

  return (
    <>
      <Topbar title="Paket Pekerjaan" subtitle={`${filtered.length} paket pada filter aktif`} />
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <main className="min-w-0 space-y-5">
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-xl font-black text-slate-900">Paket Pekerjaan</h1>
                <p className="text-sm text-slate-500">Monitoring paket, progres, deviasi, PPK, dan status approval.</p>
              </div>
              {canManage && (
                <button onClick={openAdd} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1976D2] px-4 text-sm font-extrabold text-white hover:bg-[#0D2C54]">
                  <Plus className="h-4 w-4" /> Tambah Paket
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
              <PackageStatCard icon={FolderOpen} label="Total Paket" value={paketStats.total} desc="Semua paket" tone="blue" />
              <PackageStatCard icon={Pencil} label="Fisik" value={paketStats.fisik} desc={`${((paketStats.fisik / Math.max(paketStats.total, 1)) * 100).toFixed(1)}%`} tone="blue" />
              <PackageStatCard icon={CheckCircle} label="Konsultan" value={paketStats.konsultan} desc={`${((paketStats.konsultan / Math.max(paketStats.total, 1)) * 100).toFixed(1)}%`} tone="cyan" />
              <PackageStatCard icon={Briefcase} label="Rutin" value={paketStats.rutin} desc={`${((paketStats.rutin / Math.max(paketStats.total, 1)) * 100).toFixed(1)}%`} tone="green" />
              <PackageStatCard icon={AlertTriangle} label="Deviasi / Kritis" value={paketStats.deviasi} desc={`${((paketStats.deviasi / Math.max(paketStats.total, 1)) * 100).toFixed(1)}%`} tone="red" />
            </div>
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
          total={filtered.length}
          className="mb-5"
        />

        {/* Toolbar */}
        <div className="bg-white rounded-xl border border-slate-100 p-4 mb-5 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari proyek, kode, kontraktor..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={filterHealth} onChange={e => setFilterHealth(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
            <option value="all">Semua Health</option>
            <option value="on_track">On Track</option>
            <option value="warning">Warning</option>
            <option value="kritis">Kritis</option>
          </select>
          <select value={filterKategori} onChange={e => setFilterKategori(e.target.value)}
            className="hidden border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
            <option value="all">Semua Kategori</option>
            {PROJECT_CATEGORIES.map(k => <option key={k.value} value={k.value}>{k.label}</option>)}
          </select>
          <select value={filterKec} onChange={e => setFilterKec(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
            <option value="all">Semua Kecamatan</option>
            {kecamatanList.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <span className="text-xs text-slate-400">{filtered.length} proyek</span>
          {canManage && (
            <button onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors ml-auto">
              <Plus className="w-4 h-4" /> Tambah Proyek
            </button>
          )}
        </div>

        {filtered.length > 0 && (
          <div className="hidden overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm xl:block">
            <table className="w-full text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-slate-500">Nama Paket</th>
                  <th className="px-3 py-3 text-left font-bold text-slate-500">Jenis</th>
                  <th className="px-3 py-3 text-left font-bold text-slate-500">Metode</th>
                  <th className="px-3 py-3 text-left font-bold text-slate-500">Lokasi</th>
                  <th className="px-3 py-3 text-left font-bold text-slate-500">Progress</th>
                  <th className="px-3 py-3 text-left font-bold text-slate-500">Deviasi</th>
                  <th className="px-3 py-3 text-left font-bold text-slate-500">PPK</th>
                  <th className="px-3 py-3 text-left font-bold text-slate-500">Status</th>
                  <th className="px-3 py-3 text-center font-bold text-slate-500">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((p) => {
                  const badge = getHealthBadge(p.health)
                  const isSelected = selectedProject?.id === p.id
                  return (
                    <tr key={p.id} onClick={() => setSelectedId(p.id)} className={`cursor-pointer transition ${isSelected ? 'bg-blue-50/70 ring-1 ring-inset ring-blue-500' : 'hover:bg-slate-50'}`}>
                      <td className="px-4 py-3">
                        <div className="font-extrabold text-slate-900">{p.nama}</div>
                        <div className="mt-0.5 text-[10px] font-mono text-slate-400">{p.kode}</div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase text-blue-700">{getProjectPackageTypeLabel(getProjectPackageType(p)).replace('Paket ', '')}</span>
                      </td>
                      <td className="px-3 py-3 text-slate-600">{getProjectCategoryLabel(getProjectCategory(p))}</td>
                      <td className="px-3 py-3 text-slate-600">{p.kecamatan}</td>
                      <td className="px-3 py-3">
                        <div className="mb-1 font-bold text-slate-800">{p.progressFisik}%</div>
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-[#1976D2]" style={{ width: `${p.progressFisik}%` }} />
                        </div>
                      </td>
                      <td className={`px-3 py-3 font-extrabold ${Number(p.deviasi || 0) < -10 ? 'text-red-600' : Number(p.deviasi || 0) < 0 ? 'text-amber-600' : 'text-green-600'}`}>
                        {Number(p.deviasi || 0) > 0 ? '+' : ''}{p.deviasi || 0}%
                      </td>
                      <td className="px-3 py-3 text-slate-600">{p.ppk || '-'}</td>
                      <td className="px-3 py-3">
                        <span className={`rounded-full border px-2 py-1 text-[10px] font-bold ${badge.bg} ${badge.text} ${badge.border}`}>{badge.label}</span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex justify-center gap-1">
                          <button type="button" onClick={(event) => { event.stopPropagation(); setSelectedId(p.id) }} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50" title="Lihat ringkasan">
                            <Eye className="h-4 w-4" />
                          </button>
                          {canManage && <ActionButtons onEdit={() => openEdit(p)} onDelete={() => setDeleteTarget(p)} />}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* List */}
        {filtered.length === 0 ? (
          <EmptyState icon={<FolderOpen className="w-8 h-8" />} title="Tidak ada proyek" description="Belum ada proyek yang sesuai filter" />
        ) : (
          <div className="space-y-3 xl:hidden">
            {filtered.map(p => {
              const badge = getHealthBadge(p.health)
              return (
                <div key={p.id} onClick={() => setSelectedId(p.id)} className={`cursor-pointer rounded-xl border p-4 transition-shadow hover:shadow-sm ${selectedProject?.id === p.id ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500' : 'border-slate-100 bg-white'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-slate-400">{p.kode}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>{badge.label}</span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">{getStatusLabel(p.status)}</span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">{getProjectCategoryLabel((p as any).kategoriPekerjaan)}</span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-white text-[10px] font-bold">{getProjectPackageTypeLabel(getProjectPackageType(p))}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">{getProjectWorkStageLabel(getProjectWorkStage(p))}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-800 mb-0.5">{p.nama}</h3>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="w-3 h-3" />{p.lokasi} · {p.kecamatan}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {canManage && (
                        <ActionButtons
                          onEdit={() => openEdit(p)}
                          onDelete={() => setDeleteTarget(p)}
                        />
                      )}
                      <Link href={`/proyek/${p.id}`} className="p-1.5 text-slate-400 hover:text-blue-600">
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">Fisik</span>
                        <span className="font-bold text-blue-600">{p.progressFisik}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${p.progressFisik}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">Keuangan</span>
                        <span className="font-bold text-green-600">{p.progressKeuangan}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${p.progressKeuangan}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {p.deviasi < 0 ? <TrendingDown className="w-4 h-4 text-red-500" /> : <TrendingUp className="w-4 h-4 text-green-500" />}
                      <div>
                        <div className={`text-sm font-bold ${p.deviasi < -10 ? 'text-red-600' : p.deviasi < 0 ? 'text-amber-600' : 'text-green-600'}`}>
                          {p.deviasi > 0 ? '+' : ''}{p.deviasi}%
                        </div>
                        <div className="text-[10px] text-slate-400">Deviasi</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-700">{formatCurrency(p.anggaran)}</div>
                      <div className="text-[10px] text-slate-400">Anggaran</div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-50 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(p.tanggalMulai)} – {formatDate(p.tanggalSelesai)}</span>
                    {p.kontraktor && <span>· {p.kontraktor}</span>}
                    <span className="ml-auto">PPTK: {p.pptk || '-'}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
          </main>

          <ProjectDetailPanel project={selectedProject} canManage={canManage} onEdit={openEdit} />
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)}
        title={editTarget ? 'Edit Proyek' : 'Tambah Proyek Baru'}
        subtitle={editTarget ? `Editing: ${editTarget.kode}` : 'Isi data proyek baru'}
        size="xl"
        footer={
          <div className="flex gap-3">
            <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-white font-medium">Batal</button>
            <button onClick={handleSubmit} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
              {editTarget ? 'Simpan Perubahan' : 'Tambah Proyek'}
            </button>
          </div>
        }>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Tahun Anggaran" required>
            <Input type="number" placeholder="2026" value={(form as any).tahun || new Date().getFullYear()} onChange={e => f('tahun' as any, Number(e.target.value))} />
          </FormField>
          <FormField label="Program" required>
            <Input placeholder="Program Pengelolaan SDA" value={(form as any).program || ''} onChange={e => f('program' as any, e.target.value)} />
          </FormField>
          <FormField label="Sub Program / Kegiatan" required>
            <Input placeholder="Pembangunan / Rehabilitasi Drainase" value={(form as any).subProgram || ''} onChange={e => f('subProgram' as any, e.target.value)} />
          </FormField>
          <FormField label="Kode Proyek" required>
            <Input placeholder="PU-DRN-001/2026" value={form.kode} onChange={e => f('kode', e.target.value)} />
          </FormField>
          <FormField label="Status Proyek" required>
            <Select value={form.status} onChange={e => f('status', e.target.value)}>
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
            <Select value={(form as any).kategoriPekerjaan} onChange={e => f('kategoriPekerjaan' as any, e.target.value)}>
              {PROJECT_CATEGORIES.map(k => <option key={k.value} value={k.value}>{k.label}</option>)}
            </Select>
          </FormField>
          <FormField label="Jenis Proyek" required>
            <Select value={(form as any).jenisProyek} onChange={e => f('jenisProyek' as any, e.target.value)}>
              {PROJECT_PACKAGE_TYPES.map(k => <option key={k.value} value={k.value}>{k.label}</option>)}
            </Select>
          </FormField>
          <FormField label="Nama Proyek" required className="md:col-span-2">
            <Input placeholder="Rehabilitasi Drainase Jl. Sultan Syarif Kasim" value={form.nama} onChange={e => f('nama', e.target.value)} />
          </FormField>
          <FormField label="Lokasi" required>
            <Input placeholder="Jl. Sultan Syarif Kasim, Kel. Ratu Sima" value={form.lokasi} onChange={e => f('lokasi', e.target.value)} />
          </FormField>
          <FormField label="Kecamatan" required>
            <Input placeholder="Dumai Kota" value={form.kecamatan} onChange={e => f('kecamatan', e.target.value)} list="kec-list" />
            <datalist id="kec-list">
              {['Dumai Kota','Dumai Timur','Dumai Barat','Dumai Selatan','Bukit Kapur','Medang Kampai','Sungai Sembilan'].map(k => <option key={k} value={k} />)}
            </datalist>
          </FormField>
          <FormField label="Anggaran (Rp)" required>
            <Input type="number" placeholder="2850000000" value={form.anggaran || ''} onChange={e => f('anggaran', Number(e.target.value))} />
          </FormField>
          <FormField label="Nilai Kontrak (Rp)">
            <Input type="number" placeholder="2750000000" value={form.nilaiKontrak || ''} onChange={e => f('nilaiKontrak', Number(e.target.value))} />
          </FormField>
          <FormField label="Tanggal Mulai" required>
            <Input type="date" value={form.tanggalMulai} onChange={e => f('tanggalMulai', e.target.value)} />
          </FormField>
          <FormField label="Tanggal Selesai" required>
            <Input type="date" value={form.tanggalSelesai} onChange={e => f('tanggalSelesai', e.target.value)} />
          </FormField>
          <FormField label="Progress Fisik (%)">
            <div className="flex items-center gap-3">
              <Input type="range" min={0} max={100} value={form.progressFisik} onChange={e => f('progressFisik', Number(e.target.value))} className="flex-1" />
              <span className="w-12 text-center font-bold text-blue-600 text-sm">{form.progressFisik}%</span>
            </div>
          </FormField>
          <FormField label="Progress Keuangan (%)">
            <div className="flex items-center gap-3">
              <Input type="range" min={0} max={100} value={form.progressKeuangan} onChange={e => f('progressKeuangan', Number(e.target.value))} className="flex-1" />
              <span className="w-12 text-center font-bold text-green-600 text-sm">{form.progressKeuangan}%</span>
            </div>
          </FormField>
          <FormField label="Kontraktor">
            <Select value={form.kontraktor} onChange={e => f('kontraktor', e.target.value)}>
              <option value="">Pilih kontraktor/penyedia</option>
              {kontraktorUsers.map(user => <option key={user.id} value={user.name}>{user.name}</option>)}
            </Select>
          </FormField>
          <FormField label="PPTK">
            <Select value={form.pptk} onChange={e => f('pptk', e.target.value)}>
              <option value="">Pilih PPTK</option>
              {pptkUsers.map(user => <option key={user.id} value={user.name}>{user.name}</option>)}
            </Select>
          </FormField>
          <FormField label="PPK">
            <Select value={form.ppk} onChange={e => f('ppk', e.target.value)}>
              <option value="">Pilih PPK</option>
              {ppkUsers.map(user => <option key={user.id} value={user.name}>{user.name}</option>)}
            </Select>
          </FormField>
          <FormField label="Konsultan Perencana">
            <Select value={form.konsultanPerencana} onChange={e => f('konsultanPerencana', e.target.value)}>
              <option value="">Pilih konsultan perencana</option>
              {konsultanPerencanaUsers.map(user => <option key={user.id} value={user.name}>{user.name}</option>)}
            </Select>
          </FormField>
          <FormField label="Konsultan Pengawasan">
            <Select value={form.konsultanPengawasan} onChange={e => f('konsultanPengawasan', e.target.value)}>
              <option value="">Pilih konsultan pengawasan</option>
              {konsultanPengawasanUsers.map(user => <option key={user.id} value={user.name}>{user.name}</option>)}
            </Select>
          </FormField>
          <FormField label="Personil Terlibat" hint="Dipilih dari data pengguna yang dibuat admin" className="md:col-span-2">
            <div className="grid max-h-44 grid-cols-1 gap-2 overflow-y-auto rounded-xl border border-slate-200 p-3 md:grid-cols-2">
              {projectTeamUsers.map(user => (
                <label key={user.id} className="flex cursor-pointer items-center gap-2 rounded-lg p-2 text-xs hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={form.assignedUsers.includes(user.id)}
                    onChange={e => f('assignedUsers', e.target.checked ? [...form.assignedUsers, user.id] : form.assignedUsers.filter(id => id !== user.id))}
                  />
                  <span className="font-medium text-slate-700">{user.name}</span>
                  <span className="ml-auto text-[10px] text-slate-400">{getRoleLabel(user.role)}</span>
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
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Hapus Proyek?" message={`Proyek "${deleteTarget?.nama}" dan semua data terkait akan dihapus permanen.`} />
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
  tone: 'blue' | 'cyan' | 'green' | 'red'
}) {
  const toneClass = {
    blue: 'bg-blue-50 text-blue-700',
    cyan: 'bg-cyan-50 text-cyan-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
  }[tone]

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] font-bold text-slate-500">{label}</div>
          <div className="text-2xl font-black leading-tight text-slate-900">{value}</div>
          <div className="text-[10px] text-slate-400">{desc}</div>
        </div>
      </div>
    </div>
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
      <aside className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-400 xl:sticky xl:top-20 xl:h-fit">
        Pilih paket untuk melihat detail.
      </aside>
    )
  }

  const badge = getHealthBadge(project.health)
  const packageType = getProjectPackageTypeLabel(getProjectPackageType(project))
  const category = getProjectCategoryLabel(getProjectCategory(project))
  const docs = [
    { label: 'Dokumen Kontrak', status: project.kontraktor ? 'Lengkap' : 'Belum lengkap' },
    { label: 'Rencana Kerja (RKK)', status: project.rabList.length > 0 ? 'Lengkap' : 'Belum tersedia' },
    { label: 'Jadwal Pelaksanaan', status: project.tanggalMulai && project.tanggalSelesai ? 'Lengkap' : 'Belum tersedia' },
    { label: 'Laporan Mingguan Terakhir', status: project.laporanHarian.length > 0 ? 'Tersedia' : 'Belum ada' },
    { label: 'Berita Acara Pembayaran', status: project.progressKeuangan > 0 ? 'Tersedia' : 'Belum ada' },
  ]

  return (
    <aside className="space-y-4 xl:sticky xl:top-20 xl:h-fit">
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base font-black leading-tight text-slate-900">{project.nama}</h2>
            <div className="mt-1 text-xs font-mono text-slate-400">{project.kode}</div>
          </div>
          <span className={`rounded-full border px-2 py-1 text-[10px] font-bold ${badge.bg} ${badge.text} ${badge.border}`}>{badge.label}</span>
        </div>

        <div className="mt-4 border-b border-slate-100">
          <div className="flex gap-4 text-xs font-bold">
            <span className="border-b-2 border-[#1976D2] pb-2 text-[#1976D2]">Informasi</span>
            <span className="pb-2 text-slate-400">Kontrak</span>
            <span className="pb-2 text-slate-400">Laporan</span>
            <span className="pb-2 text-slate-400">Administrasi</span>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-xs">
          <InfoRow label="Metode Pengadaan" value={category} />
          <InfoRow label="Jenis Paket" value={packageType} />
          <InfoRow label="Lokasi" value={`${project.kecamatan} - ${project.lokasi}`} />
          <InfoRow label="Progress Fisik" value={`${project.progressFisik}%`} progress={project.progressFisik} />
          <InfoRow label="Deviasi" value={`${Number(project.deviasi || 0) > 0 ? '+' : ''}${project.deviasi || 0}%`} tone={Number(project.deviasi || 0) < 0 ? 'red' : 'green'} />
          <InfoRow label="Nilai Kontrak" value={formatCurrency(project.nilaiKontrak || project.anggaran)} />
          <InfoRow label="PPK" value={project.ppk || '-'} />
          <InfoRow label="PPTK" value={project.pptk || '-'} />
          <InfoRow label="Kontraktor" value={project.kontraktor || '-'} />
          <InfoRow label="Status Approval" value={project.rabList.some((rab) => rab.status !== 'approved') ? 'Menunggu Approval' : 'Berjalan'} tone={project.rabList.some((rab) => rab.status !== 'approved') ? 'amber' : 'green'} />
        </div>

        <div className="mt-5 rounded-xl border border-slate-100 p-3">
          <div className="mb-2 text-xs font-black text-slate-800">Dokumen / Checklist Utama</div>
          <div className="space-y-2">
            {docs.map((doc) => (
              <div key={doc.label} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2">
                <div className="flex min-w-0 items-center gap-2">
                  <ClipboardList className="h-4 w-4 flex-shrink-0 text-[#1976D2]" />
                  <span className="truncate text-xs font-semibold text-slate-700">{doc.label}</span>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${doc.status === 'Lengkap' || doc.status === 'Tersedia' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>{doc.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2">
          <Link href={`/proyek/${project.id}`} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1976D2] px-4 text-sm font-extrabold text-white hover:bg-[#0D2C54]">
            <Eye className="h-4 w-4" /> Buka Detail Paket
          </Link>
          {canManage && (
            <button type="button" onClick={() => onEdit(project)} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-600 hover:bg-slate-50">
              <Pencil className="h-4 w-4" /> Edit Paket
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}

function InfoRow({ label, value, progress, tone }: { label: string; value: string; progress?: number; tone?: 'red' | 'green' | 'amber' }) {
  const color = tone === 'red' ? 'text-red-600' : tone === 'green' ? 'text-green-600' : tone === 'amber' ? 'text-amber-600' : 'text-slate-800'
  return (
    <div className="grid grid-cols-[120px_1fr] gap-2">
      <div className="font-semibold text-slate-500">{label}</div>
      <div className={`min-w-0 font-bold ${color}`}>
        {value}
        {progress !== undefined && (
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-[#1976D2]" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    </div>
  )
}
