import type { Role } from '@/types'

export type WorkflowRoute =
  | '/surat'
  | '/survey'
  | '/proyek'
  | '/peil'
  | '/approval'
  | '/dashboard'
  | '/audit-log'
  | '/administrasi'
  | '/dokumen'

export type WorkflowActionMeta = {
  label: string
  color: string
  icon: string
}

export const SURAT_STATUS_FLOW = [
  'Draft',
  'Surat Masuk',
  'Dibaca',
  'Disposisi Kabid',
  'Perlu Survey',
  'Perlu Paket',
  'Perlu Approval',
  'Diteruskan ke Peil Banjir',
  'Ditindaklanjuti',
  'Selesai',
  'Arsip',
  'Ditolak',
] as const

export const SURAT_CATEGORIES = [
  'Undangan rapat',
  'Usulan warga',
  'Laporan banjir',
  'Drainase',
  'Normalisasi',
  'Peil banjir',
  'Pekerjaan rutin',
  'Paket pekerjaan',
  'Administrasi umum',
] as const

export const SURAT_FOLLOW_UP_ROUTES: ReadonlyArray<{
  label: string
  href: WorkflowRoute
  description: string
}> = [
  { label: 'Survey Investigasi', href: '/survey', description: 'Surat/usulan membutuhkan cek lapangan dan rekomendasi teknis.' },
  { label: 'Paket Pekerjaan', href: '/proyek', description: 'Surat menjadi kandidat paket fisik, rutin, atau konsultan.' },
  { label: 'Peil Banjir', href: '/peil', description: 'Permohonan atau laporan terkait elevasi muka air.' },
  { label: 'Approval Center', href: '/approval', description: 'Tindak lanjut membutuhkan persetujuan formal.' },
  { label: 'Dashboard/Rekap', href: '/dashboard', description: 'Rekap status surat tampil di command center jika data resmi tersedia.' },
  { label: 'Audit Log', href: '/audit-log', description: 'Jejak disposisi dan tindak lanjut dicatat untuk audit.' },
]

export const SURAT_PREPARATION_BADGE = {
  label: 'Tahap Persiapan',
  description: 'Modul Surat resmi masih tahap persiapan. Tampilan ini adalah peta workflow dan belum menulis data ke database.',
} as const

export const SURAT_WORKFLOW_STEPS: ReadonlyArray<{
  id: string
  label: string
  description: string
  target: string
}> = [
  { id: 'incoming', label: 'Surat Masuk', description: 'Surat/usulan diterima dan diklasifikasikan.', target: 'Surat Masuk & Keluar' },
  { id: 'read', label: 'Dibaca', description: 'Petugas berwenang membaca dan memeriksa kelengkapan.', target: 'Surat Masuk & Keluar' },
  { id: 'disposition', label: 'Disposisi Kabid', description: 'Kabid/unit terkait menetapkan arah tindak lanjut.', target: 'Surat Masuk & Keluar' },
  { id: 'follow-up', label: 'Tindak Lanjut', description: 'Surat diarahkan ke survey, paket, peil, approval, atau arsip.', target: 'Modul Tujuan' },
  { id: 'destination', label: 'Survey / Paket / Peil / Approval / Arsip', description: 'Data tetap dapat ditelusuri ke surat asal.', target: 'Tab Tujuan' },
  { id: 'recap', label: 'Dashboard / Audit Log', description: 'Status masuk rekap dan jejak audit bila data resmi tersedia.', target: 'Rekap & Audit' },
]

export const SURAT_FOLLOW_UP_ACTIONS: ReadonlyArray<{
  id: string
  label: string
  href: WorkflowRoute
  status: string
  description: string
}> = [
  { id: 'to-survey', label: 'Lanjut ke Survey Investigasi', href: '/survey', status: 'Perlu Survey', description: 'Dipakai saat surat/usulan membutuhkan pemeriksaan lapangan.' },
  { id: 'to-project', label: 'Lanjut ke Paket Pekerjaan', href: '/proyek', status: 'Perlu Paket', description: 'Dipakai saat surat menjadi kandidat paket fisik, rutin, atau konsultan.' },
  { id: 'to-peil', label: 'Lanjut ke Peil Banjir', href: '/peil', status: 'Diteruskan ke Peil Banjir', description: 'Dipakai untuk permohonan atau laporan terkait elevasi muka air.' },
  { id: 'to-approval', label: 'Lanjut ke Approval Center', href: '/approval', status: 'Perlu Approval', description: 'Dipakai jika keputusan tindak lanjut membutuhkan persetujuan formal.' },
  { id: 'archive', label: 'Arsipkan', href: '/surat', status: 'Arsip', description: 'Dipakai jika surat selesai, ditolak, atau tidak perlu tindak lanjut lanjutan.' },
  { id: 'to-dashboard', label: 'Masuk Rekap Dashboard', href: '/dashboard', status: 'Ditindaklanjuti', description: 'Rekap tampil setelah data resmi tersedia dan terhubung.' },
  { id: 'to-audit-log', label: 'Tercatat di Audit Log', href: '/audit-log', status: 'Jejak Audit', description: 'Jejak disposisi/tindak lanjut masuk audit saat backend surat tersedia.' },
]

export const SURAT_CONCEPT_DEMO_ITEMS = [
  {
    id: 'surat-drainase-demo',
    title: 'Usulan perbaikan drainase lingkungan-demo',
    category: 'Drainase',
    status: 'Perlu Survey',
    nextStep: 'Lanjut ke Survey Investigasi',
  },
  {
    id: 'surat-peil-demo',
    title: 'Permohonan rekomendasi peil banjir-demo',
    category: 'Peil banjir',
    status: 'Diteruskan ke Peil Banjir',
    nextStep: 'Lanjut ke Peil Banjir',
  },
] as const

export const SURVEY_STATUS_LABELS = {
  draft: 'Draft Survey',
  submitted: 'Menunggu Tindak Lanjut',
  approved: 'Direkomendasikan',
  rejected: 'Ditolak',
} as const

export const SURVEY_STATUS_DESCRIPTIONS = {
  draft: 'Data survey belum dikirim sebagai rekomendasi.',
  submitted: 'Survey sudah masuk dan menunggu pemeriksaan/tindak lanjut.',
  approved: 'Survey sudah direkomendasikan untuk tindak lanjut.',
  rejected: 'Survey ditolak atau tidak dilanjutkan.',
} as const

export const SURVEY_FOLLOW_UP_FLOW = [
  'Survey -> Paket Pekerjaan',
  'Survey -> Approval Center',
  'Survey -> Arsip',
  'Survey -> Dashboard/Rekap',
  'Survey -> Audit Log',
] as const

export const PACKAGE_SOURCE_MAPPING = [
  'Surat Masuk',
  'Survey Investigasi',
  'Input langsung admin/PPK/PPTK',
  'Program rutin',
  'Paket tahun berjalan',
] as const

export const PACKAGE_DESTINATION_MAPPING = [
  'Approval Center',
  'Administrasi',
  'Dokumen',
  'Dokumentasi Foto',
  'Laporan',
  'Audit Log',
  'Dashboard',
] as const

export const PACKAGE_SOURCE_EMPTY_STATE = {
  title: 'Sumber asal paket belum terhubung secara formal.',
  description: 'Nantinya paket dapat berasal dari Surat Masuk, Survey Investigasi, input langsung Admin/PPK/PPTK, Program Rutin, atau Paket Tahun Berjalan.',
} as const

export const PACKAGE_SOURCE_ORIGIN_OPTIONS: ReadonlyArray<{
  label: string
  description: string
  href: WorkflowRoute
}> = [
  { label: 'Surat Masuk', description: 'Paket berasal dari surat/usulan yang sudah didisposisi.', href: '/surat' },
  { label: 'Survey Investigasi', description: 'Paket berasal dari rekomendasi survey lapangan.', href: '/survey' },
  { label: 'Input langsung Admin/PPK/PPTK', description: 'Paket dibuat langsung oleh role teknis berwenang.', href: '/proyek' },
  { label: 'Program Rutin', description: 'Paket berasal dari rencana pemeliharaan atau kegiatan rutin.', href: '/proyek' },
  { label: 'Paket Tahun Berjalan', description: 'Paket merupakan bagian dari rencana tahun anggaran aktif.', href: '/proyek' },
]

export const PACKAGE_TRACEABILITY_TARGETS: ReadonlyArray<{
  label: string
  description: string
  href: WorkflowRoute | null
  status: 'route' | 'internal' | 'concept'
}> = [
  { label: 'Approval Center', description: 'Persetujuan formal paket, RAB, laporan, atau dokumen.', href: '/approval', status: 'route' },
  { label: 'Administrasi', description: 'Kontrak, addendum, dokumen administrasi, dan pembayaran.', href: null, status: 'concept' },
  { label: 'Dokumen', description: 'Dokumen berada pada tab/detail internal paket atau route Dokumen bila tersedia.', href: null, status: 'concept' },
  { label: 'Dokumentasi Foto', description: 'Foto lapangan berada pada survey, laporan, pengawasan, atau masalah dalam detail paket.', href: null, status: 'internal' },
  { label: 'Laporan', description: 'Laporan harian/mingguan/bulanan berada pada tab internal detail paket atau route Laporan.', href: null, status: 'internal' },
  { label: 'Audit Log', description: 'Jejak perubahan penting paket dan approval.', href: '/audit-log', status: 'route' },
  { label: 'Dashboard', description: 'Rekap paket, progress, deviasi, dan risiko.', href: '/dashboard', status: 'route' },
]

export const APPROVAL_STATUS_MAPPING = [
  'Pending',
  'Approved',
  'Revision Requested',
  'Rejected',
  'Commented',
] as const

export const WORKFLOW_AUDIT_ACTION_META: Record<string, WorkflowActionMeta> = {
  SURAT_CREATE: { label: 'Surat Dibuat', color: 'bg-blue-100 text-blue-700', icon: 'MAIL' },
  SURAT_READ: { label: 'Surat Dibaca', color: 'bg-slate-100 text-slate-700', icon: 'READ' },
  SURAT_DISPOSISI: { label: 'Disposisi Surat', color: 'bg-cyan-100 text-cyan-700', icon: 'DISP' },
  SURAT_TINDAK_LANJUT: { label: 'Tindak Lanjut Surat', color: 'bg-emerald-100 text-emerald-700', icon: 'FLOW' },
  SURAT_ARCHIVE: { label: 'Surat Diarsipkan', color: 'bg-slate-100 text-slate-700', icon: 'ARS' },
  SURVEY_RECOMMEND_TO_PACKAGE: { label: 'Survey ke Paket', color: 'bg-teal-100 text-teal-700', icon: 'PKT' },
  SURVEY_RECOMMEND_TO_APPROVAL: { label: 'Survey ke Approval', color: 'bg-amber-100 text-amber-700', icon: 'APR' },
  PROJECT_CREATE: { label: 'Paket Dibuat', color: 'bg-green-100 text-green-700', icon: 'PKT' },
  PROJECT_UPDATE: { label: 'Paket Diubah', color: 'bg-blue-100 text-blue-700', icon: 'EDIT' },
  PROJECT_STATUS_UPDATE: { label: 'Status Paket Diubah', color: 'bg-indigo-100 text-indigo-700', icon: 'STAT' },
  PROJECT_ADD_DOCUMENT: { label: 'Dokumen Paket Ditambah', color: 'bg-purple-100 text-purple-700', icon: 'DOC' },
  PROJECT_ADD_PHOTO: { label: 'Foto Paket Ditambah', color: 'bg-cyan-100 text-cyan-700', icon: 'FOTO' },
}

export const WORKFLOW_ROLE_ACTIONS: ReadonlyArray<{
  role: string
  frontendRole: Role | null
  allowedConcept: string
}> = [
  { role: 'admin_bidang', frontendRole: 'admin', allowedConcept: 'Kelola data bidang, surat, survey, paket, monitoring, dan user bidang.' },
  { role: 'admin_sub_kegiatan', frontendRole: 'admin_sub_kegiatan', allowedConcept: 'Kelola paket, administrasi, dokumen, kontrak, dan rekap sesuai sub kegiatan.' },
  { role: 'kabid', frontendRole: 'kabid', allowedConcept: 'Monitoring bidang, disposisi/approval sesuai kewenangan, dan dashboard bidang.' },
  { role: 'pimpinan', frontendRole: 'pimpinan', allowedConcept: 'Read-only luas untuk dashboard, approval status, risiko, dan ringkasan strategis.' },
  { role: 'ppk', frontendRole: 'ppk', allowedConcept: 'Paket, approval, RAB, laporan, masalah, dokumen, dan monitoring sesuai kewenangan.' },
  { role: 'pptk', frontendRole: 'pptk', allowedConcept: 'Paket, laporan lapangan, monitoring, masalah, dan approval pendamping.' },
  { role: 'direksi_teknis', frontendRole: 'direksi_teknis', allowedConcept: 'Monitoring teknis, progres, laporan, masalah, dan paket yang ditugaskan.' },
  { role: 'tim_perencanaan', frontendRole: 'tim_perencanaan', allowedConcept: 'Survey, RAB/gambar, dan rekomendasi perencanaan.' },
  { role: 'tim_pengawasan', frontendRole: 'tim_pengawasan', allowedConcept: 'Laporan, masalah, progres, dan pengawasan rutin.' },
  { role: 'konsultan_perencana', frontendRole: 'konsultan_perencana', allowedConcept: 'Survey/perencanaan dan dokumen perencanaan sesuai paket.' },
  { role: 'konsultan_pengawasan', frontendRole: 'konsultan_pengawasan', allowedConcept: 'Laporan pengawasan, progres, masalah, dan dokumen pengawasan.' },
  { role: 'pejabat_pengadaan', frontendRole: 'pejabat_pengadaan', allowedConcept: 'Paket pengadaan, dokumen tender/PL, dan status pengadaan.' },
  { role: 'admin_surat', frontendRole: null, allowedConcept: 'Perlu tahap role extension sebelum dipakai sebagai role aktif.' },
  { role: 'admin_peil_banjir', frontendRole: null, allowedConcept: 'Perlu tahap role extension sebelum dipakai sebagai role aktif.' },
  { role: 'mandor_pintu_air', frontendRole: null, allowedConcept: 'Perlu tahap role extension dan assignment asset/operasional.' },
  { role: 'petugas_pintu_air', frontendRole: null, allowedConcept: 'Petugas biasa belum wajib login; jangan dipaksakan.' },
  { role: 'mandor_rehabilitasi_drainase', frontendRole: null, allowedConcept: 'Perlu tahap role extension dan assignment operasional.' },
  { role: 'auditor', frontendRole: 'auditor', allowedConcept: 'Read-only audit trail, dokumen, dashboard, dan laporan sesuai kebutuhan audit.' },
]

export function getSurveyWorkflowLabel(status: string | undefined) {
  return SURVEY_STATUS_LABELS[status as keyof typeof SURVEY_STATUS_LABELS] || status || 'Status tidak diketahui'
}

export function getSurveyWorkflowDescription(status: string | undefined) {
  return SURVEY_STATUS_DESCRIPTIONS[status as keyof typeof SURVEY_STATUS_DESCRIPTIONS] || 'Status survey belum dipetakan.'
}
