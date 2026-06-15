'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { useAppStore } from '@/store/useAppStore'
import { BRAND } from '@/lib/brand'
import { formatDateTime, getDashboardRoleLabel, getInitials, getRoleLabel } from '@/lib/utils'
import {
  AlertTriangle,
  Bell,
  Bot,
  ChevronDown,
  ClipboardList,
  LogOut,
  Megaphone,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react'
import { canAccess } from '@/lib/utils'
import { getScopedAuditLogs, getScopedProjects } from '@/lib/dashboard-scope'
import { useApprovalSummary } from '@/components/approval/ApprovalSummaryProvider'

interface TopbarProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

type NotificationItem = {
  id: string
  href: string
  title: string
  desc: string
  tone: 'red' | 'amber' | 'blue' | 'green' | 'slate'
  icon: typeof Bell
  count: number
  priority: number
  meta?: string
}

const toneClass: Record<NotificationItem['tone'], string> = {
  red: 'bg-red-50 text-red-700',
  amber: 'bg-amber-50 text-amber-700',
  blue: 'bg-blue-50 text-blue-700',
  green: 'bg-green-50 text-green-700',
  slate: 'bg-slate-100 text-slate-700',
}

type AnnouncementPreview = {
  id: string
  judul: string
  kategori: string
  pinned: boolean
  createdAt: string
}

const ANNOUNCEMENT_REFRESH_MS = 60_000
let announcementCache: AnnouncementPreview[] = []
let announcementCacheAt = 0

export function Topbar({ title, subtitle, action }: TopbarProps) {
  const currentUser = useAppStore((state) => state.currentUser)
  const sidebarOpen = useAppStore((state) => state.sidebarOpen)
  const projects = useAppStore((state) => state.projects)
  const auditLogs = useAppStore((state) => state.auditLogs)
  const logout = useAppStore((state) => state.logout)
  const { summary: approvalSummary } = useApprovalSummary()
  const [showNotif, setShowNotif] = useState(false)
  const [showUser, setShowUser] = useState(false)
  const [announcements, setAnnouncements] = useState<AnnouncementPreview[]>(announcementCache)
  const role = currentUser?.role || 'pptk'
  const scopedProjects = useMemo(() => getScopedProjects(projects, currentUser), [currentUser, projects])

  const openMasalah = scopedProjects.reduce((sum, p) => sum + p.masalah.filter((m) => m.status === 'open').length, 0)
  const masalahKritis = scopedProjects.reduce((sum, p) => sum + p.masalah.filter((m) => m.prioritas === 'kritis' && m.status !== 'closed').length, 0)
  const totalChat = scopedProjects.reduce((sum, p) => sum + p.chat.length, 0)
  const kontrakAkanSelesai = scopedProjects.filter((p) => {
    if (!p.tanggalSelesai || p.status === 'selesai') return false
    const days = Math.ceil((new Date(p.tanggalSelesai).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days >= 0 && days <= 30
  })
  const proyekKritis = scopedProjects.filter((p) => p.health === 'kritis')
  const proyekWarning = scopedProjects.filter((p) => p.health === 'warning')
  const recentLogs = canAccess(role, 'view_audit_log')
    ? getScopedAuditLogs(auditLogs, scopedProjects, currentUser).slice(0, 5)
    : []

  useEffect(() => {
    let active = true
    const load = async (force = false) => {
      if (!force && announcementCacheAt && Date.now() - announcementCacheAt < ANNOUNCEMENT_REFRESH_MS) {
        if (active) setAnnouncements(announcementCache)
        return
      }
      try {
        const res = await fetch('/api/announcements', { cache: 'no-store' })
        if (!res.ok) throw new Error()
        const data = await res.json()
        announcementCache = Array.isArray(data) ? data.slice(0, 5) : []
        announcementCacheAt = Date.now()
        if (active) setAnnouncements(announcementCache)
      } catch {
        if (active && announcementCache.length === 0) setAnnouncements([])
      }
    }
    load()
    const id = window.setInterval(() => load(true), ANNOUNCEMENT_REFRESH_MS)
    return () => { active = false; window.clearInterval(id) }
  }, [])

  const notifications = useMemo<NotificationItem[]>(() => {
    const items: NotificationItem[] = []
    const approvalPending = approvalSummary.pending

    if (approvalPending > 0 && canAccess(role, 'view_approval')) {
      items.push({ id: 'approval-pending', href: '/approval?approval_status=pending&source_module=topbar', title: `${approvalPending} item approval menunggu`, desc: 'Ringkasan formal sesuai role dan penugasan aktif.', tone: 'amber', icon: ClipboardList, count: approvalPending, priority: 10, meta: 'Approval Center' })
    }
    if (masalahKritis > 0 && canAccess(role, 'view_issues')) {
      items.push({ id: 'critical-issues', href: '/masalah', title: `${masalahKritis} masalah kritis`, desc: 'Perlu respons teknis segera.', tone: 'red', icon: AlertTriangle, count: masalahKritis, priority: 1, meta: 'Masalah' })
    } else if (openMasalah > 0 && canAccess(role, 'view_issues')) {
      items.push({ id: 'open-issues', href: '/masalah', title: `${openMasalah} masalah masih open`, desc: 'Perlu tindak lanjut.', tone: 'amber', icon: AlertTriangle, count: openMasalah, priority: 20, meta: 'Masalah' })
    }
    if (proyekKritis.length > 0 && canAccess(role, 'view_projects')) {
      items.push({ id: 'critical-projects', href: '/proyek?health=kritis&source_module=topbar', title: `${proyekKritis.length} proyek kritis`, desc: proyekKritis.map((p) => p.kode).join(', '), tone: 'red', icon: ShieldAlert, count: proyekKritis.length, priority: 2, meta: 'Warning Center' })
    }
    if (proyekWarning.length > 0 && canAccess(role, 'view_projects')) {
      items.push({ id: 'warning-projects', href: '/proyek?health=warning&source_module=topbar', title: `${proyekWarning.length} peringatan deviasi`, desc: 'Insight lokal: evaluasi deviasi sebelum kritis.', tone: 'amber', icon: Bot, count: proyekWarning.length, priority: 30, meta: 'Insight Lokal' })
    }
    if (kontrakAkanSelesai.length > 0 && canAccess(role, 'view_contracts')) {
      items.push({ id: 'contract-ending', href: '/kontrak', title: `${kontrakAkanSelesai.length} kontrak mendekati selesai`, desc: kontrakAkanSelesai.map((p) => p.kode).join(', '), tone: 'amber', icon: ClipboardList, count: kontrakAkanSelesai.length, priority: 40, meta: 'Kontrak' })
    }
    if (totalChat > 0 && canAccess(role, 'view_chat')) {
      items.push({ id: 'project-chat', href: '/chat', title: `${totalChat} pesan chat proyek`, desc: 'Pantau koordinasi terbaru.', tone: 'blue', icon: MessageSquare, count: totalChat, priority: 70, meta: 'Chat' })
    }
    if (announcements.length > 0 && canAccess(role, 'view_announcements')) {
      const pinned = announcements.filter((a) => a.pinned).length
      items.push({ id: 'announcements', href: '/pengumuman', title: `${announcements.length} pengumuman terbaru`, desc: pinned > 0 ? `${pinned} diprioritaskan.` : announcements[0]?.judul || '', tone: pinned > 0 ? 'green' : 'blue', icon: Megaphone, count: announcements.length, priority: pinned > 0 ? 15 : 80, meta: 'Pengumuman' })
    }
    if (items.length === 0) {
      items.push({ id: 'clear', href: '/dashboard', title: 'Tidak ada notifikasi prioritas', desc: 'Sistem memantau approval, masalah, kontrak, dan chat.', tone: 'slate', icon: Bell, count: 0, priority: 100, meta: 'Realtime aktif' })
    }
    return items.sort((a, b) => a.priority - b.priority)
  }, [announcements, approvalSummary.pending, kontrakAkanSelesai, masalahKritis, openMasalah, proyekKritis, proyekWarning, role, totalChat])

  const dashboardTitle = `Dashboard ${getDashboardRoleLabel(currentUser?.role || 'pptk')}`
  const pageContext = subtitle ? `${title} - ${subtitle}` : title
  const totalNotif = notifications.reduce((sum, n) => sum + n.count, 0)
  const handleLogout = () => { logout(); signOut({ callbackUrl: '/login' }) }

  const NotifPanel = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      onClick={(e) => e.stopPropagation()}
      className={mobile
        ? 'fixed left-3 right-3 top-16 z-[80] max-h-[70dvh] overflow-y-auto rounded-xl border border-slate-100 bg-white shadow-xl'
        : 'absolute right-0 top-12 z-[80] w-80 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xl'}
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
        <span className="text-sm font-semibold text-slate-800">Notifikasi</span>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">{totalNotif > 99 ? '99+' : totalNotif}</span>
          <button type="button" onClick={() => setShowNotif(false)} className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100">Tutup</button>
        </div>
      </div>
      <div className={mobile ? '' : 'max-h-80 overflow-y-auto'}>
        {notifications.map((item) => {
          const Icon = item.icon
          return (
            <Link key={`${mobile ? 'm-' : ''}${item.id}`} href={item.href} onClick={() => setShowNotif(false)}>
              <div className="flex items-start gap-3 border-b border-slate-50 px-4 py-3 transition-colors hover:bg-slate-50">
                <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl ${toneClass[item.tone]}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-semibold text-slate-800">{item.title}</div>
                    {item.count > 0 && <span className="flex-shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">{item.count > 99 ? '99+' : item.count}</span>}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">{item.desc}</div>
                  {item.meta && <div className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">{item.meta}</div>}
                </div>
              </div>
            </Link>
          )
        })}
        <div className="border-t border-slate-100 bg-slate-50 px-4 py-2">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-500">Aktivitas Terbaru</div>
            <div className="text-[10px] font-semibold text-green-600">Realtime aktif</div>
          </div>
          {recentLogs.length === 0 ? (
            <div className="py-2 text-xs text-slate-400">Belum ada aktivitas.</div>
          ) : recentLogs.map((log) => (
            <div key={log.id} className="flex items-center gap-2 py-1.5">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                <ClipboardList className="h-3.5 w-3.5 text-blue-700" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[11px] text-slate-700">{log.detail || log.action}</div>
                <div className="text-[10px] text-slate-400">{log.userName} - {formatDateTime(log.timestamp)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <header
      className="app-topbar fixed top-0 z-50 flex h-16 items-center gap-2 border-b border-slate-200 bg-white/95 px-3 shadow-sm backdrop-blur transition-all duration-300 md:gap-3 md:px-5"
      style={{ ['--sidebar-left' as string]: `${sidebarOpen ? 256 : 72}px` }}
    >
      {/* Title */}
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2 md:gap-3">
          <div className="hidden h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200 md:flex">
            <img src={BRAND.logoPath} alt={`Logo ${BRAND.name}`} className="h-full w-full object-contain" loading="eager" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-extrabold leading-tight text-slate-900 md:text-base">{dashboardTitle}</h1>
            <p className="truncate text-xs leading-tight text-slate-500">{currentUser?.name || `Pengguna ${BRAND.name}`}</p>
            <p className="hidden truncate text-[11px] leading-tight text-slate-400 md:block">{pageContext}</p>
          </div>
        </div>
      </div>

      {/* Action slot */}
      {action && <div className="flex-shrink-0">{action}</div>}

      {/* Notifikasi */}
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setShowNotif((v) => !v); setShowUser(false) }}
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
          title="Notifikasi"
        >
          <Bell className="h-4 w-4" />
          {totalNotif > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
              {totalNotif > 9 ? '9+' : totalNotif}
            </span>
          )}
        </button>
        {showNotif && (
          <>
            <div className="hidden md:block"><NotifPanel /></div>
            <div className="md:hidden"><NotifPanel mobile /></div>
          </>
        )}
      </div>

      {/* User menu — hanya desktop */}
      <div className="relative hidden md:block" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setShowUser((v) => !v); setShowNotif(false) }}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-1 pl-1 pr-2 shadow-sm transition-colors hover:bg-slate-50"
        >
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
            {getInitials(currentUser?.name || 'U')}
          </div>
          <div className="hidden text-left lg:block">
            <div className="max-w-[120px] truncate text-xs font-semibold leading-tight text-slate-800">
              {currentUser?.name?.split(' ').slice(0, 2).join(' ')}
            </div>
            <div className="text-[10px] leading-tight text-slate-400">{getRoleLabel(currentUser?.role || 'pptk')}</div>
          </div>
          <ChevronDown className="hidden h-3 w-3 text-slate-400 lg:block" />
        </button>

        {showUser && (
          <div className="absolute right-0 top-11 z-50 w-52 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xl">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
                  {getInitials(currentUser?.name || 'U')}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold text-white">{currentUser?.name?.split(' ').slice(0, 2).join(' ')}</div>
                  <div className="text-xs text-blue-200">{getRoleLabel(currentUser?.role || 'pptk')}</div>
                </div>
              </div>
            </div>
            <div className="py-1">
              <Link href="/pengaturan" onClick={() => setShowUser(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">Pengaturan</Link>
              <Link href="/panduan" onClick={() => setShowUser(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">Panduan</Link>
              <Link href="/audit-log" onClick={() => setShowUser(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">Audit Log</Link>
              <div className="mx-4 my-1 border-t border-slate-100" />
              <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50">
                <LogOut className="h-4 w-4" /> Keluar
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Topbar
