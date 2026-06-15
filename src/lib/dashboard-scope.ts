import type { AuditLog, Proyek, User } from '@/types'
import { canViewAllProjects } from '@/lib/rbac'

export function getScopedProjects(projects: Proyek[], currentUser?: User | null) {
  if (!currentUser) return []
  if (canViewAllProjects(currentUser.role)) return projects

  const assignedProjectIds = new Set(currentUser.projectIds || [])

  return projects.filter(
    (project) =>
      assignedProjectIds.has(project.id) ||
      project.assignedUsers?.includes(currentUser.id) ||
      project.ppk === currentUser.id ||
      project.pptk === currentUser.id,
  )
}

export function getScopedAuditLogs(
  auditLogs: AuditLog[],
  scopedProjects: Proyek[],
  currentUser?: User | null,
) {
  if (!currentUser) return []
  if (canViewAllProjects(currentUser.role)) return auditLogs

  const scopedProjectIds = new Set(scopedProjects.map((project) => project.id))
  return auditLogs.filter(
    (log) => log.userId === currentUser.id || (log.entityId ? scopedProjectIds.has(log.entityId) : false),
  )
}

export function getPendingApprovalCount(projects: Proyek[]) {
  return projects.reduce(
    (sum, project) =>
      sum +
      project.laporanHarian.filter((item) => !item.disetujui).length +
      project.rabList.filter((item) => item.status !== 'approved' && item.status !== 'rejected').length +
      project.surveys.filter((item) => item.status === 'submitted').length,
    0,
  )
}
