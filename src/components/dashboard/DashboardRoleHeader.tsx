'use client'

import {
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  Clock,
  KeyRound,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import { PERMISSION_DEFINITIONS, hasPermission } from '@/lib/rbac'
import { getRoleDefinition } from '@/lib/roles'
import { getInitials } from '@/lib/utils'
import { Proyek, Role, User } from '@/types'

type DashboardRoleHeaderProps = {
  currentUser: User | null
  projects: Proyek[]
  dateLabel: string
  timeLabel: string
  notificationCount: number
}

type SummaryPanelProps = {
  label: string
  icon: typeof BriefcaseBusiness
  items: string[]
  emptyLabel?: string
}

const NON_ASSIGNMENT_ROLE_SCOPES: Partial<Record<Role, string[]>> = {
  super_admin: [
    'Cakupan seluruh sistem dan data',
    'Mengelola user, role, assignment, dan pengaturan',
    'Tidak berbasis penugasan paket',
  ],
  admin: [
    'Cakupan administrasi sistem sesuai izin',
    'Membantu pengelolaan user dan pemantauan data',
    'Tidak berbasis penugasan paket',
  ],
  pimpinan: [
    'Cakupan monitoring dan rekap seluruh bidang',
    'Akses bersifat read-only',
    'Tidak berbasis penugasan paket',
  ],
  kabid: [
    'Cakupan monitoring paket dan rekap bidang',
    'Akses sesuai kewenangan Kepala Bidang',
    'Tidak berbasis penugasan paket tunggal',
  ],
  auditor: [
    'Cakupan audit trail, dokumen, dan riwayat perubahan',
    'Akses bersifat read-only',
    'Tidak berbasis penugasan paket',
  ],
}

function SummaryPanel({ label, icon: Icon, items, emptyLabel = 'Belum tersedia' }: SummaryPanelProps) {
  const visibleItems = items.slice(0, 3)
  const hiddenItems = items.slice(visibleItems.length)
  const remainingCount = Math.max(items.length - visibleItems.length, 0)

  return (
    <div className="rounded-xl border border-white/15 bg-white/[0.07] p-2.5 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-cyan-100">
        <Icon className="h-3.5 w-3.5 text-cyan-300" />
        {label}
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {visibleItems.length ? visibleItems.map((item) => (
          <span key={item} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1 text-[10px] font-medium leading-snug text-white">
            {item}
          </span>
        )) : (
          <span className="text-[11px] leading-relaxed text-blue-100/80">{emptyLabel}</span>
        )}
      </div>
      {remainingCount > 0 && (
        <details className="group/items mt-2">
          <summary className="inline-flex cursor-pointer list-none items-center gap-1 rounded-lg border border-cyan-200/20 bg-cyan-300/10 px-2 py-1 text-[10px] font-bold text-cyan-100 transition hover:bg-cyan-300/20 marker:content-none">
            <span className="group-open/items:hidden">+{remainingCount} lainnya</span>
            <span className="hidden group-open/items:inline">Sembunyikan</span>
            <ChevronDown className="h-3 w-3 transition-transform group-open/items:rotate-180" />
          </summary>
          <div className="mt-2 flex flex-wrap gap-1 border-t border-white/10 pt-2">
            {hiddenItems.map((item) => (
              <span key={item} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1 text-[10px] font-medium leading-snug text-white">
                {item}
              </span>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}

export function DashboardRoleHeader({
  currentUser,
  projects,
  dateLabel,
  timeLabel,
  notificationCount,
}: DashboardRoleHeaderProps) {
  const role = currentUser?.role || 'pptk'
  const roleDefinition = getRoleDefinition(role)
  const viewPermissions = PERMISSION_DEFINITIONS
    .filter((permission) => permission.action === 'view' && hasPermission(role, permission.key))
    .map((permission) => permission.label)
  const actionPermissions = PERMISSION_DEFINITIONS
    .filter((permission) => permission.action !== 'view' && hasPermission(role, permission.key))
    .map((permission) => permission.label)

  const assignedProjects = currentUser
    ? projects.filter((project) => (
      project.assignedUsers?.includes(currentUser.id)
      || currentUser.projectIds?.includes(project.id)
    ))
    : []
  const assignmentItems = assignedProjects.map((project) => `${project.kode} - ${project.nama}`)
  const nonAssignmentScope = NON_ASSIGNMENT_ROLE_SCOPES[role]
  const workScopeLabel = nonAssignmentScope ? 'Cakupan Kerja' : 'Penugasan Aktif'
  const workScopeItems = nonAssignmentScope || assignmentItems
  const workScopeEmptyLabel = nonAssignmentScope
    ? 'Cakupan kerja role belum tersedia.'
    : 'Belum ada penugasan paket spesifik pada data user.'
  const userName = currentUser?.name?.trim() || 'Nama user belum tersedia'

  return (
    <section className="relative z-10 overflow-hidden rounded-[24px] border border-blue-950/40 bg-gradient-to-br from-[#071f3d] via-[#0d2c54] to-[#114c78] text-white shadow-[0_18px_50px_rgba(13,44,84,0.20)]">
      <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 left-1/4 h-60 w-60 rounded-full bg-blue-300/10 blur-3xl" />

      <div className="relative p-3 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.26em] text-cyan-300 sm:text-xs">
              Dashboard Command Center
            </div>
            <h1 className="mt-1 text-lg font-black tracking-tight text-white sm:text-xl">SIAGA-SDA Hari Ini</h1>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-blue-100 sm:text-sm">
              Pantauan cepat proyek, risiko, kondisi SDA, dan tanggung jawab sesuai role aktif.
            </p>

            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-2.5 py-1.5 text-[10px] text-blue-50 backdrop-blur-sm">
                <Clock className="h-3.5 w-3.5 text-cyan-300" />
                <span>{dateLabel} <span className="text-cyan-300">•</span> {timeLabel}</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-2.5 py-1.5 text-[10px] text-blue-50 backdrop-blur-sm">
                <Bell className="h-3.5 w-3.5 text-cyan-300" />
                <span>{notificationCount} notifikasi</span>
              </div>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-2.5 rounded-2xl border border-cyan-200/20 bg-cyan-300/10 p-2.5 shadow-sm backdrop-blur-sm lg:min-w-[270px]">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white text-xs font-black text-[#0d2c54] shadow-sm">
              {getInitials(userName)}
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-cyan-200">Peran Saya</div>
              <div className="mt-0.5 truncate text-sm font-bold text-white">{userName}</div>
              <div className="truncate text-xs font-semibold text-cyan-100">{roleDefinition.label}</div>
              <div className="mt-0.5 line-clamp-1 text-[10px] leading-relaxed text-blue-100/85">{roleDefinition.desc}</div>
            </div>
          </div>
        </div>

        <details className="group mt-3 rounded-xl border border-white/15 bg-white/[0.07]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-white/[0.05] marker:content-none">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-cyan-300" />
              <span className="group-open:hidden">Lihat Tugas, Akses &amp; Cakupan Role</span>
              <span className="hidden group-open:inline">Sembunyikan Detail Role</span>
            </span>
            <ChevronDown className="h-4 w-4 text-cyan-200 transition-transform group-open:rotate-180" />
          </summary>
          <div className="grid gap-2 border-t border-white/10 p-2 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryPanel label="Tugas Utama" icon={BriefcaseBusiness} items={roleDefinition.tugas} />
            <SummaryPanel label="Akses Saya" icon={ShieldCheck} items={viewPermissions} />
            <SummaryPanel label="Hak Aksi" icon={KeyRound} items={actionPermissions} emptyLabel="Role ini bersifat baca saja." />
            <SummaryPanel
              label={workScopeLabel}
              icon={UserRound}
              items={workScopeItems}
              emptyLabel={workScopeEmptyLabel}
            />
          </div>
        </details>
      </div>
    </section>
  )
}

export default DashboardRoleHeader
