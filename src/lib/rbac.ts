import { Role } from '@/types'

export type Permission =
  | 'view_dashboard'
  | 'view_map'
  | 'view_asset_sda'
  | 'view_peil_banjir'
  | 'view_projects'
  | 'view_reports'
  | 'view_survey'
  | 'view_issues'
  | 'view_chat'
  | 'view_announcements'
  | 'view_surat'
  | 'view_rab'
  | 'view_contracts'
  | 'view_documents'
  | 'view_approval'
  | 'view_settings'
  | 'view_profile_settings'
  | 'view_system_settings'
  | 'view_audit_log'
  | 'manage_users'
  | 'manage_admin_users'
  | 'manage_asset_sda'
  | 'manage_master_data'
  | 'manage_roles'
  | 'manage_permissions'
  | 'manage_assignments'
  | 'manage_system_settings'
  | 'manage_projects'
  | 'create_survey'
  | 'upload_rab'
  | 'approve_rab'
  | 'approve_survey'
  | 'create_laporan'
  | 'approve_laporan'
  | 'reject_item'
  | 'request_revision'
  | 'delete_laporan'
  | 'create_catatan_pengawasan'
  | 'create_masalah'
  | 'resolve_masalah'
  | 'send_chat'
  | 'delete_chat'
  | 'manage_contracts'
  | 'upload_documents'
  | 'publish_announcements'
  | 'view_keuangan'

export type PermissionDefinition = {
  key: Permission
  label: string
  category: 'Monitoring' | 'Lapangan' | 'Teknis & Kontrak' | 'Komunikasi' | 'Administrasi' | 'Keuangan'
  action: 'view' | 'create' | 'update' | 'approve' | 'delete' | 'manage' | 'upload' | 'publish'
  desc: string
}

const ALL_ROLES: Role[] = [
  'super_admin',
  'admin',
  'pejabat_pengadaan',
  'pphp',
  'admin_sub_kegiatan',
  'pptk',
  'ppk',
  'kabid',
  'direksi_teknis',
  'pimpinan',
  'tim_perencanaan',
  'tim_survey',
  'tim_pengawasan',
  'konsultan_perencana',
  'konsultan_pengawasan',
  'kontraktor',
  'auditor',
]

const READ_ALL_CORE: Role[] = ['super_admin', 'admin', 'pimpinan', 'kabid', 'ppk', 'auditor']
const FIELD_ROLES: Role[] = ['pptk', 'direksi_teknis', 'tim_pengawasan', 'konsultan_pengawasan', 'kontraktor']
const PLANNING_ROLES: Role[] = ['tim_perencanaan', 'tim_survey', 'konsultan_perencana']
const DASHBOARD_ROLES: Role[] = [...ALL_ROLES, 'admin_peil_banjir', 'tim_teknis_peil_banjir']
const SURAT_ROLES: Role[] = ['admin', 'kabid', 'pimpinan', 'ppk', 'pptk', 'auditor', 'admin_peil_banjir']
const PEIL_ROLES: Role[] = ['admin', 'kabid', 'pimpinan', 'ppk', 'pptk', 'direksi_teknis', 'auditor', 'admin_peil_banjir', 'tim_teknis_peil_banjir']

export const PERMISSION_ROLES: Record<Permission, Role[]> = {
  view_dashboard: DASHBOARD_ROLES,
  view_map: ALL_ROLES,
  view_asset_sda: ALL_ROLES,
  view_peil_banjir: PEIL_ROLES,
  view_projects: ALL_ROLES,
  view_reports: [...READ_ALL_CORE, ...FIELD_ROLES, 'admin_sub_kegiatan'],
  view_survey: [...READ_ALL_CORE, ...PLANNING_ROLES, 'pptk', 'admin_sub_kegiatan'],
  view_issues: [...READ_ALL_CORE, ...FIELD_ROLES, 'pphp', 'admin_sub_kegiatan'],
  view_chat: ALL_ROLES,
  view_announcements: ALL_ROLES,
  view_surat: SURAT_ROLES,
  view_rab: [...READ_ALL_CORE, ...PLANNING_ROLES, 'pejabat_pengadaan', 'admin_sub_kegiatan'],
  view_contracts: [...READ_ALL_CORE, 'pejabat_pengadaan', 'admin_sub_kegiatan', 'pphp'],
  view_documents: ALL_ROLES,
  view_approval: [...READ_ALL_CORE, 'pptk', 'direksi_teknis', 'tim_pengawasan', 'konsultan_pengawasan', 'pphp', 'admin_sub_kegiatan'],
  view_settings: ALL_ROLES,
  view_profile_settings: ALL_ROLES,
  view_system_settings: ['super_admin'],
  view_audit_log: ['super_admin', 'admin', 'ppk', 'pimpinan', 'kabid', 'auditor'],

  manage_users: ['super_admin', 'admin'],
  manage_admin_users: ['super_admin'],
  manage_asset_sda: ['super_admin', 'admin'],
  manage_master_data: ['super_admin', 'admin'],
  manage_roles: ['super_admin'],
  manage_permissions: ['super_admin'],
  manage_assignments: ['super_admin', 'admin'],
  manage_system_settings: ['super_admin'],
  manage_projects: ['super_admin', 'admin', 'ppk', 'pejabat_pengadaan', 'admin_sub_kegiatan'],
  create_survey: ['super_admin', 'admin', 'pptk', 'tim_perencanaan', 'tim_survey', 'konsultan_perencana'],
  upload_rab: ['super_admin', 'admin', 'tim_perencanaan', 'tim_survey', 'konsultan_perencana', 'pejabat_pengadaan'],
  approve_rab: ['super_admin', 'admin', 'ppk'],
  approve_survey: ['super_admin', 'admin', 'ppk', 'pptk', 'kabid', 'direksi_teknis'],
  create_laporan: ['super_admin', 'admin', 'pptk', 'tim_pengawasan', 'konsultan_pengawasan', 'kontraktor'],
  approve_laporan: ['super_admin', 'admin', 'ppk', 'pphp'],
  reject_item: ['super_admin', 'admin', 'ppk', 'pptk', 'kabid', 'direksi_teknis', 'pphp'],
  request_revision: ['super_admin', 'admin', 'ppk', 'pptk', 'kabid', 'direksi_teknis', 'pphp'],
  delete_laporan: ['super_admin', 'admin', 'ppk'],
  create_catatan_pengawasan: ['super_admin', 'admin', 'direksi_teknis', 'tim_pengawasan', 'konsultan_pengawasan', 'pphp'],
  create_masalah: ['super_admin', 'admin', 'pptk', 'direksi_teknis', 'tim_pengawasan', 'konsultan_pengawasan', 'pphp', 'kontraktor'],
  resolve_masalah: ['super_admin', 'admin', 'ppk', 'pptk', 'direksi_teknis'],
  send_chat: ALL_ROLES,
  delete_chat: ['super_admin', 'admin', 'ppk'],
  manage_contracts: ['super_admin', 'admin', 'ppk', 'pejabat_pengadaan', 'admin_sub_kegiatan'],
  upload_documents: ['super_admin', 'admin', 'ppk', 'pptk', 'pejabat_pengadaan', 'admin_sub_kegiatan', 'pphp'],
  publish_announcements: ['super_admin', 'admin', 'ppk'],
  view_keuangan: ['super_admin', 'admin', 'ppk', 'pimpinan', 'kabid', 'pejabat_pengadaan', 'admin_sub_kegiatan', 'auditor'],
}

export const PERMISSION_DEFINITIONS: PermissionDefinition[] = [
  { key: 'view_dashboard', label: 'Lihat Dashboard', category: 'Monitoring', action: 'view', desc: 'Membuka ringkasan monitoring sesuai role dan assignment.' },
  { key: 'view_map', label: 'Lihat Peta Monitoring', category: 'Monitoring', action: 'view', desc: 'Melihat peta dan marker proyek/survey yang berhak diakses.' },
  { key: 'view_asset_sda', label: 'Lihat Asset SDA', category: 'Monitoring', action: 'view', desc: 'Membuka modul Asset SDA sesuai role dan assignment.' },
  { key: 'view_peil_banjir', label: 'Lihat Peil Banjir', category: 'Monitoring', action: 'view', desc: 'Membuka modul rekomendasi Peil Banjir sesuai kewenangan.' },
  { key: 'view_projects', label: 'Lihat Proyek', category: 'Monitoring', action: 'view', desc: 'Melihat daftar dan detail proyek sesuai cakupan akses.' },
  { key: 'view_reports', label: 'Lihat Laporan', category: 'Lapangan', action: 'view', desc: 'Membaca laporan harian, mingguan, dan bulanan.' },
  { key: 'view_survey', label: 'Lihat Survey', category: 'Lapangan', action: 'view', desc: 'Membaca hasil survey lapangan dan rekomendasi.' },
  { key: 'view_issues', label: 'Lihat Masalah', category: 'Lapangan', action: 'view', desc: 'Melihat kendala, isu, dan status penyelesaian.' },
  { key: 'view_rab', label: 'Lihat RAB', category: 'Teknis & Kontrak', action: 'view', desc: 'Membaca RAB, bobot pekerjaan, dan status validasi.' },
  { key: 'view_contracts', label: 'Lihat Kontrak', category: 'Teknis & Kontrak', action: 'view', desc: 'Membaca informasi kontrak dan administrasi paket.' },
  { key: 'view_documents', label: 'Lihat Dokumen', category: 'Teknis & Kontrak', action: 'view', desc: 'Membaca arsip dan dokumen proyek.' },
  { key: 'view_approval', label: 'Lihat Approval Center', category: 'Administrasi', action: 'view', desc: 'Melihat daftar item pending sesuai role dan assignment.' },
  { key: 'view_chat', label: 'Lihat Chat', category: 'Komunikasi', action: 'view', desc: 'Membuka komunikasi internal proyek.' },
  { key: 'view_announcements', label: 'Lihat Pengumuman', category: 'Komunikasi', action: 'view', desc: 'Membaca pengumuman resmi sistem.' },
  { key: 'view_surat', label: 'Lihat Surat Masuk & Keluar', category: 'Komunikasi', action: 'view', desc: 'Membaca peta workflow Surat Masuk & Keluar sesuai kewenangan.' },
  { key: 'view_settings', label: 'Lihat Pengaturan', category: 'Administrasi', action: 'view', desc: 'Membuka preferensi akun dan pengaturan personal.' },
  { key: 'view_profile_settings', label: 'Lihat Pengaturan Profil', category: 'Administrasi', action: 'view', desc: 'Membaca pengaturan profil, notifikasi, tampilan, dan keamanan akun sendiri.' },
  { key: 'view_system_settings', label: 'Lihat Pengaturan Sistem', category: 'Administrasi', action: 'view', desc: 'Membaca pengaturan sistem secara terbatas tanpa aksi tulis.' },
  { key: 'view_audit_log', label: 'Lihat Audit Log', category: 'Administrasi', action: 'view', desc: 'Membaca rekam jejak aktivitas penting.' },
  { key: 'view_keuangan', label: 'Lihat Keuangan', category: 'Keuangan', action: 'view', desc: 'Membaca ringkasan nilai kontrak, pagu, dan realisasi.' },
  { key: 'manage_users', label: 'Kelola Pengguna', category: 'Administrasi', action: 'manage', desc: 'Membuat, mengubah, menonaktifkan user sesuai batas role.' },
  { key: 'manage_admin_users', label: 'Kelola Admin', category: 'Administrasi', action: 'manage', desc: 'Membuat dan mengubah akun admin. Hanya Super Admin.' },
  { key: 'manage_asset_sda', label: 'Kelola Asset SDA', category: 'Monitoring', action: 'manage', desc: 'Mengelola data Asset SDA ketika modul resmi sudah tersedia.' },
  { key: 'manage_master_data', label: 'Kelola Master Data', category: 'Administrasi', action: 'manage', desc: 'Mengelola master data sistem setelah UI dan scope resmi tersedia.' },
  { key: 'manage_roles', label: 'Kelola Role', category: 'Administrasi', action: 'manage', desc: 'Mengelola definisi role sistem. Hanya Super Admin.' },
  { key: 'manage_permissions', label: 'Kelola Permission', category: 'Administrasi', action: 'manage', desc: 'Mengelola permission granular sistem. Hanya Super Admin.' },
  { key: 'manage_assignments', label: 'Kelola Assignment', category: 'Administrasi', action: 'manage', desc: 'Mengelola penugasan user ke paket, kegiatan, atau modul sesuai kewenangan.' },
  { key: 'manage_system_settings', label: 'Kelola Pengaturan Sistem', category: 'Administrasi', action: 'manage', desc: 'Mengubah pengaturan sistem inti. Hanya Super Admin.' },
  { key: 'manage_projects', label: 'Kelola Proyek', category: 'Monitoring', action: 'manage', desc: 'Membuat, mengubah, dan mengarsipkan data proyek/paket.' },
  { key: 'create_survey', label: 'Input Survey', category: 'Lapangan', action: 'create', desc: 'Menginput survey lapangan dengan data teknis, foto, dan GPS.' },
  { key: 'upload_rab', label: 'Upload RAB', category: 'Teknis & Kontrak', action: 'upload', desc: 'Mengunggah dan memperbarui data RAB.' },
  { key: 'approve_rab', label: 'Approve RAB', category: 'Teknis & Kontrak', action: 'approve', desc: 'Menyetujui RAB secara formal.' },
  { key: 'approve_survey', label: 'Approve Survey', category: 'Lapangan', action: 'approve', desc: 'Menyetujui atau memvalidasi survey investigasi.' },
  { key: 'create_laporan', label: 'Input Laporan', category: 'Lapangan', action: 'create', desc: 'Membuat laporan lapangan harian/mingguan/bulanan.' },
  { key: 'approve_laporan', label: 'Approve Laporan', category: 'Lapangan', action: 'approve', desc: 'Menyetujui laporan yang masuk.' },
  { key: 'reject_item', label: 'Tolak Item', category: 'Administrasi', action: 'approve', desc: 'Menolak item approval sesuai kewenangan.' },
  { key: 'request_revision', label: 'Minta Revisi', category: 'Administrasi', action: 'update', desc: 'Mengembalikan item approval untuk perbaikan.' },
  { key: 'delete_laporan', label: 'Hapus Laporan', category: 'Lapangan', action: 'delete', desc: 'Menghapus laporan bila valid secara kewenangan.' },
  { key: 'create_catatan_pengawasan', label: 'Catatan Pengawasan', category: 'Lapangan', action: 'create', desc: 'Membuat catatan teknis/pengawasan lapangan.' },
  { key: 'create_masalah', label: 'Input Masalah', category: 'Lapangan', action: 'create', desc: 'Mencatat kendala proyek dan prioritas tindak lanjut.' },
  { key: 'resolve_masalah', label: 'Selesaikan Masalah', category: 'Lapangan', action: 'update', desc: 'Mengubah status kendala menjadi selesai/tertutup.' },
  { key: 'send_chat', label: 'Kirim Chat', category: 'Komunikasi', action: 'create', desc: 'Mengirim pesan pada ruang komunikasi proyek.' },
  { key: 'delete_chat', label: 'Hapus Chat', category: 'Komunikasi', action: 'delete', desc: 'Menghapus pesan sesuai kewenangan.' },
  { key: 'manage_contracts', label: 'Kelola Kontrak', category: 'Teknis & Kontrak', action: 'manage', desc: 'Mengelola data kontrak, nilai, penyedia, dan masa pelaksanaan.' },
  { key: 'upload_documents', label: 'Upload Dokumen', category: 'Teknis & Kontrak', action: 'upload', desc: 'Mengunggah dokumen resmi proyek.' },
  { key: 'publish_announcements', label: 'Buat Pengumuman', category: 'Komunikasi', action: 'publish', desc: 'Membuat pengumuman resmi untuk user terkait.' },
]

export const PAGE_PERMISSIONS: Record<string, Permission> = {
  '/dashboard': 'view_dashboard',
  '/peta': 'view_map',
  '/proyek': 'view_projects',
  '/laporan': 'view_reports',
  '/survey': 'view_survey',
  '/masalah': 'view_issues',
  '/chat': 'view_chat',
  '/pengumuman': 'view_announcements',
  '/surat': 'view_surat',
  '/rab': 'view_rab',
  '/serapan-anggaran': 'view_keuangan',
  '/kontrak': 'view_contracts',
  '/dokumen': 'view_documents',
  '/approval': 'view_approval',
  '/administrasi': 'view_contracts',
  '/peil': 'view_peil_banjir',
  '/asset': 'view_asset_sda',
  '/pengguna': 'manage_users',
  '/pengaturan': 'view_settings',
  '/audit-log': 'view_audit_log',
  '/panduan': 'view_dashboard',
}

export function hasPermission(role: Role | string | undefined, permission: Permission | string) {
  if (role === 'super_admin') return true
  const allowed = PERMISSION_ROLES[permission as Permission]
  return Boolean(role && allowed?.includes(role as Role))
}

export function canAccessPage(role: Role | string | undefined, href: string) {
  const permission = PAGE_PERMISSIONS[href] || Object.entries(PAGE_PERMISSIONS).find(([path]) => href.startsWith(`${path}/`))?.[1]
  return permission ? hasPermission(role, permission) : true
}

export function canViewAllProjects(role: Role | string | undefined) {
  return Boolean(role && READ_ALL_CORE.includes(role as Role))
}

export function canManageRole(actorRole: Role | string | undefined, targetRole: Role | string | undefined) {
  if (actorRole === 'super_admin') return true
  if (actorRole !== 'admin') return false
  return targetRole !== 'super_admin' && targetRole !== 'admin'
}
