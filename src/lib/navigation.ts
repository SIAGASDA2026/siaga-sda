export type NavigationGroupId = 'monitoring' | 'paket-administrasi' | 'sda-sistem'

export type NavigationIconKey =
  | 'dashboard'
  | 'map'
  | 'survey'
  | 'projects'
  | 'approval'
  | 'letters'
  | 'administration'
  | 'flood-level'
  | 'assets'
  | 'audit'
  | 'settings'

export type NavigationSubItem = {
  id: string
  label: string
  description: string
  href: string
  routeKey: string
}

export type MainNavigationItem = {
  id: string
  label: string
  shortLabel?: string
  description: string
  href: string
  routeKey: string
  iconKey: NavigationIconKey
  group: NavigationGroupId
  desktopInclude: boolean
  mobileInclude: boolean
  mobileBottomInclude?: boolean
  children?: readonly NavigationSubItem[]
}

export const NAVIGATION_GROUPS: ReadonlyArray<{ id: NavigationGroupId; label: string }> = [
  { id: 'monitoring', label: 'Monitoring' },
  { id: 'paket-administrasi', label: 'Paket & Administrasi' },
  { id: 'sda-sistem', label: 'SDA & Sistem' },
]

export const MAIN_NAVIGATION_ITEMS: readonly MainNavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Command center',
    href: '/dashboard',
    routeKey: '/dashboard',
    iconKey: 'dashboard',
    group: 'monitoring',
    desktopInclude: true,
    mobileInclude: true,
    mobileBottomInclude: true,
    children: [
      { id: 'announcements', label: 'Pengumuman', description: 'Informasi resmi dan pemberitahuan sistem.', href: '/pengumuman', routeKey: '/pengumuman' },
    ],
  },
  {
    id: 'map',
    label: 'Peta Monitoring',
    shortLabel: 'Peta',
    description: 'Peta dan layer SDA',
    href: '/peta',
    routeKey: '/peta',
    iconKey: 'map',
    group: 'monitoring',
    desktopInclude: true,
    mobileInclude: true,
    mobileBottomInclude: true,
  },
  {
    id: 'survey',
    label: 'Survey Investigasi',
    description: 'Data lapangan',
    href: '/survey',
    routeKey: '/survey',
    iconKey: 'survey',
    group: 'monitoring',
    desktopInclude: true,
    mobileInclude: true,
  },
  {
    id: 'projects',
    label: 'Paket Pekerjaan',
    shortLabel: 'Paket',
    description: 'Ruang kerja paket',
    href: '/proyek',
    routeKey: '/proyek',
    iconKey: 'projects',
    group: 'paket-administrasi',
    desktopInclude: true,
    mobileInclude: true,
    mobileBottomInclude: true,
    children: [
      { id: 'daily-reports', label: 'Laporan Harian', description: 'Input dan tinjau laporan progres lapangan.', href: '/laporan', routeKey: '/laporan' },
      { id: 'issues', label: 'Masalah & Kendala', description: 'Pantau kendala dan tindak lanjut paket.', href: '/masalah', routeKey: '/masalah' },
      { id: 'rab', label: 'RAB', description: 'Kelola RAB dan bobot pekerjaan paket.', href: '/rab', routeKey: '/rab' },
      { id: 'documents', label: 'Dokumen', description: 'Buka arsip dan dokumen terkait paket.', href: '/dokumen', routeKey: '/dokumen' },
      { id: 'project-chat', label: 'Chat Proyek', description: 'Koordinasi internal sesuai paket yang ditugaskan.', href: '/chat', routeKey: '/chat' },
    ],
  },
  {
    id: 'approval',
    label: 'Approval Center',
    shortLabel: 'Approval',
    description: 'Persetujuan formal',
    href: '/approval',
    routeKey: '/approval',
    iconKey: 'approval',
    group: 'paket-administrasi',
    desktopInclude: true,
    mobileInclude: true,
    mobileBottomInclude: true,
  },
  {
    id: 'letters',
    label: 'Surat Masuk & Keluar',
    description: 'Disposisi dan arsip',
    href: '/surat',
    routeKey: '/surat',
    iconKey: 'letters',
    group: 'paket-administrasi',
    desktopInclude: true,
    mobileInclude: true,
  },
  {
    id: 'administration',
    label: 'Administrasi',
    description: 'Kontrak dan dokumen',
    href: '/administrasi',
    routeKey: '/administrasi',
    iconKey: 'administration',
    group: 'paket-administrasi',
    desktopInclude: true,
    mobileInclude: true,
    children: [
      { id: 'budget-absorption', label: 'Serapan Anggaran', description: 'Ringkasan pagu, kontrak, dan realisasi keuangan.', href: '/serapan-anggaran', routeKey: '/serapan-anggaran' },
      { id: 'contracts', label: 'Kontrak', description: 'Data kontrak, penyedia, dan masa pelaksanaan.', href: '/kontrak', routeKey: '/kontrak' },
    ],
  },
  {
    id: 'flood-level',
    label: 'Peil Banjir',
    description: 'Titik dan elevasi',
    href: '/peil',
    routeKey: '/peil',
    iconKey: 'flood-level',
    group: 'sda-sistem',
    desktopInclude: true,
    mobileInclude: true,
  },
  {
    id: 'assets',
    label: 'Asset SDA',
    description: 'Pintu air dan pompa',
    href: '/asset',
    routeKey: '/asset',
    iconKey: 'assets',
    group: 'sda-sistem',
    desktopInclude: true,
    mobileInclude: true,
  },
  {
    id: 'audit',
    label: 'Audit Log',
    description: 'Jejak aktivitas',
    href: '/audit-log',
    routeKey: '/audit-log',
    iconKey: 'audit',
    group: 'sda-sistem',
    desktopInclude: true,
    mobileInclude: true,
  },
  {
    id: 'settings',
    label: 'Pengaturan',
    description: 'Konfigurasi',
    href: '/pengaturan',
    routeKey: '/pengaturan',
    iconKey: 'settings',
    group: 'sda-sistem',
    desktopInclude: true,
    mobileInclude: true,
    children: [
      { id: 'users', label: 'Pengguna', description: 'Kelola pengguna, role, dan assignment sesuai kewenangan.', href: '/pengguna', routeKey: '/pengguna' },
    ],
  },
]
