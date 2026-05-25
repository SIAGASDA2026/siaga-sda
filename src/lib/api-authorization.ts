import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { canViewAllProjects, hasPermission, Permission } from '@/lib/rbac'

export function forbidden(message = 'Forbidden') {
  return NextResponse.json({ message }, { status: 403 })
}

export function unauthorized() {
  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
}

export function sessionRole(session: any) {
  return String(session?.user?.role || '')
}

export async function canAccessPaket(session: any, paketId: string, permission: Permission) {
  if (!session?.user?.id) return false
  const role = sessionRole(session)
  if (!hasPermission(role, permission)) return false
  if (canViewAllProjects(role)) return true

  const count = await prisma.paket.count({
    where: {
      id: paketId,
      OR: [
        { ppkId: session.user.id },
        { pptkId: session.user.id },
        { assignments: { some: { userId: session.user.id } } },
      ],
    },
  })

  return count > 0
}

export async function requirePaketAccess(session: any, paketId: string, permission: Permission) {
  if (!session?.user?.id) return unauthorized()
  const ok = await canAccessPaket(session, paketId, permission)
  return ok ? null : forbidden()
}
