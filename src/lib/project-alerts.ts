import type { Proyek } from '@/types'
import { getProjectComputedStatus, type ProjectComputedStatus } from '@/lib/project-status'

export type WarningFollowUpStatus =
  | 'Belum Ada Tindak Lanjut'
  | 'Rekomendasi Dibuat'
  | 'Menunggu Verifikasi Teknis'
  | 'Menunggu Review PPK/PPTK'
  | 'Draft Surat Disiapkan'
  | 'Diajukan untuk Persetujuan'
  | 'Disetujui'
  | 'Dikirim ke Kontraktor'
  | 'Menunggu Tindak Lanjut Kontraktor'
  | 'Ditindaklanjuti'
  | 'Selesai / Diarsipkan'
  | 'Dibatalkan dengan Alasan'

export const WARNING_FOLLOW_UP_STATUSES: WarningFollowUpStatus[] = [
  'Belum Ada Tindak Lanjut',
  'Rekomendasi Dibuat',
  'Menunggu Verifikasi Teknis',
  'Menunggu Review PPK/PPTK',
  'Draft Surat Disiapkan',
  'Diajukan untuk Persetujuan',
  'Disetujui',
  'Dikirim ke Kontraktor',
  'Menunggu Tindak Lanjut Kontraktor',
  'Ditindaklanjuti',
  'Selesai / Diarsipkan',
  'Dibatalkan dengan Alasan',
]

export type ProjectSystemWarningLevel = 'info' | 'warning' | 'critical'

export type ProjectSystemWarning = {
  id: string
  projectId: string
  title: string
  detail: string
  href: string
  level: ProjectSystemWarningLevel
  project: Proyek
  status: ProjectComputedStatus
  statusLabel: string
  progressFisik: number
  progressKeuangan: number
  targetLabel: string
  remainingLabel: string
  relatedParties: string[]
  recommendation: string
  limitation: string
  followUpStatus: WarningFollowUpStatus
}

export type ProjectWarningSummary = {
  total: number
  critical: number
  warning: number
  info: number
  late: number
  atRisk: number
}

export type ProjectWarningSource = {
  personalTasks: []
  systemWarnings: ProjectSystemWarning[]
  priorityWarning?: ProjectSystemWarning
  warningSummary: ProjectWarningSummary
}

const WARNING_RECOMMENDATION = 'Direkomendasikan menyiapkan Surat Teguran / Klarifikasi kepada Kontraktor.'
const WARNING_LIMITATION = 'Rekomendasi ini belum menjadi surat resmi. Perlu verifikasi teknis dan persetujuan pejabat berwenang.'

function formatTargetDate(value: Date | null) {
  if (!value) return 'Target belum tersedia'
  return value.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function getRemainingLabel(status: ProjectComputedStatus) {
  if (status.remainingDays === null) return 'Sisa waktu belum tersedia'
  if (status.remainingDays < 0) return `Terlambat ${Math.abs(status.remainingDays)} hari`
  if (status.remainingDays === 0) return 'Jatuh tempo hari ini'
  return `${status.remainingDays} hari menuju target`
}

function getWarningLevel(status: ProjectComputedStatus): ProjectSystemWarningLevel {
  if (status.warningLevel === 'critical') return 'critical'
  if (status.warningLevel === 'warning') return 'warning'
  return 'info'
}

function getWarningScore(warning: ProjectSystemWarning) {
  const levelScore = warning.level === 'critical' ? 100 : warning.level === 'warning' ? 50 : 10
  const lateScore = warning.status.isLate ? 25 : 0
  const lowProgressScore = Math.max(0, 100 - warning.progressFisik) / 10
  return levelScore + lateScore + lowProgressScore
}

function getRelatedParties(project: Proyek, level: ProjectSystemWarningLevel) {
  return [
    project.ppk ? `PPK: ${project.ppk}` : 'PPK: belum tersedia',
    project.pptk ? `PPTK: ${project.pptk}` : 'PPTK: belum tersedia',
    'Direksi Teknis: sesuai assignment paket',
    project.konsultanPengawasan ? `Konsultan Pengawas: ${project.konsultanPengawasan}` : 'Konsultan Pengawas: jika tercantum pada paket',
    project.kontraktor ? `Kontraktor: ${project.kontraktor}` : 'Kontraktor: belum tersedia',
    level === 'critical' ? 'Kabid/Pimpinan: monitoring dan eskalasi sesuai scope' : 'Kabid/Pimpinan: monitoring sesuai kebutuhan',
  ]
}

function toSystemWarning(project: Proyek, now: Date): ProjectSystemWarning | null {
  const status = getProjectComputedStatus(project, now)
  const openIssues = project.masalah?.filter((item) => item.status === 'open').length || 0
  const shouldWarn = status.isLate || status.isAtRisk || status.health === 'kritis' || status.health === 'warning' || openIssues > 0

  if (!shouldWarn) return null

  const level = openIssues > 0 && status.warningLevel === 'none' ? 'warning' : getWarningLevel(status)
  const criticalOrLate = status.isLate || status.health === 'kritis' || level === 'critical'
  const recommendation = criticalOrLate
    ? WARNING_RECOMMENDATION
    : 'Pantau progres dan lakukan klarifikasi teknis bila risiko meningkat.'

  return {
    id: `warning-${project.id}`,
    projectId: project.id,
    title: project.nama,
    detail: openIssues > 0 ? `${status.reason} Masalah open: ${openIssues}.` : status.reason,
    href: `/proyek/${project.id}?from=dashboard`,
    level,
    project,
    status,
    statusLabel: status.label,
    progressFisik: Number(project.progressFisik || 0),
    progressKeuangan: Number(project.progressKeuangan || 0),
    targetLabel: formatTargetDate(status.targetDate),
    remainingLabel: getRemainingLabel(status),
    relatedParties: getRelatedParties(project, level),
    recommendation,
    limitation: WARNING_LIMITATION,
    followUpStatus: 'Belum Ada Tindak Lanjut',
  }
}

export function buildProjectWarningSource(projects: Proyek[], now = new Date()): ProjectWarningSource {
  const systemWarnings = projects
    .map((project) => toSystemWarning(project, now))
    .filter((warning): warning is ProjectSystemWarning => Boolean(warning))
    .sort((a, b) => {
      const scoreDiff = getWarningScore(b) - getWarningScore(a)
      if (scoreDiff !== 0) return scoreDiff
      const progressDiff = a.progressFisik - b.progressFisik
      if (progressDiff !== 0) return progressDiff
      return `${a.project.kode || ''}${a.title}${a.projectId}`.localeCompare(`${b.project.kode || ''}${b.title}${b.projectId}`)
    })

  return {
    personalTasks: [],
    systemWarnings,
    priorityWarning: systemWarnings[0],
    warningSummary: {
      total: systemWarnings.length,
      critical: systemWarnings.filter((item) => item.level === 'critical').length,
      warning: systemWarnings.filter((item) => item.level === 'warning').length,
      info: systemWarnings.filter((item) => item.level === 'info').length,
      late: systemWarnings.filter((item) => item.status.isLate).length,
      atRisk: systemWarnings.filter((item) => item.status.isAtRisk).length,
    },
  }
}
