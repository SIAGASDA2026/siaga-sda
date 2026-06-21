'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { Topbar } from '@/components/layout/Topbar'
import { useApprovalSummary } from '@/components/approval/ApprovalSummaryProvider'
import { EmptyState, Modal } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import { CheckCircle2, ClipboardCheck, Eye, History, ListChecks, MessageSquareWarning, RotateCcw, Search, ShieldCheck, XCircle } from 'lucide-react'

type ApprovalEntityType = 'LAPORAN_HARIAN' | 'LAPORAN_MINGGUAN' | 'LAPORAN_BULANAN' | 'RAB' | 'SHOP_DRAWING' | 'AS_BUILT_DRAWING' | 'SURVEY' | 'SERAH_TERIMA' | 'KONTRAK' | 'ADDENDUM'
type ApprovalStatus = 'DRAFT' | 'SUBMITTED' | 'REVIEWED' | 'APPROVED' | 'REJECTED' | 'REVISION' | 'FINAL'
type ApprovalAction = 'SUBMIT' | 'APPROVE' | 'REQUEST_REVISION' | 'REJECT' | 'COMMENT'
type ActionInput = 'approve' | 'reject' | 'request_revision' | 'comment'

type ApprovalHistory = {
  id: string
  action: ApprovalAction
  statusBefore: ApprovalStatus | null
  statusAfter: ApprovalStatus
  actorRole: string | null
  catatan: string | null
  createdAt: string
  actor: { id: string; name: string; role: string } | null
}

type ApprovalItem = {
  id: string
  paketId: string
  paketKode: string
  paketNama: string
  entityType: ApprovalEntityType
  entityLabel: string
  entityId: string
  status: ApprovalStatus
  statusLabel: string
  currentStep: string | null
  catatan: string | null
  revisionNote: string | null
  createdAt: string
  updatedAt: string
  resolvedAt: string | null
  approver: { id: string; name: string; role: string }
  requester: { id: string; name: string; role: string } | null
  canAct: boolean
  canApprove: boolean
  canReject: boolean
  canRequestRevision: boolean
  histories: ApprovalHistory[]
}

const ENTITY_TONE: Record<string, string> = {
  LAPORAN_HARIAN: 'bg-blue-100 text-blue-700',
  LAPORAN_MINGGUAN: 'bg-blue-100 text-blue-700',
  LAPORAN_BULANAN: 'bg-blue-100 text-blue-700',
  RAB: 'bg-amber-100 text-amber-700',
  SURVEY: 'bg-teal-100 text-teal-700',
  SHOP_DRAWING: 'bg-indigo-100 text-indigo-700',
  AS_BUILT_DRAWING: 'bg-indigo-100 text-indigo-700',
  SERAH_TERIMA: 'bg-emerald-100 text-emerald-700',
  KONTRAK: 'bg-slate-100 text-slate-700',
  ADDENDUM: 'bg-orange-100 text-orange-700',
}

const STATUS_LABEL: Record<ApprovalStatus, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Pending',
  REVIEWED: 'Review',
  APPROVED: 'Disetujui',
  REJECTED: 'Ditolak',
  REVISION: 'Minta Revisi',
  FINAL: 'Final',
}

const ACTION_LABEL: Record<ApprovalAction, string> = {
  SUBMIT: 'Diajukan',
  APPROVE: 'Disetujui',
  REQUEST_REVISION: 'Minta Revisi',
  REJECT: 'Ditolak',
  COMMENT: 'Catatan',
}

function statusTone(status: ApprovalStatus) {
  if (status === 'APPROVED' || status === 'FINAL') return 'bg-green-50 text-green-700 border-green-100'
  if (status === 'REJECTED') return 'bg-red-50 text-red-700 border-red-100'
  if (status === 'REVISION') return 'bg-orange-50 text-orange-700 border-orange-100'
  if (status === 'REVIEWED') return 'bg-slate-50 text-slate-600 border-slate-100'
  return 'bg-amber-50 text-amber-700 border-amber-100'
}

function isPending(status: ApprovalStatus) {
  return status === 'DRAFT' || status === 'SUBMITTED' || status === 'REVIEWED'
}

class ApprovalRequestError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
  }
}

async function fetchApprovals() {
  const response = await fetch('/api/approval', { cache: 'no-store' })
  const data = await response.json().catch(() => null)
  if (!response.ok) throw new ApprovalRequestError(data?.message || 'Gagal mengambil data approval', response.status)
  return data.approvals as ApprovalItem[]
}

export default function ApprovalCenterPage() {
  const searchParams = useSearchParams()
  const { summary: approvalSummary, refreshApprovalSummary } = useApprovalSummary()
  const searchQuery = searchParams.toString()
  const initialApprovalId = searchParams.get('approval_id')
  const [items, setItems] = useState<ApprovalItem[]>([])
  const [search, setSearch] = useState('')
  const [filterKind, setFilterKind] = useState<ApprovalEntityType | 'all'>(() => {
    const value = searchParams.get('entity_type')?.toUpperCase()
    return value && value in ENTITY_TONE ? value as ApprovalEntityType : 'all'
  })
  const [filterStatus, setFilterStatus] = useState<ApprovalStatus | 'all' | 'pending'>(() => {
    const value = searchParams.get('approval_status') || searchParams.get('status')
    if (value?.toLowerCase() === 'pending') return 'pending'
    const normalized = value?.toUpperCase()
    return normalized && normalized in STATUS_LABEL ? normalized as ApprovalStatus : 'all'
  })
  const [filterYear, setFilterYear] = useState(() => searchParams.get('tahun') || 'all')
  const [filterApproverRole, setFilterApproverRole] = useState(() => searchParams.get('approver_role') || 'all')
  const [selected, setSelected] = useState<ApprovalItem | null>(null)
  const [noteTarget, setNoteTarget] = useState<{ item: ApprovalItem; action: ActionInput } | null>(null)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [accessDenied, setAccessDenied] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(searchQuery)
    const entityType = params.get('entity_type')?.toUpperCase()
    const status = params.get('approval_status') || params.get('status')
    const normalizedStatus = status?.toUpperCase()

    setFilterKind(entityType && entityType in ENTITY_TONE ? entityType as ApprovalEntityType : 'all')
    setFilterStatus(status?.toLowerCase() === 'pending' ? 'pending' : normalizedStatus && normalizedStatus in STATUS_LABEL ? normalizedStatus as ApprovalStatus : 'all')
    setFilterYear(params.get('tahun') || 'all')
    setFilterApproverRole(params.get('approver_role') || 'all')
  }, [searchQuery])

  const load = useCallback(async () => {
    if (accessDenied) return

    try {
      const approvals = await fetchApprovals()
      setAccessDenied(false)
      setItems(approvals)
      setSelected((current) => current
        ? approvals.find((item) => item.id === current.id) || null
        : initialApprovalId
          ? approvals.find((item) => item.id === initialApprovalId) || null
          : null)
    } catch (error) {
      if (error instanceof ApprovalRequestError && error.status === 403) {
        setAccessDenied(true)
        setItems([])
        setSelected(null)
      } else {
        toast.error(error instanceof Error ? error.message : 'Gagal memuat approval')
      }
    } finally {
      setLoading(false)
    }
  }, [accessDenied, initialApprovalId])

  useEffect(() => {
    void load()
    if (accessDenied) return

    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible') void load()
    }, 15000)

    return () => window.clearInterval(interval)
  }, [accessDenied, load])

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const needle = search.trim().toLowerCase()
      const matchSearch = !needle || item.entityLabel.toLowerCase().includes(needle) || item.paketNama.toLowerCase().includes(needle) || item.paketKode.toLowerCase().includes(needle)
      const matchKind = filterKind === 'all' || item.entityType === filterKind
      const matchStatus = filterStatus === 'all' || (filterStatus === 'pending' ? isPending(item.status) : item.status === filterStatus)
      const matchYear = filterYear === 'all' || String(new Date(item.createdAt).getFullYear()) === filterYear
      const matchApprover = filterApproverRole === 'all' || item.approver.role.toLowerCase() === filterApproverRole.toLowerCase()
      return matchSearch && matchKind && matchStatus && matchYear && matchApprover
    })
  }, [filterApproverRole, filterKind, filterStatus, filterYear, items, search])

  const activeQueryLabels = [
    searchParams.get('source_module') ? `Sumber: ${searchParams.get('source_module')}` : null,
    filterStatus !== 'all' ? `Status: ${filterStatus === 'pending' ? 'Pending' : STATUS_LABEL[filterStatus]}` : null,
    filterKind !== 'all' ? `Jenis: ${filterKind}` : null,
    filterYear !== 'all' ? `Tahun: ${filterYear}` : null,
    filterApproverRole !== 'all' ? `Approver: ${filterApproverRole}` : null,
  ].filter(Boolean)

  const resetFilters = () => {
    setSearch('')
    setFilterKind('all')
    setFilterStatus('all')
    setFilterYear('all')
    setFilterApproverRole('all')
  }

  const stats = {
    total: approvalSummary.total,
    pending: approvalSummary.pending,
    revision: approvalSummary.revision,
    done: approvalSummary.approved,
  }

  const processAction = async (item: ApprovalItem, action: ActionInput, actionNote?: string) => {
    if (!item.canAct) return toast.error('Role ini bersifat read-only untuk approval')
    if ((action === 'reject' || action === 'request_revision') && !actionNote?.trim()) {
      setNoteTarget({ item, action })
      setNote('')
      return
    }

    try {
      setProcessingId(item.id)
      const response = await fetch(`/api/approval/${item.id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, note: actionNote }),
      })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.message || 'Gagal memproses approval')
      toast.success(action === 'approve' ? 'Approval disetujui' : action === 'reject' ? 'Approval ditolak' : action === 'request_revision' ? 'Status minta revisi tersimpan' : 'Catatan tersimpan')
      setNoteTarget(null)
      setNote('')
      await load()
      await refreshApprovalSummary()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal memproses approval')
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <>
      <Topbar title="Approval Center" subtitle="Histori formal, catatan revisi, dan status approval sesuai role" />
      <div className="siaga-page-canvas space-y-5 p-4 sm:p-5">
        {activeQueryLabels.length > 0 && (
          <div className="siaga-filter-canvas flex flex-wrap items-center gap-2 p-3">
            {activeQueryLabels.map((label) => (
              <span key={label} className="rounded-full border border-blue-200 bg-white px-2.5 py-1 text-[11px] font-bold text-blue-700">{label}</span>
            ))}
            <button type="button" onClick={resetFilters} className="ml-auto inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-blue-700 shadow-sm">
              <RotateCcw className="h-3.5 w-3.5" /> Reset Filter
            </button>
          </div>
        )}
        {accessDenied ? (
          <div className="siaga-panel-canvas siaga-card-warning p-5 text-amber-900">
            <div className="text-base font-extrabold">Akses Dibatasi</div>
            <p className="mt-1 text-sm leading-6">
              Halaman ini hanya dapat diakses oleh user yang memiliki role dan penugasan aktif sesuai kewenangan.
              Silakan hubungi Admin Sistem jika akses ini diperlukan.
            </p>
          </div>
        ) : (
        <>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: 'Total Item', value: stats.total, icon: ClipboardCheck, tone: 'bg-blue-50 text-blue-700' },
            { label: 'Pending', value: stats.pending, icon: ListChecks, tone: 'bg-amber-50 text-amber-700' },
            { label: 'Minta Revisi', value: stats.revision, icon: RotateCcw, tone: 'bg-orange-50 text-orange-700' },
            { label: 'Selesai', value: stats.done, icon: ShieldCheck, tone: 'bg-green-50 text-green-700' },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="siaga-card-compact p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-2xl font-extrabold text-slate-900">{stat.value}</div>
                    <div className="text-xs font-medium text-slate-500">{stat.label}</div>
                  </div>
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.tone}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="siaga-table-canvas p-4">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="min-w-0 flex-1">
              <div className="text-base font-extrabold text-slate-900">Daftar Approval Formal</div>
              <div className="text-xs text-slate-500">Data berasal dari tabel approval dan histori approval. Pimpinan/Auditor hanya membaca.</div>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari paket/item..."
                  className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <select value={filterKind} onChange={(event) => setFilterKind(event.target.value as ApprovalEntityType | 'all')} className="h-10 rounded-lg border border-slate-200 px-3 text-sm">
                <option value="all">Semua Jenis</option>
                <option value="LAPORAN_HARIAN">Laporan Harian</option>
                <option value="RAB">RAB</option>
                <option value="SURVEY">Survey</option>
                <option value="KONTRAK">Kontrak</option>
                <option value="ADDENDUM">Addendum</option>
              </select>
              <select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value as ApprovalStatus | 'all' | 'pending')} className="h-10 rounded-lg border border-slate-200 px-3 text-sm">
                <option value="all">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="REVISION">Minta Revisi</option>
                <option value="APPROVED">Disetujui</option>
                <option value="REJECTED">Ditolak</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="siaga-empty-canvas p-8 text-center text-sm text-slate-500">Memuat approval...</div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<ClipboardCheck className="h-8 w-8" />}
              title="Belum ada data untuk filter ini"
              description="Silakan ubah filter atau tambah data sesuai kewenangan Anda."
            />
          ) : (
            <div className="space-y-3">
              {filtered.map((item) => (
                <div key={item.id} className="siaga-card-interactive p-4">
                  <div className="flex flex-col gap-3 xl:flex-row xl:items-start">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${ENTITY_TONE[item.entityType] || 'bg-slate-100 text-slate-700'}`}>{item.entityLabel}</span>
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusTone(item.status)}`}>{STATUS_LABEL[item.status]}</span>
                        <span className="text-xs text-slate-400">{formatDate(item.createdAt)}</span>
                      </div>
                      <div className="text-sm font-extrabold text-slate-900">{item.currentStep || item.entityLabel}</div>
                      <div className="mt-1 line-clamp-2 text-sm text-slate-600">{item.revisionNote || item.catatan || 'Belum ada catatan.'}</div>
                      <div className="mt-2 text-xs text-slate-500">
                        <Link href={`/proyek/${item.paketId}`} className="font-bold text-blue-700 hover:underline">{item.paketKode}</Link>
                        <span> - {item.paketNama} - approver {item.approver.name}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 xl:justify-end">
                      <button onClick={() => setSelected(item)} className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200">
                        <Eye className="h-3.5 w-3.5" /> Detail
                      </button>
                      {item.canAct && isPending(item.status) && (
                        <>
                          {item.canApprove && (
                            <button
                              disabled={processingId === item.id}
                              onClick={() => processAction(item, 'approve')}
                              className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-bold text-white hover:bg-green-700 disabled:bg-green-300"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" /> Setujui
                            </button>
                          )}
                          {item.canRequestRevision && (
                            <button
                              disabled={processingId === item.id}
                              onClick={() => processAction(item, 'request_revision')}
                              className="flex items-center gap-1 rounded-lg bg-orange-50 px-3 py-2 text-xs font-bold text-orange-700 hover:bg-orange-100 disabled:opacity-60"
                            >
                              <RotateCcw className="h-3.5 w-3.5" /> Minta Revisi
                            </button>
                          )}
                          {item.canReject && (
                            <button
                              disabled={processingId === item.id}
                              onClick={() => processAction(item, 'reject')}
                              className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-60"
                            >
                              <XCircle className="h-3.5 w-3.5" /> Tolak
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </>
        )}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Detail Approval" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="siaga-card-info p-4">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${ENTITY_TONE[selected.entityType] || 'bg-slate-100 text-slate-700'}`}>{selected.entityLabel}</span>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusTone(selected.status)}`}>{STATUS_LABEL[selected.status]}</span>
              </div>
              <div className="text-base font-extrabold text-slate-900">{selected.currentStep || selected.entityLabel}</div>
              <div className="mt-1 text-sm text-slate-600">{selected.revisionNote || selected.catatan || 'Belum ada catatan.'}</div>
              <div className="mt-2 text-xs text-slate-500">{selected.paketKode} - {selected.paketNama}</div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {[
                { label: 'Pemohon', value: selected.requester?.name || '-' },
                { label: 'Approver', value: selected.approver.name },
                { label: 'Update Terakhir', value: formatDate(selected.updatedAt) },
              ].map((item) => (
                <div key={item.label} className="siaga-card-compact siaga-card-neutral p-3">
                  <div className="text-[10px] font-bold uppercase text-slate-400">{item.label}</div>
                  <div className="mt-1 text-sm font-semibold text-slate-800">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="siaga-card-neutral p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <History className="h-4 w-4" /> Histori Approval
              </div>
              {selected.histories.length === 0 ? (
                <div className="text-sm text-slate-500">Belum ada histori.</div>
              ) : (
                <div className="space-y-3">
                  {selected.histories.map((history) => (
                    <div key={history.id} className="siaga-card-compact p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-sm font-bold text-slate-800">{ACTION_LABEL[history.action]}</div>
                        <div className="text-xs text-slate-400">{formatDate(history.createdAt)}</div>
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {history.actor?.name || 'Sistem'} - {history.actorRole || history.actor?.role || '-'} - status {STATUS_LABEL[history.statusAfter]}
                      </div>
                      {history.catatan && <div className="mt-2 text-sm text-slate-700">{history.catatan}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row">
              <Link href={`/proyek/${selected.paketId}`} className="siaga-card-interactive siaga-card-neutral flex-1 px-4 py-2.5 text-center text-sm font-bold text-slate-700">
                Lihat Ruang Paket
              </Link>
              {selected.canAct && isPending(selected.status) && (
                <>
                  {selected.canApprove && (
                    <button onClick={() => processAction(selected, 'approve')} disabled={processingId === selected.id} className="flex-1 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-green-700 disabled:bg-green-300">
                      Setujui
                    </button>
                  )}
                  {selected.canRequestRevision && (
                    <button onClick={() => processAction(selected, 'request_revision')} disabled={processingId === selected.id} className="flex-1 rounded-xl bg-orange-50 px-4 py-2.5 text-sm font-bold text-orange-700 hover:bg-orange-100 disabled:opacity-60">
                      Minta Revisi
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!noteTarget} onClose={() => setNoteTarget(null)} title={noteTarget?.action === 'reject' ? 'Catatan Penolakan' : 'Catatan Revisi'} size="md">
        {noteTarget && (
          <div className="space-y-4">
            <div className="rounded-xl border border-orange-100 bg-orange-50 p-3 text-sm text-orange-800">
              <div className="mb-1 flex items-center gap-2 font-bold">
                <MessageSquareWarning className="h-4 w-4" /> Catatan wajib
              </div>
              Catatan ini akan masuk ke histori approval dan audit log.
            </div>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={5}
              placeholder="Tuliskan alasan revisi atau penolakan secara jelas..."
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <div className="flex flex-col gap-2 sm:flex-row">
              <button onClick={() => setNoteTarget(null)} className="siaga-card-interactive siaga-card-neutral flex-1 px-4 py-2.5 text-sm font-bold text-slate-700">
                Batal
              </button>
              <button
                onClick={() => processAction(noteTarget.item, noteTarget.action, note)}
                disabled={!note.trim() || processingId === noteTarget.item.id}
                className="flex-1 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-800 disabled:bg-blue-300"
              >
                Simpan Catatan
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
