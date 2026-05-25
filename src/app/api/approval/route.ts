import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/rbac'
import { listApprovalsForSession } from '@/lib/approval-workflow'

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  if (!hasPermission(session.user.role, 'view_approval')) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }

  const approvals = await listApprovalsForSession(session)

  return NextResponse.json({ approvals }, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}
