'use client'

import { FileText } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { ModuleLandingPage } from '@/components/modules/ModuleLandingPage'
import { hasPermission } from '@/lib/rbac'

export default function AdministrasiPage() {
  const { currentUser } = useAppStore()
  const role = currentUser?.role ?? ''

  const canManageUsers = hasPermission(role, 'manage_users')
  const canViewAudit   = hasPermission(role, 'view_audit_log')

  // Cards yang ditampilkan disesuaikan dengan hak role
  const cards = [
    ...(canManageUsers
      ? [{ label: 'Pengguna', value: 'Aktif', desc: 'Manajemen user dan role tersedia di menu Pengguna.' }]
      : []),
    { label: 'Pengaturan', value: 'Aktif', desc: 'Konfigurasi dasar tersedia di menu Pengaturan.' },
    ...(canViewAudit
      ? [{ label: 'Audit Log', value: 'Aktif', desc: 'Jejak aktivitas tersedia di menu Audit Log.' }]
      : []),
  ]

  const checklist = [
    ...(canManageUsers ? ['Administrasi role dan assignment final'] : []),
    'Konfigurasi threshold SDA',
    'Master data petugas/asset/stasiun',
    ...(canViewAudit ? ['Audit-safe untuk semua perubahan penting'] : []),
  ]

  return (
    <ModuleLandingPage
      title="Administrasi"
      subtitle="Pusat administrasi sistem, pengguna, pengaturan, dan kontrol awal modul SIAGA-SDA."
      icon={FileText}
      primaryHref={canManageUsers ? '/pengguna' : '/pengaturan'}
      primaryLabel={canManageUsers ? 'Kelola Pengguna' : 'Buka Pengaturan'}
      cards={cards}
      checklist={checklist}
    />
  )
}
