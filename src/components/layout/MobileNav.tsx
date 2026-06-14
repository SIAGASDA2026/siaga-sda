'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useMemo, useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { BRAND } from '@/lib/brand'
import { canAccessPage } from '@/lib/rbac'
import { getRoleLabel } from '@/lib/utils'
import {
  Building2,
  CheckSquare,
  ClipboardList,
  FileCheck,
  FolderOpen,
  Landmark,
  LayoutDashboard,
  LogOut,
  Map,
  MapPin,
  Menu,
  Mail,
  Search,
  Settings,
  X,
} from 'lucide-react'

const PRIMARY_NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/peta',      label: 'Peta',      icon: Map },
  { href: '/proyek',    label: 'Paket',      icon: FolderOpen },
  { href: '/approval',  label: 'Approval',   icon: CheckSquare },
]

// FIX KRITIS 2 (mobile): Semua menu ada — canAccessPage() filter otomatis berdasarkan role
const MENU_GROUPS = [
  {
    section: 'Monitoring',
    items: [
      { href: '/dashboard',   label: 'Dashboard',          icon: LayoutDashboard },
      { href: '/peta',        label: 'Peta Monitoring',    icon: Map },
      { href: '/survey',      label: 'Survey Investigasi', icon: MapPin },
    ],
  },
  {
    section: 'Paket & Administrasi',
    items: [
      { href: '/proyek',      label: 'Paket Pekerjaan',    icon: FolderOpen },
      { href: '/approval',    label: 'Approval Center',    icon: CheckSquare },
      { href: '/surat',       label: 'Surat Masuk & Keluar', icon: Mail },
      { href: '/administrasi', label: 'Administrasi',       icon: FileCheck },
    ],
  },
  {
    section: 'SDA & Sistem',
    items: [
      { href: '/peil',        label: 'Peil Banjir',        icon: Landmark },
      { href: '/asset',       label: 'Asset SDA',          icon: Building2 },
      { href: '/audit-log',   label: 'Audit Log',          icon: ClipboardList },
      { href: '/pengaturan',  label: 'Pengaturan',         icon: Settings },
    ],
  },
]

export function MobileNav() {
  const pathname = usePathname()
  const { projects, currentUser, logout } = useAppStore()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  // FIX KRITIS 4 (mobile): Filter proyek berdasarkan role/assignment user
  const userProjects =
    currentUser?.role === 'super_admin' || currentUser?.role === 'admin'
      ? projects
      : projects.filter(
          (p) =>
            p.assignedUsers?.includes(currentUser?.id ?? '') ||
            p.pptk === currentUser?.id ||
            p.ppk === currentUser?.id,
        )

  const pendingApproval = userProjects.reduce((sum, project) => (
    sum +
    project.laporanHarian.filter((item) => !item.disetujui).length +
    project.rabList.filter((item) => item.status !== 'approved').length +
    project.surveys.filter((item) => item.status === 'submitted').length
  ), 0)

  const getBadge = (href: string) => {
    if (href === '/approval' && pendingApproval > 0) return pendingApproval > 9 ? '9+' : String(pendingApproval)
    return null
  }

  const filteredGroups = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return MENU_GROUPS.map((group) => ({
      ...group,
      items: group.items
        .filter((item) => canAccessPage(currentUser?.role ?? '', item.href))
        .filter((item) => !needle || item.label.toLowerCase().includes(needle) || group.section.toLowerCase().includes(needle)),
    })).filter((group) => group.items.length > 0)
  }, [currentUser?.role, query])

  const handleLogout = () => {
    logout()
    signOut({ callbackUrl: '/login' })
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[70] bg-slate-950/50 md:hidden" onClick={() => setOpen(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 flex max-h-[88dvh] flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-slate-100 bg-slate-50 px-4 pb-3 pt-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200">
                    <img src={BRAND.logoPath} alt={`Logo ${BRAND.name}`} className="h-full w-full object-contain" loading="eager" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-extrabold text-slate-900">Menu {BRAND.name}</div>
                    <div className="truncate text-xs text-slate-500">{BRAND.fullName}</div>
                    <div className="truncate text-[11px] text-slate-400">{currentUser?.name || 'Pengguna'} - {currentUser?.role ? getRoleLabel(currentUser.role) : '-'}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari menu..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#1976D2] focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
              {filteredGroups.map((group) => (
                <div key={group.section} className="mb-4">
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">{group.section}</div>
                  <div className="grid grid-cols-2 gap-2">
                    {group.items.map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                      const badge = getBadge(item.href)

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={`relative flex min-h-[56px] items-center gap-3 rounded-xl border px-3 py-3 text-sm font-bold ${
                            isActive
                              ? 'border-[#1976D2] bg-blue-50 text-[#0D2C54]'
                              : 'border-slate-100 bg-white text-slate-700 shadow-sm'
                          }`}
                        >
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <span className="min-w-0 truncate">{item.label}</span>
                          {badge && (
                            <span className="absolute right-2 top-2 rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                              {badge}
                            </span>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-50 text-sm font-extrabold text-red-600"
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
        <div className="grid h-16 grid-cols-5">
          {PRIMARY_NAV.filter((item) => canAccessPage(currentUser?.role ?? '', item.href)).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            const badge = getBadge(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-colors ${
                  isActive ? 'text-[#0D2C54]' : 'text-slate-400'
                }`}
              >
                {isActive && <span className="absolute top-0 h-0.5 w-8 rounded-b-full bg-[#1976D2]" />}
                <span className="relative">
                  <Icon className="h-5 w-5" />
                  {badge && (
                    <span className="absolute -right-2 -top-2 rounded-full bg-red-500 px-1 py-0.5 text-[8px] font-bold leading-none text-white">
                      {badge}
                    </span>
                  )}
                </span>
                <span>{item.label}</span>
              </Link>
            )
          })}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold text-slate-500"
          >
            <Menu className="h-5 w-5" />
            <span>Menu</span>
          </button>
        </div>
      </nav>
    </>
  )
}

export default MobileNav
