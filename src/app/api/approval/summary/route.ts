import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getApprovalSummaryForSession } from '@/lib/approval-workflow'
import { hasPermission } from '@/lib/rbac'

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  if (!hasPermission(session.user.role, 'view_approval')) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }

  const summary = await getApprovalSummaryForSession(session)

  return NextResponse.json({ summary }, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}
