import { Approval, ApprovalAction, ApprovalEntityType, ApprovalStatus, Prisma, Role } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { canViewAllProjects, hasPermission, Permission } from '@/lib/rbac'
import { mapDbRole } from '@/lib/db-mappers'
import { logAudit, toRole } from '@/lib/project-db'

export type ApprovalActionInput = 'approve' | 'reject' | 'request_revision' | 'comment'

const ENTITY_LABEL: Record<ApprovalEntityType, string> = {
  LAPORAN_HARIAN: 'Laporan Harian',
  LAPORAN_MINGGUAN: 'Laporan Mingguan',
  LAPORAN_BULANAN: 'Laporan Bulanan',
  RAB: 'RAB',
  SHOP_DRAWING: 'Shop Drawing',
  AS_BUILT_DRAWING: 'As Built Drawing',
  SURVEY: 'Survey Investigasi',
  SERAH_TERIMA: 'PHO/FHO/BAST',
  KONTRAK: 'Kontrak',
  ADDENDUM: 'Addendum',
}

const ACTION_AUDIT: Record<ApprovalActionInput, string> = {
  approve: 'APPROVAL_APPROVE',
  reject: 'APPROVAL_REJECT',
  request_revision: 'APPROVAL_REQUEST_REVISION',
  comment: 'APPROVAL_COMMENT',
}

function normalizeStatus(status: ApprovalStatus) {
  if (status === 'APPROVED' || status === 'FINAL') return 'approved'
  if (status === 'REJECTED') return 'rejected'
  if (status === 'REVISION') return 'revision_requested'
  if (status === 'REVIEWED') return 'reviewed'
  return 'pending'
}

function actionToDbAction(action: ApprovalActionInput): ApprovalAction {
  if (action === 'approve') return ApprovalAction.APPROVE
  if (action === 'reject') return ApprovalAction.REJECT
  if (action === 'request_revision') return ApprovalAction.REQUEST_REVISION
  return ApprovalAction.COMMENT
}

function actionToStatus(action: ApprovalActionInput, currentStatus: ApprovalStatus): ApprovalStatus {
  if (action === 'approve') return ApprovalStatus.APPROVED
  if (action === 'reject') return ApprovalStatus.REJECTED
  if (action === 'request_revision') return ApprovalStatus.REVISION
  return currentStatus
}

function approvalPermission(entityType: ApprovalEntityType, action: ApprovalActionInput): Permission {
  if (action === 'request_revision') return 'request_revision'
  if (action === 'reject') return 'reject_item'
  if (entityType === 'RAB') return 'approve_rab'
  if (entityType === 'SURVEY') return 'approve_survey'
  return 'approve_laporan'
}

function canAccessApprovalPaket(role: string, userId: string, paket: { ppkId: string | null; pptkId: string | null; assignments: { userId: string }[] }) {
  if (canViewAllProjects(role)) return true
  return paket.ppkId === userId || paket.pptkId === userId || paket.assignments.some((item) => item.userId === userId)
}

function pickApprover(paket: { ppkId: string | null; pptkId: string | null }, fallbackUserId: string) {
  return paket.ppkId || paket.pptkId || fallbackUserId
}

async function ensureApproval(params: {
  paketId: string
  entityType: ApprovalEntityType
  entityId: string
  approverId: string
  requestedById?: string | null
  currentStep: string
  catatan?: string | null
}) {
  const existing = await prisma.approval.findFirst({
    where: { paketId: params.paketId, entityType: params.entityType, entityId: params.entityId },
  })

  if (existing) return existing

  const approval = await prisma.approval.create({
    data: {
      paketId: params.paketId,
      entityType: params.entityType,
      entityId: params.entityId,
      approverId: params.approverId,
      requestedById: params.requestedById || null,
      actionRequiredRole: 'PPK/PPTK',
      currentStep: params.currentStep,
      catatan: params.catatan || null,
      histories: {
        create: {
          action: ApprovalAction.SUBMIT,
          statusAfter: ApprovalStatus.SUBMITTED,
          actorId: params.requestedById || null,
          catatan: 'Item masuk ke Approval Center.',
        },
      },
    },
  })

  return approval
}

/**
 * Operasi tulis untuk membentuk approval yang belum tersedia.
 * Jangan panggil dari GET/polling. Gunakan hanya dari endpoint mutasi eksplisit.
 */
export async function syncPendingApprovalsForVisiblePakets(session: any) {
  const role = String(session?.user?.role || '')
  const userId = String(session?.user?.id || '')
  if (!userId || !hasPermission(role, 'view_approval')) return

  const pakets = await prisma.paket.findMany({
    where: canViewAllProjects(role)
      ? undefined
      : {
          OR: [
            { ppkId: userId },
            { pptkId: userId },
            { assignments: { some: { userId } } },
          ],
        },
    include: {
      assignments: { select: { userId: true } },
      laporanHarianBaru: {
        where: { disetujui: false },
        select: { id: true, userId: true, uraianPekerjaan: true },
      },
      rab: {
        where: { status: { in: [ApprovalStatus.DRAFT, ApprovalStatus.SUBMITTED, ApprovalStatus.REVIEWED, ApprovalStatus.REVISION] } },
        select: { id: true, catatan: true },
      },
      surveyBaru: {
        where: { status: { in: [ApprovalStatus.SUBMITTED, ApprovalStatus.REVIEWED, ApprovalStatus.REVISION] } },
        select: { id: true, userId: true, rekomendasi: true },
      },
    },
  })

  for (const paket of pakets) {
    if (!canAccessApprovalPaket(role, userId, paket)) continue
    const approverId = pickApprover(paket, userId)

    for (const laporan of paket.laporanHarianBaru) {
      await ensureApproval({
        paketId: paket.id,
        entityType: ApprovalEntityType.LAPORAN_HARIAN,
        entityId: laporan.id,
        approverId,
        requestedById: laporan.userId,
        currentStep: 'Menunggu approval laporan',
        catatan: laporan.uraianPekerjaan,
      })
    }

    for (const rab of paket.rab) {
      await ensureApproval({
        paketId: paket.id,
        entityType: ApprovalEntityType.RAB,
        entityId: rab.id,
        approverId,
        currentStep: 'Menunggu approval RAB',
        catatan: rab.catatan,
      })
    }

    for (const survey of paket.surveyBaru) {
      await ensureApproval({
        paketId: paket.id,
        entityType: ApprovalEntityType.SURVEY,
        entityId: survey.id,
        approverId,
        requestedById: survey.userId,
        currentStep: 'Menunggu review survey',
        catatan: survey.rekomendasi,
      })
    }
  }
}

export async function listApprovalsForSession(session: any) {
  const role = String(session?.user?.role || '')
  const userId = String(session?.user?.id || '')

  const approvals = await prisma.approval.findMany({
    where: canViewAllProjects(role)
      ? undefined
      : {
          paket: {
            OR: [
              { ppkId: userId },
              { pptkId: userId },
              { assignments: { some: { userId } } },
            ],
          },
        },
    include: {
      paket: {
        select: {
          id: true,
          kodePaket: true,
          namaPaket: true,
          ppkId: true,
          pptkId: true,
          assignments: { select: { userId: true } },
        },
      },
      approver: { select: { id: true, name: true, role: true } },
      requester: { select: { id: true, name: true, role: true } },
      histories: {
        orderBy: { createdAt: 'desc' },
        include: {
          actor: { select: { id: true, name: true, role: true } },
        },
      },
    },
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    take: 200,
  })

  return approvals.map((item) => serializeApproval(item as any, role))
}

export async function applyApprovalAction(session: any, approvalId: string, input: { action: ApprovalActionInput; note?: string }) {
  const role = String(session?.user?.role || '')
  const userId = String(session?.user?.id || '')
  const action = input.action

  const approval = await prisma.approval.findUnique({
    where: { id: approvalId },
    include: {
      paket: { include: { assignments: { select: { userId: true } } } },
    },
  })

  if (!approval) return { status: 404 as const, message: 'Approval tidak ditemukan' }
  if (!canAccessApprovalPaket(role, userId, approval.paket)) return { status: 403 as const, message: 'Anda tidak memiliki akses ke paket ini' }

  const permission = approvalPermission(approval.entityType, action)
  if (!hasPermission(role, permission) || role === 'pimpinan' || role === 'auditor') {
    return { status: 403 as const, message: 'Role ini tidak berwenang memproses approval' }
  }

  if ((action === 'reject' || action === 'request_revision') && !input.note?.trim()) {
    return { status: 400 as const, message: 'Catatan wajib diisi untuk tolak atau minta revisi' }
  }

  const statusAfter = actionToStatus(action, approval.status)
  const actorDbRole = toRole(role)

  await prisma.$transaction(async (tx) => {
    await tx.approval.update({
      where: { id: approvalId },
      data: {
        status: statusAfter,
        catatan: input.note || approval.catatan,
        revisionNote: action === 'request_revision' ? input.note : approval.revisionNote,
        currentStep: action === 'approve' ? 'Disetujui' : action === 'reject' ? 'Ditolak' : action === 'request_revision' ? 'Minta revisi' : approval.currentStep,
        resolvedAt: action === 'comment' ? approval.resolvedAt : new Date(),
      },
    })

    await tx.approvalHistory.create({
      data: {
        approvalId,
        action: actionToDbAction(action),
        statusBefore: approval.status,
        statusAfter,
        actorId: userId,
        actorRole: actorDbRole,
        catatan: input.note || null,
      },
    })

    await applyLegacyStatusUpdate(tx, approval, statusAfter, input.note, session.user.name || '')
  })

  await logAudit(userId, ACTION_AUDIT[action], `${ENTITY_LABEL[approval.entityType]}: ${action}`, {
    paketId: approval.paketId,
    entityType: approval.entityType.toLowerCase(),
    entityId: approval.entityId,
  })

  return { status: 200 as const, message: 'Approval diproses' }
}

async function applyLegacyStatusUpdate(
  tx: Prisma.TransactionClient,
  approval: Approval,
  statusAfter: ApprovalStatus,
  note: string | undefined,
  actorName: string,
) {
  if (approval.entityType === 'LAPORAN_HARIAN') {
    await tx.laporanHarianBaru.update({
      where: { id: approval.entityId },
      data: statusAfter === 'APPROVED'
        ? { disetujui: true, disetujuiOleh: actorName, disetujuiAt: new Date() }
        : { catatanKhusus: note },
    })
  }

  if (approval.entityType === 'RAB') {
    await tx.rab.update({
      where: { id: approval.entityId },
      data: {
        status: statusAfter,
        catatan: note || undefined,
      },
    })
  }

  if (approval.entityType === 'SURVEY') {
    await tx.surveyBaru.update({
      where: { id: approval.entityId },
      data: {
        status: statusAfter,
        catatanReviewer: note || undefined,
      },
    })
  }
}

function serializeApproval(
  item: Approval & {
    paket: { id: string; kodePaket: string; namaPaket: string }
    approver: { id: string; name: string; role: Role }
    requester: { id: string; name: string; role: Role } | null
    histories: {
      id: string
      action: ApprovalAction
      statusBefore: ApprovalStatus | null
      statusAfter: ApprovalStatus
      actorRole: string | null
      catatan: string | null
      createdAt: Date
      actor: { id: string; name: string; role: Role } | null
    }[]
  },
  role: string,
) {
  const canApprove = role !== 'pimpinan' && role !== 'auditor' && hasPermission(role, approvalPermission(item.entityType, 'approve'))
  const canReject = role !== 'pimpinan' && role !== 'auditor' && hasPermission(role, 'reject_item')
  const canRequestRevision = role !== 'pimpinan' && role !== 'auditor' && hasPermission(role, 'request_revision')

  return {
    id: item.id,
    paketId: item.paketId,
    paketKode: item.paket.kodePaket,
    paketNama: item.paket.namaPaket,
    entityType: item.entityType,
    entityLabel: ENTITY_LABEL[item.entityType],
    entityId: item.entityId,
    status: item.status,
    statusLabel: normalizeStatus(item.status),
    currentStep: item.currentStep,
    catatan: item.catatan,
    revisionNote: item.revisionNote,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    resolvedAt: item.resolvedAt?.toISOString() || null,
    approver: {
      id: item.approver.id,
      name: item.approver.name,
      role: mapDbRole(item.approver.role),
    },
    requester: item.requester
      ? {
          id: item.requester.id,
          name: item.requester.name,
          role: mapDbRole(item.requester.role),
        }
      : null,
    canAct: canApprove || canReject || canRequestRevision,
    canApprove,
    canReject,
    canRequestRevision,
    histories: item.histories.map((history) => ({
      id: history.id,
      action: history.action,
      statusBefore: history.statusBefore,
      statusAfter: history.statusAfter,
      actorRole: history.actorRole,
      catatan: history.catatan,
      createdAt: history.createdAt.toISOString(),
      actor: history.actor
        ? {
            id: history.actor.id,
            name: history.actor.name,
            role: mapDbRole(history.actor.role),
          }
        : null,
    })),
  }
}
