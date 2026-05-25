import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { ApprovalActionInput, applyApprovalAction } from '@/lib/approval-workflow'

const ACTIONS: ApprovalActionInput[] = ['approve', 'reject', 'request_revision', 'comment']

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const action = String(body?.action || '') as ApprovalActionInput

  if (!ACTIONS.includes(action)) {
    return NextResponse.json({ message: 'Aksi approval tidak valid' }, { status: 400 })
  }

  const result = await applyApprovalAction(session, id, {
    action,
    note: typeof body?.note === 'string' ? body.note : undefined,
  })

  if (result.status !== 200) {
    return NextResponse.json({ message: result.message }, { status: result.status })
  }

  return NextResponse.json(result)
}
