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

export function Topbar({ title, subtitle, action }: TopbarProps) {
  const { currentUser, sidebarOpen, projects, auditLogs, logout } = useAppStore()
  const [showNotif, setShowNotif] = useState(false)
  const [showUser, setShowUser] = useState(false)
  const [announcements, setAnnouncements] = useState<AnnouncementPreview[]>([])

  const openMasalah = projects.reduce((sum, project) => sum + project.masalah.filter((item) => item.status === 'open').length, 0)
  const masalahKritis = projects.reduce((sum, project) => sum + project.masalah.filter((item) => item.prioritas === 'kritis' && item.status !== 'closed').length, 0)
  const laporanMenunggu = projects.reduce((sum, project) => sum + project.laporanHarian.filter((item) => !item.disetujui).length, 0)
  const rabMenunggu = projects.reduce((sum, project) => sum + project.rabList.filter((item) => item.status !== 'approved' && item.status !== 'rejected').length, 0)
  const surveyMenunggu = projects.reduce((sum, project) => sum + project.surveys.filter((item) => item.status === 'submitted').length, 0)
  const totalChat = projects.reduce((sum, project) => sum + project.chat.length, 0)
  const kontrakAkanSelesai = projects.filter((project) => {
    if (!project.tanggalSelesai || project.status === 'selesai') return false
    const days = Math.ceil((new Date(project.tanggalSelesai).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days >= 0 && days <= 30
  })
  const proyekKritis = projects.filter((project) => project.health === 'kritis')
  const proyekWarning = projects.filter((project) => project.health === 'warning')
  const recentLogs = auditLogs.slice(0, 5)

  useEffect(() => {
    let active = true

    const loadAnnouncements = async () => {
      try {
        const response = await fetch('/api/announcements', { cache: 'no-store' })
        if (!response.ok) throw new Error('Gagal memuat pengumuman')
        const data = await response.json()
        if (active) setAnnouncements(Array.isArray(data) ? data.slice(0, 5) : [])
      } catch {
        if (active) setAnnouncements([])
      }
    }

    loadAnnouncements()
    const intervalId = window.setInterval(loadAnnouncements, 5000)
    return () => {
      active = false
      window.clearInterval(intervalId)
    }
  }, [])

  const notifications = useMemo<NotificationItem[]>(() => {
    const items: NotificationItem[] = []
    const role = currentUser?.role || 'pptk'
    const approvalPending = laporanMenunggu + rabMenunggu + surveyMenunggu

    if (approvalPending > 0 && canAccess(role, 'view_approval')) {
      items.push({
        id: 'approval-pending',
        href: '/approval',
        title: `${approvalPending} item approval menunggu`,
        desc: `${laporanMenunggu} laporan, ${rabMenunggu} RAB, ${surveyMenunggu} survey perlu diproses sesuai role.`,
        tone: 'amber',
        icon: ClipboardList,
        count: approvalPending,
        priority: 10,
        meta: 'Approval Center',
      })
    }

    if (masalahKritis > 0) {
      items.push({
        id: 'critical-issues',
        href: '/masalah',
        title: `${masalahKritis} masalah kritis`,
        desc: 'Perlu respons teknis segera dan tindak lanjut tercatat.',
        tone: 'red',
        icon: AlertTriangle,
        count: masalahKritis,
        priority: 1,
        meta: 'Masalah',
      })
    } else if (openMasalah > 0) {
      items.push({
        id: 'open-issues',
        href: '/masalah',
        title: `${openMasalah} masalah proyek masih open`,
        desc: 'Perlu PIC, batas waktu, dan tindak lanjut.',
        tone: 'amber',
        icon: AlertTriangle,
        count: openMasalah,
        priority: 20,
        meta: 'Masalah',
      })
    }

    if (proyekKritis.length > 0) {
      items.push({
        id: 'critical-projects',
        href: '/proyek',
        title: `${proyekKritis.length} proyek kritis`,
        desc: proyekKritis.map((project) => project.kode).join(', '),
        tone: 'red',
        icon: ShieldAlert,
        count: proyekKritis.length,
        priority: 2,
        meta: 'Warning Center',
      })
    }

    if (proyekWarning.length > 0) {
      items.push({
        id: 'warning-projects',
        href: '/proyek',
        title: `${proyekWarning.length} peringatan AI`,
        desc: 'AI menyarankan evaluasi deviasi sebelum menjadi kritis.',
        tone: 'amber',
        icon: Bot,
        count: proyekWarning.length,
        priority: 30,
        meta: 'AI',
      })
    }

    if (kontrakAkanSelesai.length > 0) {
      items.push({
        id: 'contract-ending',
        href: '/kontrak',
        title: `${kontrakAkanSelesai.length} kontrak mendekati selesai`,
        desc: kontrakAkanSelesai.map((project) => project.kode).join(', '),
        tone: 'amber',
        icon: ClipboardList,
        count: kontrakAkanSelesai.length,
        priority: 40,
        meta: 'Kontrak',
      })
    }

    if (totalChat > 0) {
      items.push({
        id: 'project-chat',
        href: '/chat',
        title: `${totalChat} pesan chat proyek`,
        desc: 'Buka komunikasi proyek untuk memantau koordinasi terbaru.',
        tone: 'blue',
        icon: MessageSquare,
        count: totalChat,
        priority: 70,
        meta: 'Chat',
      })
    }

    if (announcements.length > 0) {
      const pinned = announcements.filter((item) => item.pinned).length
      items.push({
        id: 'announcements',
        href: '/pengumuman',
        title: `${announcements.length} pengumuman terbaru`,
        desc: pinned > 0 ? `${pinned} pengumuman diprioritaskan.` : announcements[0]?.judul || 'Cek instruksi terbaru dari admin.',
        tone: pinned > 0 ? 'green' : 'blue',
        icon: Megaphone,
        count: announcements.length,
        priority: pinned > 0 ? 15 : 80,
        meta: 'Pengumuman',
      })
    }

    if (items.length === 0) {
      items.push({
        id: 'clear',
        href: '/dashboard',
        title: 'Tidak ada notifikasi prioritas',
        desc: 'Sistem tetap memantau approval, masalah, kontrak, chat, dan pengumuman.',
        tone: 'slate',
        icon: Bell,
        count: 0,
        priority: 100,
        meta: 'Realtime aktif',
      })
    }

    return items.sort((a, b) => a.priority - b.priority)
  }, [announcements, currentUser?.role, kontrakAkanSelesai, laporanMenunggu, masalahKritis, openMasalah, proyekKritis, proyekWarning, rabMenunggu, surveyMenunggu, totalChat])

  const dashboardTitle = `Dashboard ${getDashboardRoleLabel(currentUser?.role || 'pptk')}`
  const pageContext = subtitle ? `${title} - ${subtitle}` : title
  const totalNotif = notifications.reduce((sum, item) => sum + item.count, 0)

  const handleLogout = () => {
    logout()
    signOut({ callbackUrl: '/login' })
  }

  const NotificationPanel = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      onClick={(event) => event.stopPropagation()}
      className={mobile
      ? 'fixed left-3 right-3 top-16 z-[80] max-h-[70vh] overflow-y-auto rounded-xl border border-slate-100 bg-white shadow-xl'
      : 'absolute right-0 top-11 z-[80] w-80 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xl'}
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <span className="text-sm font-semibold text-slate-800">Notifikasi</span>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">{totalNotif > 99 ? '99+' : totalNotif}</span>
          <button
            type="button"
            onClick={() => setShowNotif(false)}
            className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100"
          >
            Tutup
          </button>
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
                    {item.count > 0 && <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">{item.count > 99 ? '99+' : item.count}</span>}
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
      className="app-topbar fixed right-0 top-0 z-50 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/95 px-3 shadow-sm backdrop-blur transition-all duration-300 md:px-6"
      style={{ ['--sidebar-left' as string]: `${sidebarOpen ? 256 : 76}px` }}
    >
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-3">
          <div className="hidden h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200 md:flex">
            <img src={BRAND.logoPath} alt={`Logo ${BRAND.name}`} className="h-full w-full object-contain" loading="eager" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-extrabold leading-tight text-slate-900 md:text-base">{dashboardTitle}</h1>
            <p className="truncate text-xs font-medium leading-tight text-slate-500">{currentUser?.name || `Pengguna ${BRAND.name}`}</p>
            <p className="hidden truncate text-[11px] leading-tight text-slate-400 md:block">{pageContext}</p>
          </div>
        </div>
      </div>

      {action && <div className="flex-shrink-0">{action}</div>}

      <div className="relative" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            setShowNotif(value => !value)
            setShowUser(false)
          }}
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
          title="Notifikasi"
        >
          <Bell className="h-4 w-4 text-slate-600" />
          {totalNotif > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
              {totalNotif > 9 ? '9+' : totalNotif}
            </span>
          )}
        </button>
        {showNotif && (
          <>
            <div className="hidden md:block"><NotificationPanel /></div>
            <div className="md:hidden"><NotificationPanel mobile /></div>
          </>
        )}
      </div>

      <div className="relative hidden md:block" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            setShowUser(value => !value)
            setShowNotif(false)
          }}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-1 pl-1 pr-2 shadow-sm transition-colors hover:bg-slate-50"
        >
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
            {getInitials(currentUser?.name || 'U')}
          </div>
          <div className="hidden text-left lg:block">
            <div className="text-xs font-semibold leading-tight text-slate-800">
              {currentUser?.name?.split(' ').slice(0, 2).join(' ')}
            </div>
            <div className="text-[10px] leading-tight text-slate-400">{getRoleLabel(currentUser?.role || 'pptk')}</div>
          </div>
          <ChevronDown className="hidden h-3 w-3 text-slate-400 lg:block" />
        </button>

        {showUser && (
          <div className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xl">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
                  {getInitials(currentUser?.name || 'U')}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{currentUser?.name?.split(' ').slice(0, 2).join(' ')}</div>
                  <div className="text-xs text-blue-200">{getRoleLabel(currentUser?.role || 'pptk')}</div>
                </div>
              </div>
            </div>

            <div className="py-1">
              <Link href="/pengaturan" onClick={() => setShowUser(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                Pengaturan
              </Link>
              <Link href="/panduan" onClick={() => setShowUser(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                Panduan
              </Link>
              <Link href="/audit-log" onClick={() => setShowUser(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                Audit Log
              </Link>
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
