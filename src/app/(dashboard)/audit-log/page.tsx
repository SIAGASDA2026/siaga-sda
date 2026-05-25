'use client'
import { useState, useMemo } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Topbar } from '@/components/layout/Topbar'
import { EmptyState } from '@/components/ui'
import { formatDateTime } from '@/lib/utils'
import { hasPermission } from '@/lib/rbac'
import { ClipboardList, Search, Download, Activity, Clock, Shield } from 'lucide-react'

const ACTION_META: Record<string, { label: string; color: string; icon: string }> = {
  LOGIN:           { label: 'Login',               color: 'bg-blue-100 text-blue-700',      icon: '🔑' },
  LOGOUT:          { label: 'Logout',              color: 'bg-slate-100 text-slate-600',    icon: '🚪' },
  CREATE_PROYEK:   { label: 'Buat Proyek',         color: 'bg-green-100 text-green-700',    icon: '📁' },
  UPDATE_PROYEK:   { label: 'Edit Proyek',         color: 'bg-blue-100 text-blue-700',      icon: '✏️' },
  DELETE_PROYEK:   { label: 'Hapus Proyek',        color: 'bg-red-100 text-red-700',        icon: '🗑️' },
  CREATE_SURVEY:   { label: 'Input Survey',        color: 'bg-teal-100 text-teal-700',      icon: '📍' },
  UPDATE_SURVEY:   { label: 'Edit Survey',         color: 'bg-teal-100 text-teal-700',      icon: '✏️' },
  DELETE_SURVEY:   { label: 'Hapus Survey',        color: 'bg-red-100 text-red-700',        icon: '🗑️' },
  UPLOAD_RAB:      { label: 'Upload RAB',          color: 'bg-amber-100 text-amber-700',    icon: '📊' },
  UPDATE_RAB:      { label: 'Edit RAB',            color: 'bg-amber-100 text-amber-700',    icon: '✏️' },
  DELETE_RAB:      { label: 'Hapus RAB',           color: 'bg-red-100 text-red-700',        icon: '🗑️' },
  UPLOAD_LAPORAN:  { label: 'Upload Laporan',      color: 'bg-green-100 text-green-700',    icon: '📝' },
  UPDATE_LAPORAN:  { label: 'Edit Laporan',        color: 'bg-green-100 text-green-700',    icon: '✏️' },
  DELETE_LAPORAN:  { label: 'Hapus Laporan',       color: 'bg-red-100 text-red-700',        icon: '🗑️' },
  APPROVE_LAPORAN: { label: 'Setujui Laporan',     color: 'bg-emerald-100 text-emerald-700',icon: '✅' },
  CREATE_CATATAN:  { label: 'Catatan Pengawasan',  color: 'bg-purple-100 text-purple-700',  icon: '👁️' },
  UPDATE_CATATAN:  { label: 'Edit Catatan',        color: 'bg-purple-100 text-purple-700',  icon: '✏️' },
  DELETE_CATATAN:  { label: 'Hapus Catatan',       color: 'bg-red-100 text-red-700',        icon: '🗑️' },
  CREATE_MASALAH:  { label: 'Lapor Masalah',       color: 'bg-red-100 text-red-700',        icon: '⚠️' },
  UPDATE_MASALAH:  { label: 'Update Masalah',      color: 'bg-red-100 text-red-700',        icon: '✏️' },
  DELETE_MASALAH:  { label: 'Hapus Masalah',       color: 'bg-red-100 text-red-700',        icon: '🗑️' },
  SEND_CHAT:       { label: 'Kirim Pesan',         color: 'bg-indigo-100 text-indigo-700',  icon: '💬' },
  CREATE_USER:     { label: 'Tambah User',         color: 'bg-blue-100 text-blue-700',      icon: '👤' },
  UPDATE_USER:     { label: 'Edit User',           color: 'bg-blue-100 text-blue-700',      icon: '✏️' },
  DELETE_USER:     { label: 'Hapus User',          color: 'bg-red-100 text-red-700',        icon: '🗑️' },
}

const PAGE_SIZE = 20

export default function AuditLogPage() {
  const { auditLogs, currentUser } = useAppStore()

  // FIX WARN 6: Guard dalam halaman — jika middleware tidak mencegah
  const canView = hasPermission(currentUser?.role ?? '', 'view_audit_log')
  if (!canView) {
    return (
      <>
        <Topbar title="Audit Log" subtitle="Jejak aktivitas sistem" />
        <div className="p-5">
          <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
            <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <div className="text-base font-semibold text-slate-600 mb-1">Akses Terbatas</div>
            <div className="text-sm text-slate-400">
              Anda tidak memiliki hak akses untuk melihat audit log sistem.
            </div>
          </div>
        </div>
      </>
    )
  }

  // Komponen AuditLogContent dipisah untuk menghindari conditional hooks
  return <AuditLogContent auditLogs={auditLogs} currentUser={currentUser} />
}

function AuditLogContent({ auditLogs, currentUser }: { auditLogs: any[]; currentUser: any }) {
  const [search, setSearch] = useState('')
  const [filterAction, setFilterAction] = useState('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return auditLogs.filter((log) => {
      const mQ =
        log.userName?.toLowerCase().includes(search.toLowerCase()) ||
        log.action?.toLowerCase().includes(search.toLowerCase()) ||
        log.detail?.toLowerCase().includes(search.toLowerCase())
      const mA = filterAction === 'all' || log.action === filterAction
      return mQ && mA
    })
  }, [auditLogs, search, filterAction])

  const paginated = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = paginated.length < filtered.length

  const uniqueActions = Array.from(new Set(auditLogs.map((l) => l.action))).sort()

  return (
    <>
      <Topbar title="Audit Log" subtitle={`${auditLogs.length} aktivitas tercatat`} />
      <div className="p-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Total Aktivitas', val: auditLogs.length, color: 'text-slate-800' },
            { label: 'Hari Ini', val: auditLogs.filter((l) => new Date(l.timestamp).toDateString() === new Date().toDateString()).length, color: 'text-blue-700' },
            { label: 'Login/Logout', val: auditLogs.filter((l) => ['LOGIN', 'LOGOUT'].includes(l.action)).length, color: 'text-green-700' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-100 p-4">
              <div className={`text-2xl font-bold ${s.color}`}>{s.val}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-xl border border-slate-100 p-4 mb-5 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Cari nama, aksi, detail..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterAction}
            onChange={(e) => { setFilterAction(e.target.value); setPage(1) }}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">Semua Aksi</option>
            {uniqueActions.map((a) => (
              <option key={a} value={a}>{ACTION_META[a]?.label || a}</option>
            ))}
          </select>
          <span className="text-xs text-slate-400">{filtered.length} entri</span>
        </div>

        {/* Log list */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={<ClipboardList className="w-8 h-8" />}
            title="Tidak ada log"
            description="Tidak ada aktivitas yang cocok dengan filter"
          />
        ) : (
          <div className="space-y-2">
            {paginated.map((log) => {
              const meta = ACTION_META[log.action] || { label: log.action, color: 'bg-slate-100 text-slate-600', icon: '📋' }
              return (
                <div key={log.id} className="bg-white rounded-xl border border-slate-100 p-4 flex items-start gap-3">
                  <div className="text-xl flex-shrink-0 mt-0.5">{meta.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.color}`}>{meta.label}</span>
                      <span className="text-sm font-semibold text-slate-800">{log.userName}</span>
                    </div>
                    {log.detail && <div className="text-xs text-slate-500 truncate">{log.detail}</div>}
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      {formatDateTime(log.timestamp)}
                    </div>
                    {log.entity && (
                      <div className="text-[10px] text-slate-400 mt-0.5">{log.entity}</div>
                    )}
                  </div>
                </div>
              )
            })}
            {hasMore && (
              <div className="text-center pt-2">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 text-sm text-blue-600 font-medium hover:underline"
                >
                  Tampilkan lebih banyak ({filtered.length - paginated.length} lagi)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
