export type TaskPriority = 'low' | 'normal' | 'high' | 'critical'

export type TaskStatus = 'empty' | 'pending' | 'in_progress' | 'done' | 'blocked'

export type UserIdentityKind = 'internal' | 'external'

export type TaskCenterIdentity = {
  kind: UserIdentityKind
  name?: string
  nip?: string
  roleLabel?: string
  unit?: string
  companyName?: string
  position?: string
}

export type TaskCenterItem = {
  id: string
  title: string
  moduleLabel: string
  status: TaskStatus
  priority: TaskPriority
  dueLabel?: string
  responsibleRole?: string
  relatedLabel?: string
  nextStep: string
  risk: string
  detailHref?: string
  actionHref?: string
  actionLabel?: string
  sourceLabel?: 'Database' | 'Persiapan UI' | 'Demo' | 'Simulasi'
  canAct?: boolean
  disabledReason?: string
}

export type AppreciationEvent = {
  id: string
  title: string
  moduleLabel: string
  actionLabel: string
  statusLabel: string
  nextStep: string
  riskPrevented: string
  createdAtLabel: string
  detailHref?: string
  read?: boolean
  sourceLabel?: 'Database' | 'Persiapan UI' | 'Demo' | 'Simulasi'
}

export const EMPTY_ASSIGNMENT_MESSAGE =
  'Selamat datang di SIAGA-SDA. Akun Anda sudah aktif, tetapi saat ini belum ada tugas yang diberikan kepada Anda. Tugas baru akan muncul di menu Tugas Saya setelah admin atau pejabat berwenang memberikan penugasan.'

export function formatIdentityLabel(identity?: TaskCenterIdentity): string {
  if (!identity) return 'Identitas pengguna belum tersedia'

  const name = identity.name?.trim() || 'Nama User'
  const role = identity.roleLabel?.trim() || 'Role SIAGA-SDA'

  if (identity.kind === 'external') {
    const company = identity.companyName?.trim() || 'Nama Perusahaan'
    const position = identity.position?.trim() || 'Posisi'
    return `${name} - ${company} - ${position} - ${role}`
  }

  const nip = identity.nip?.trim() || 'NIP ditampilkan sesuai izin'
  const unit = identity.unit?.trim() || 'Unit/Bidang sesuai data akun'
  return `${name} - ${nip} - ${role} - ${unit}`
}

export function getEmptyAssignmentCopy(identity?: TaskCenterIdentity) {
  const contactTarget = identity?.kind === 'external'
    ? 'Admin Bidang, PPK, PPTK, Kabid, atau petugas yang berwenang'
    : 'Admin Bidang, PPK, PPTK, Kabid, atau petugas yang berwenang'

  return {
    title: 'Belum Ada Tugas',
    message: EMPTY_ASSIGNMENT_MESSAGE,
    identityLabel: formatIdentityLabel(identity),
    guidance: `Jika Anda merasa seharusnya sudah mendapatkan tugas, silakan hubungi ${contactTarget}.`,
  }
}

export function getPriorityLabel(priority: TaskPriority): string {
  const labels: Record<TaskPriority, string> = {
    low: 'Rendah',
    normal: 'Normal',
    high: 'Tinggi',
    critical: 'Kritis',
  }
  return labels[priority]
}

export function getStatusLabel(status: TaskStatus): string {
  const labels: Record<TaskStatus, string> = {
    empty: 'Belum Ada Tugas',
    pending: 'Menunggu',
    in_progress: 'Dikerjakan',
    done: 'Selesai',
    blocked: 'Tertahan',
  }
  return labels[status]
}

