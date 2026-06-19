import type { ProjectHealth } from '@/types'

export type ProjectComputedStatusKey = 'completed' | 'late' | 'at_risk' | 'on_track' | 'no_schedule'
export type ProjectWarningLevel = 'none' | 'info' | 'warning' | 'critical'

type ProjectStatusLike = {
  status?: unknown
  health?: unknown
  progressFisik?: unknown
  progress?: unknown
  progressKeuangan?: unknown
  tanggalSelesai?: unknown
  targetSelesai?: unknown
  deadline?: unknown
  deviasi?: unknown
}

export type ProjectComputedStatus = {
  key: ProjectComputedStatusKey
  health: ProjectHealth
  label: string
  warningLevel: ProjectWarningLevel
  isCompleted: boolean
  isLate: boolean
  isAtRisk: boolean
  isOnTrack: boolean
  hasSchedule: boolean
  progress: number | null
  targetDate: Date | null
  remainingDays: number | null
  reason: string
}

export function normalizeProjectProgress(value: unknown): number | null {
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue)) return null
  return Math.min(100, Math.max(0, numericValue))
}

export function parseProjectTargetDate(value: unknown): Date | null {
  if (!value) return null
  const parsed = value instanceof Date ? value : new Date(String(value))
  if (Number.isNaN(parsed.getTime())) return null
  parsed.setHours(0, 0, 0, 0)
  return parsed
}

export function isProjectCompleted(project: ProjectStatusLike) {
  const status = String(project.status || '').toLowerCase()
  const progress = normalizeProjectProgress(project.progressFisik ?? project.progress)
  return progress === 100 || ['selesai', 'completed', 'complete', 'closed', 'close', 'final', 'pho', 'fho', 'selesai_arsip'].includes(status)
}

export function getProjectComputedStatus(project: ProjectStatusLike, now = new Date()): ProjectComputedStatus {
  const progress = normalizeProjectProgress(project.progressFisik ?? project.progress)
  const targetDate = parseProjectTargetDate(project.tanggalSelesai ?? project.targetSelesai ?? project.deadline)
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  const remainingDays = targetDate ? Math.ceil((targetDate.getTime() - today.getTime()) / 86400000) : null
  const deviasi = Number(project.deviasi)
  const hasCriticalDeviation = Number.isFinite(deviasi) && deviasi <= -20
  const hasRiskDeviation = Number.isFinite(deviasi) && deviasi < -10
  const completed = isProjectCompleted(project)

  if (completed) {
    return {
      key: 'completed',
      health: 'on_track',
      label: 'Selesai',
      warningLevel: 'none',
      isCompleted: true,
      isLate: false,
      isAtRisk: false,
      isOnTrack: false,
      hasSchedule: Boolean(targetDate),
      progress,
      targetDate,
      remainingDays,
      reason: 'Paket sudah selesai atau progress fisik sudah 100%.',
    }
  }

  if (targetDate && remainingDays !== null && remainingDays < 0 && (progress ?? 0) < 100) {
    return {
      key: 'late',
      health: 'kritis',
      label: 'Terlambat',
      warningLevel: 'critical',
      isCompleted: false,
      isLate: true,
      isAtRisk: false,
      isOnTrack: false,
      hasSchedule: true,
      progress,
      targetDate,
      remainingDays,
      reason: `Target selesai sudah lewat ${Math.abs(remainingDays)} hari dan progress belum 100%.`,
    }
  }

  if (hasCriticalDeviation) {
    return {
      key: 'at_risk',
      health: 'kritis',
      label: 'Kritis',
      warningLevel: 'critical',
      isCompleted: false,
      isLate: false,
      isAtRisk: true,
      isOnTrack: false,
      hasSchedule: Boolean(targetDate),
      progress,
      targetDate,
      remainingDays,
      reason: `Deviasi progress ${deviasi.toFixed(1)}% berada pada batas kritis.`,
    }
  }

  if ((targetDate && remainingDays !== null && remainingDays <= 7 && (progress ?? 0) < 100) || hasRiskDeviation) {
    return {
      key: 'at_risk',
      health: 'warning',
      label: 'Risiko Terlambat',
      warningLevel: 'warning',
      isCompleted: false,
      isLate: false,
      isAtRisk: true,
      isOnTrack: false,
      hasSchedule: Boolean(targetDate),
      progress,
      targetDate,
      remainingDays,
      reason: hasRiskDeviation
        ? `Deviasi progress ${deviasi.toFixed(1)}% perlu perhatian.`
        : 'Target selesai kurang dari atau sama dengan 7 hari dan progress belum 100%.',
    }
  }

  if (!targetDate || progress === null) {
    return {
      key: 'no_schedule',
      health: 'warning',
      label: 'Data Belum Lengkap',
      warningLevel: 'info',
      isCompleted: false,
      isLate: false,
      isAtRisk: false,
      isOnTrack: false,
      hasSchedule: Boolean(targetDate),
      progress,
      targetDate,
      remainingDays,
      reason: !targetDate ? 'Target selesai belum tersedia.' : 'Progress fisik belum tersedia.',
    }
  }

  return {
    key: 'on_track',
    health: 'on_track',
    label: 'On Track',
    warningLevel: 'none',
    isCompleted: false,
    isLate: false,
    isAtRisk: false,
    isOnTrack: true,
    hasSchedule: true,
    progress,
    targetDate,
    remainingDays,
    reason: 'Target belum lewat, progress valid, dan deviasi belum masuk batas risiko.',
  }
}

export function getProjectComputedHealth(project: ProjectStatusLike, now = new Date()): ProjectHealth {
  return getProjectComputedStatus(project, now).health
}

export function getProjectWarningLevel(project: ProjectStatusLike, now = new Date()): ProjectWarningLevel {
  return getProjectComputedStatus(project, now).warningLevel
}

export function getProjectComputedBadge(project: ProjectStatusLike, now = new Date()) {
  const status = getProjectComputedStatus(project, now)
  if (status.key === 'completed') {
    return { label: status.label, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' }
  }
  if (status.warningLevel === 'critical') {
    return { label: status.label, bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
  }
  if (status.warningLevel === 'warning') {
    return { label: status.label, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' }
  }
  if (status.warningLevel === 'info') {
    return { label: status.label, bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' }
  }
  return { label: status.label, bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' }
}
