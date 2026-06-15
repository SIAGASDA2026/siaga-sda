'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useAppStore } from '@/store/useAppStore'
import { BRAND } from '@/lib/brand'
import { getInitials, getRoleLabel } from '@/lib/utils'
import { canAccessPage } from '@/lib/rbac'
import { getPendingApprovalCount, getScopedProjects } from '@/lib/dashboard-scope'
import { MAIN_NAVIGATION_ITEMS, type NavigationIconKey } from '@/lib/navigation'
import type { LucideIcon } from 'lucide-react'
import {
  Building2,
  ChevronLeft,
  CheckSquare,
  ClipboardList,
  FileCheck,
  FolderOpen,
  Gauge,
  Home,
  Landmark,
  LogOut,
  Mail,
  Map,
  MapPin,
  Settings,
} from 'lucide-react'

// Ikon tetap lokal; metadata dan route menu berasal dari shared navigation config.
const NAV_ICON_MAP: Record<NavigationIconKey, LucideIcon> = {
  dashboard: Home,
  map: Map,
  survey: MapPin,
  projects: FolderOpen,
  approval: CheckSquare,
  letters: Mail,
  administration: FileCheck,
  'flood-level': Landmark,
  assets: Building2,
  audit: ClipboardList,
  settings: Settings,
}

export function Sidebar() {
  const pathname = usePathname()
  const currentUser = useAppStore((state) => state.currentUser)
  const logout = useAppStore((state) => state.logout)
  const sidebarOpen = useAppStore((state) => state.sidebarOpen)
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen)
  const projects = useAppStore((state) => state.projects)
  if (!currentUser) return null

  const userProjects = getScopedProjects(projects, currentUser)
  const pendingApproval = getPendingApprovalCount(userProjects)

  const getBadge = (href: string) => {
    if (href === '/approval' && pendingApproval > 0)
      return pendingApproval > 99 ? '99+' : String(pendingApproval)
    return null
  }

  return (
    <aside
      className="fixed left-0 top-0 z-40 hidden h-full flex-col border-r border-cyan-400/10 bg-[#062449] text-white shadow-xl shadow-blue-950/20 transition-all duration-300 md:flex"
      style={{ width: sidebarOpen ? 256 : 72 }}
    >
      {/* Header / Logo */}
      <div className={`relative border-b border-white/10 px-3 ${sidebarOpen ? 'py-5' : 'py-4'}`}>
        <div className={`flex ${sidebarOpen ? 'flex-col items-center text-center' : 'items-center justify-center'}`}>
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 shadow-lg ring-1 ring-cyan-200/40">
            <img src={BRAND.logoPath} alt={`Logo ${BRAND.name}`} className="h-full w-full object-contain" loading="eager" />
          </div>
          {sidebarOpen && (
            <div className="mt-3 min-w-0 w-full px-1">
              <div className="text-xl font-black leading-none tracking-normal text-white">{BRAND.name}</div>
              <div className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-cyan-300">{BRAND.tagline}</div>
              <div className="mx-auto mt-2 h-px w-12 bg-cyan-300/40" />
              <div className="mt-2 text-[10px] leading-relaxed text-blue-100/80">{BRAND.fullName}</div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute right-1.5 top-3 flex h-7 w-7 items-center justify-center rounded-lg text-blue-100 transition-colors hover:bg-white/10 hover:text-white"
          title={sidebarOpen ? 'Perkecil menu' : 'Perbesar menu'}
        >
          <ChevronLeft className={`h-4 w-4 transition-transform duration-300 ${sidebarOpen ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* Unit badge */}
      {sidebarOpen && (
        <div className="mx-2 mt-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5">
          <div className="flex items-center gap-2 text-[10px] font-semibold text-blue-100">
            <Gauge className="h-3 w-3 text-cyan-300 flex-shrink-0" />
            <span className="truncate">{BRAND.unit}</span>
          </div>
        </div>
      )}

      {/* Nav items — filter otomatis berdasarkan role */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
        <div className="space-y-1">
          {MAIN_NAVIGATION_ITEMS.filter((item) => item.desktopInclude && canAccessPage(currentUser.role, item.routeKey)).map((item) => {
            const Icon = NAV_ICON_MAP[item.iconKey]
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            const badge = getBadge(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-all ${
                  isActive
                    ? 'bg-[#1976D2] text-white shadow-lg shadow-blue-950/30'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-cyan-100/90 group-hover:text-white'}`} />
                {sidebarOpen && (
                  <>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold leading-tight">{item.label}</span>
                      <span className={`block truncate text-[10px] leading-tight ${isActive ? 'text-white/70' : 'text-blue-200/60'}`}>
                        {item.description}
                      </span>
                    </span>
                    {badge && (
                      <span className={`flex-shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}`}>
                        {badge}
                      </span>
                    )}
                  </>
                )}
                {/* Tooltip saat collapsed */}
                {!sidebarOpen && (
                  <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 hidden -translate-y-1/2 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white shadow-lg whitespace-nowrap group-hover:block">
                    {item.label}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User footer */}
      <div className="border-t border-white/10 p-2">
        <div className="flex items-center gap-2 rounded-xl bg-white/5 p-2">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#43A047] text-[10px] font-bold text-white">
            {getInitials(currentUser.name)}
          </div>
          {sidebarOpen && (
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-bold text-white">{currentUser.name}</div>
              <div className="truncate text-[10px] font-medium text-blue-200">{getRoleLabel(currentUser.role)}</div>
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              logout()
              signOut({ callbackUrl: '/login' })
            }}
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-blue-100 transition-colors hover:bg-red-500/20 hover:text-red-100"
            title="Keluar"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
