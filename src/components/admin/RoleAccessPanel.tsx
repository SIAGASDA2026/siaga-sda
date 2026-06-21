'use client'

import { useMemo, useState } from 'react'
import { Proyek, Role, User } from '@/types'
import { getRoleLabel } from '@/lib/utils'
import { ROLE_DEFINITIONS, getRoleDefinition } from '@/lib/roles'
import { canManageRole, canViewAllProjects, hasPermission, PERMISSION_DEFINITIONS, PERMISSION_ROLES, Permission } from '@/lib/rbac'
import { Check, KeyRound, Lock, Search, ShieldCheck, Users } from 'lucide-react'

type RoleAccessPanelProps = {
  users: User[]
  projects: Proyek[]
  currentUser: User
}

const actionTone: Record<string, string> = {
  view: 'bg-slate-100 text-slate-700',
  create: 'bg-blue-100 text-blue-700',
  update: 'bg-cyan-100 text-cyan-700',
  approve: 'bg-green-100 text-green-700',
  delete: 'bg-red-100 text-red-700',
  manage: 'bg-purple-100 text-purple-700',
  upload: 'bg-amber-100 text-amber-700',
  publish: 'bg-orange-100 text-orange-700',
}

function getProjectAccess(user: User, projects: Proyek[]) {
  if (canViewAllProjects(user.role)) return projects
  return projects.filter((project) => {
    const byAssignment = project.assignedUsers?.includes(user.id)
    const byName = [project.ppk, project.pptk, project.kontraktor, project.konsultanPerencana, project.konsultanPengawasan]
      .filter(Boolean)
      .some((name) => String(name).toLowerCase() === user.name.toLowerCase())

    return byAssignment || byName || user.projectIds?.includes(project.id)
  })
}

export function RoleAccessPanel({ users, projects, currentUser }: RoleAccessPanelProps) {
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [query, setQuery] = useState('')

  const visibleRoles = ROLE_DEFINITIONS.filter((role) => roleFilter === 'all' || role.val === roleFilter)
  const visiblePermissions = PERMISSION_DEFINITIONS.filter((permission) => {
    const matchCategory = categoryFilter === 'all' || permission.category === categoryFilter
    const needle = query.trim().toLowerCase()
    const matchQuery = !needle || permission.label.toLowerCase().includes(needle) || permission.desc.toLowerCase().includes(needle)
    return matchCategory && matchQuery
  })

  const categories = Array.from(new Set(PERMISSION_DEFINITIONS.map((item) => item.category)))

  const summary = useMemo(() => {
    const totalAssignments = users.reduce((sum, user) => sum + getProjectAccess(user, projects).length, 0)
    return {
      roles: ROLE_DEFINITIONS.length,
      permissions: PERMISSION_DEFINITIONS.length,
      users: users.length,
      assignments: totalAssignments,
    }
  }, [projects, users])

  const usersByRole = (role: Role) => users.filter((user) => user.role === role)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Role Aktif', value: summary.roles, icon: ShieldCheck },
          { label: 'Permission', value: summary.permissions, icon: KeyRound },
          { label: 'User Terdaftar', value: summary.users, icon: Users },
          { label: 'Assignment Terbaca', value: summary.assignments, icon: Check },
        ].map((item) => {
          const Icon = item.icon
          const tone = item.label === 'Role Aktif'
            ? 'siaga-card-info'
            : item.label === 'Permission'
            ? 'siaga-card-recommendation'
            : item.label === 'User Terdaftar'
            ? 'siaga-card-success'
            : 'siaga-card-warning'
          return (
            <div key={item.label} className={`siaga-card-compact p-4 ${tone}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-extrabold text-slate-900">{item.value}</div>
                  <div className="text-xs font-medium text-slate-500">{item.label}</div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="siaga-card-warning p-4">
        <div className="flex items-start gap-3">
          <Lock className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
          <div>
            <div className="text-sm font-bold text-amber-900">Tahap ini memakai schema SIMONPRO yang sudah ada.</div>
            <div className="mt-1 text-xs leading-relaxed text-amber-800">
              Dokumen final meminta multi-role dan assignment aktif. Saat ini database aplikasi masih single-role per user, jadi halaman ini menjadi kontrol audit dan matriks hak akses yang membaca permission aktual. Upgrade multi-role penuh harus dibuat pada tahap migration tersendiri.
            </div>
          </div>
        </div>
      </div>

      <div className="siaga-table-canvas p-4">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="min-w-0 flex-1">
            <div className="text-base font-extrabold text-slate-900">Matriks Role & Hak Akses</div>
            <div className="text-xs text-slate-500">Sumber data: `src/lib/rbac.ts`, bukan label frontend semata.</div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari permission..."
                className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-48"
              />
            </div>
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="h-10 rounded-lg border border-slate-200 px-3 text-sm">
              <option value="all">Semua Kategori</option>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value as Role | 'all')} className="h-10 rounded-lg border border-slate-200 px-3 text-sm">
              <option value="all">Semua Role</option>
              {ROLE_DEFINITIONS.map((role) => <option key={role.val} value={role.val}>{role.label}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 border-b border-slate-100 bg-white px-3 py-2 text-left text-xs font-bold uppercase text-slate-400">Permission</th>
                {visibleRoles.map((role) => (
                  <th key={role.val} className="border-b border-slate-100 px-3 py-2 text-center text-xs font-bold text-slate-500">
                    {role.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visiblePermissions.map((permission) => (
                <tr key={permission.key} className="group">
                  <td className="sticky left-0 z-10 border-b border-slate-50 bg-white px-3 py-3">
                    <div className="flex items-start gap-2">
                      <span className={`mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${actionTone[permission.action]}`}>
                        {permission.action}
                      </span>
                      <div>
                        <div className="font-bold text-slate-800">{permission.label}</div>
                        <div className="text-xs text-slate-500">{permission.category} - {permission.desc}</div>
                      </div>
                    </div>
                  </td>
                  {visibleRoles.map((role) => {
                    const allowed = hasPermission(role.val, permission.key)
                    return (
                      <td key={`${permission.key}-${role.val}`} className="border-b border-slate-50 px-3 py-3 text-center">
                        <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${allowed ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-300'}`}>
                          {allowed ? <Check className="h-4 w-4" /> : <Lock className="h-3.5 w-3.5" />}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="siaga-card-recommendation p-4">
          <div className="mb-3">
            <div className="text-base font-extrabold text-slate-900">Tugas dan Batas Role</div>
            <div className="text-xs text-slate-500">Ringkasan operasional yang muncul saat admin memilih role.</div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {visibleRoles.map((role) => {
              const definition = getRoleDefinition(role.val)
              const count = usersByRole(role.val).length
              const currentCanManage = canManageRole(currentUser.role, role.val)
              return (
                <div key={role.val} className={`siaga-card-compact p-4 ${currentCanManage ? 'siaga-card-success' : 'siaga-card-neutral'}`}>
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-extrabold text-slate-900">{definition.label}</div>
                      <div className="text-xs text-slate-500">{definition.desc}</div>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">{count} user</span>
                  </div>
                  <div className="grid gap-3 text-xs md:grid-cols-2">
                    <div>
                      <div className="mb-1 font-bold uppercase text-slate-400">Tugas</div>
                      {definition.tugas.map((item) => <div key={item} className="mb-1 text-slate-600">- {item}</div>)}
                    </div>
                    <div>
                      <div className="mb-1 font-bold uppercase text-slate-400">Hak</div>
                      {definition.hak.map((item) => <div key={item} className="mb-1 text-slate-600">- {item}</div>)}
                    </div>
                  </div>
                  <div className={`mt-3 rounded-lg px-3 py-2 text-xs font-semibold ${currentCanManage ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                    {currentCanManage ? 'Role ini dapat dikelola oleh akun Anda.' : 'Role ini hanya bisa dikelola oleh kewenangan lebih tinggi.'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="siaga-card-info p-4">
          <div className="mb-3">
            <div className="text-base font-extrabold text-slate-900">Assignment Proyek Terbaca</div>
            <div className="text-xs text-slate-500">Berdasarkan PPK/PPTK, anggota proyek, dan projectIds legacy.</div>
          </div>
          <div className="space-y-2">
            {users.length === 0 ? (
              <div className="siaga-empty-canvas p-4 text-sm text-slate-500">Belum ada user.</div>
            ) : users.map((user) => {
              const access = getProjectAccess(user, projects)
              return (
                <div key={user.id} className={`siaga-card-compact p-3 ${canViewAllProjects(user.role) ? 'siaga-card-success' : access.length ? 'siaga-card-recommendation' : 'siaga-card-warning'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-bold text-slate-800">{user.name}</div>
                      <div className="truncate text-xs text-slate-500">{getRoleLabel(user.role)} - {user.email}</div>
                    </div>
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700">
                      {canViewAllProjects(user.role) ? 'Semua' : access.length}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {canViewAllProjects(user.role) ? (
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">Akses baca lintas proyek sesuai role</span>
                    ) : access.length ? access.slice(0, 4).map((project) => (
                      <span key={project.id} className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">{project.kode}</span>
                    )) : (
                      <span className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-600">Belum ada assignment</span>
                    )}
                    {!canViewAllProjects(user.role) && access.length > 4 && (
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">+{access.length - 4}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoleAccessPanel
