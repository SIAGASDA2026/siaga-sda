'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AlertTriangle, Bell, Bot, CalendarDays, Clock, HelpCircle, MessageSquareText, Target, X } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { canAccessPage } from '@/lib/rbac'
import { buildProjectWarningSource, WARNING_FOLLOW_UP_STATUSES, type ProjectSystemWarning } from '@/lib/project-alerts'
import { getProjectComputedStatus } from '@/lib/project-status'
import type { Proyek } from '@/types'

type HaloFaqItem = {
  question: string
  answer: string
  alwaysVisible?: boolean
  accessPath?: string
  roles?: string[]
}

type HaloRoleGuide = {
  focus: string
  canView: string[]
  canAct: string[]
  limits: string[]
}

type HaloPageGuide = {
  title: string
  accessPath: string
  function: string
  canDo: string[]
  nextSteps: string[]
  limits: string[]
}

type HaloWorkTimeStatus = 'Belum ada jadwal' | 'Aman' | 'Perlu Perhatian' | 'Mendesak' | 'Terlambat'

type HaloWorkTimeView = {
  hasSchedule: boolean
  packageName?: string
  startLabel?: string
  targetLabel?: string
  remainingLabel: string
  status: HaloWorkTimeStatus
  tone: string
  description: string
  sourceLabel: string
}

type HaloWarningFilter = 'personal' | 'warning' | 'critical' | 'recommendation'

const HALO_WARNING_FILTER_LABELS: Record<HaloWarningFilter, string> = {
  personal: 'Misi Pribadi',
  warning: 'Peringatan Sistem',
  critical: 'Terlambat/Kritis',
  recommendation: 'Rekomendasi',
}

function getPageContext(pathname: string) {
  if (pathname.includes('/peta')) return 'Peta Monitoring'
  if (pathname.includes('/peil')) return 'Peil Banjir'
  if (pathname.includes('/proyek')) return 'Manajemen Proyek'
  if (pathname.includes('/laporan')) return 'Laporan Harian'
  if (pathname.includes('/survey')) return 'Survey Lapangan'
  if (pathname.includes('/masalah')) return 'Masalah Proyek'
  if (pathname.includes('/rab')) return 'RAB'
  if (pathname.includes('/kontrak')) return 'Kontrak'
  if (pathname.includes('/dokumen')) return 'Dokumen'
  if (pathname.includes('/chat')) return 'Chat Proyek'
  if (pathname.includes('/pengumuman')) return 'Pengumuman'
  if (pathname.includes('/pengguna')) return 'Pengguna dan Role'
  if (pathname.includes('/pengaturan')) return 'Pengaturan'
  return 'Dashboard Utama'
}

function parseHaloDate(value?: string | Date | null) {
  if (!value) return null
  const parsed = value instanceof Date ? value : new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function formatHaloDate(value: Date) {
  return value.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function getHaloWorkTimeStatus(remainingDays: number): HaloWorkTimeStatus {
  if (remainingDays < 0) return 'Terlambat'
  if (remainingDays <= 3) return 'Mendesak'
  if (remainingDays <= 7) return 'Perlu Perhatian'
  return 'Aman'
}

function getHaloWorkTimeTone(status: HaloWorkTimeStatus) {
  if (status === 'Terlambat') return 'border-red-200 bg-red-50 text-red-800'
  if (status === 'Mendesak') return 'border-orange-200 bg-orange-50 text-orange-800'
  if (status === 'Perlu Perhatian') return 'border-amber-200 bg-amber-50 text-amber-800'
  if (status === 'Aman') return 'border-emerald-200 bg-emerald-50 text-emerald-800'
  return 'border-slate-200 bg-slate-50 text-slate-700'
}

function isCriticalOrLateWarning(warning: ProjectSystemWarning) {
  return warning.status.isLate || warning.status.health === 'kritis' || warning.level === 'critical'
}

function hasFollowUpRecommendation(warning: ProjectSystemWarning) {
  return isCriticalOrLateWarning(warning) || warning.recommendation.toLowerCase().includes('klarifikasi')
}

function getHaloVisibleProjects(
  projects: Proyek[],
  currentUser?: { id: string; role?: string; projectIds?: string[] } | null,
) {
  if (!currentUser) return []

  const broadRoles = new Set([
    'super_admin',
    'admin',
    'admin_sistem',
    'admin_bidang',
    'admin_sda',
    'kabid',
    'kepala_bidang',
    'pimpinan',
    'auditor',
  ])

  if (broadRoles.has(String(currentUser.role || ''))) return projects

  const assignedProjectIds = new Set(currentUser.projectIds || [])

  return projects.filter((project) => (
    assignedProjectIds.has(project.id) ||
    project.assignedUsers?.includes(currentUser.id) ||
    project.ppk === currentUser.id ||
    project.pptk === currentUser.id
  ))
}

function getHaloWorkTimeView(
  projects: Proyek[],
  currentUser: { id: string; role?: string; projectIds?: string[] } | null,
  now: Date | null,
): HaloWorkTimeView {
  const visibleProjects = getHaloVisibleProjects(projects, currentUser)
  const today = now ? new Date(now) : new Date()
  today.setHours(0, 0, 0, 0)
  const priorityWarning = buildProjectWarningSource(visibleProjects, today).priorityWarning

  if (priorityWarning?.status.targetDate) {
    const startDate = parseHaloDate(priorityWarning.project.tanggalMulai)
    const status: HaloWorkTimeStatus = priorityWarning.status.key === 'late'
      ? 'Terlambat'
      : priorityWarning.status.key === 'at_risk'
        ? (priorityWarning.status.remainingDays ?? 99) <= 3 ? 'Mendesak' : 'Perlu Perhatian'
        : getHaloWorkTimeStatus(priorityWarning.status.remainingDays ?? 99)

    return {
      hasSchedule: true,
      packageName: priorityWarning.project.nama,
      startLabel: startDate ? formatHaloDate(startDate) : undefined,
      targetLabel: priorityWarning.targetLabel,
      remainingLabel: priorityWarning.remainingLabel,
      status,
      tone: getHaloWorkTimeTone(status),
      description: priorityWarning.status.reason,
      sourceLabel: 'Sumber: prioritas Peringatan Sistem dari helper project-alerts dan project-status.',
    }
  }

  const scheduledProjects = visibleProjects
    .map((project) => {
      const computedStatus = getProjectComputedStatus(project, today)
      if (computedStatus.isCompleted) return null

      const targetDate = parseHaloDate(project.tanggalSelesai)
      if (!targetDate) return null

      const startDate = parseHaloDate(project.tanggalMulai)
      const normalizedTargetDate = new Date(targetDate)
      normalizedTargetDate.setHours(0, 0, 0, 0)
      const remainingDays = Math.ceil((normalizedTargetDate.getTime() - today.getTime()) / 86400000)

      return {
        project,
        startDate,
        targetDate,
        remainingDays,
        computedStatus,
      }
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))

  if (scheduledProjects.length === 0) {
    return {
      hasSchedule: false,
      remainingLabel: 'Jadwal pekerjaan belum tersedia.',
      status: 'Belum ada jadwal',
      tone: getHaloWorkTimeTone('Belum ada jadwal'),
      description: 'Data waktu akan mengikuti jadwal tugas atau kontrak jika sudah tersedia di sistem.',
      sourceLabel: 'Belum ada tanggal target dari data existing.',
    }
  }

  scheduledProjects.sort((a, b) => {
    const rank = (key: ReturnType<typeof getProjectComputedStatus>['key']) => key === 'late' ? 0 : key === 'at_risk' ? 1 : key === 'on_track' ? 2 : 3
    const diff = rank(a.computedStatus.key) - rank(b.computedStatus.key)
    return diff !== 0 ? diff : a.remainingDays - b.remainingDays
  })
  const nearestProject = scheduledProjects[0]
  const status: HaloWorkTimeStatus = nearestProject.computedStatus.key === 'late'
    ? 'Terlambat'
    : nearestProject.computedStatus.key === 'at_risk'
      ? nearestProject.remainingDays <= 3 ? 'Mendesak' : 'Perlu Perhatian'
      : getHaloWorkTimeStatus(nearestProject.remainingDays)
  const remainingLabel = nearestProject.remainingDays < 0
    ? `Terlambat ${Math.abs(nearestProject.remainingDays)} hari`
    : nearestProject.remainingDays === 0
      ? 'Jatuh tempo hari ini'
      : `${nearestProject.remainingDays} hari`

  return {
    hasSchedule: true,
    packageName: nearestProject.project.nama,
    startLabel: nearestProject.startDate ? formatHaloDate(nearestProject.startDate) : undefined,
    targetLabel: formatHaloDate(nearestProject.targetDate),
    remainingLabel,
    status,
    tone: getHaloWorkTimeTone(status),
    description: nearestProject.computedStatus.reason,
    sourceLabel: 'Sumber: status sinkron paket dari helper project-status, tanggal mulai, dan tanggal selesai paket existing.',
  }
}

function getPageGuide(pathname: string): HaloPageGuide {
  if (pathname.includes('/peta')) {
    return {
      title: 'Peta Monitoring',
      accessPath: '/peta',
      function: 'Melihat lokasi pekerjaan, survey, asset, dan konteks spasial SDA sesuai akses role.',
      canDo: ['Melihat marker dan ringkasan lokasi yang tersedia.', 'Membuka detail modul asal jika user memiliki akses.'],
      nextSteps: ['Gunakan filter peta bila tersedia.', 'Buka detail modul asal untuk data resmi dan tindak lanjut.'],
      limits: ['Halo tidak membaca data peta resmi secara langsung.', 'Data yang tampil tetap mengikuti assignment dan sumber modul.'],
    }
  }

  if (pathname.includes('/survey')) {
    return {
      title: 'Survey Investigasi',
      accessPath: '/survey',
      function: 'Ruang kerja untuk melihat atau menginput survey, data lapangan, foto/GPS, dan rekomendasi teknis awal.',
      canDo: ['Membaca hasil survey sesuai akses.', 'Menginput atau menindaklanjuti survey hanya jika role memiliki hak aksi.'],
      nextSteps: ['Periksa assignment terlebih dahulu.', 'Lengkapi kondisi eksisting, rekomendasi, foto, dan koordinat bila Anda berwenang.'],
      limits: ['Survey tidak boleh hilang setelah ditindaklanjuti.', 'Istilah final tetap Ditindaklanjuti, bukan Menjadi Paket.'],
    }
  }

  if (pathname.includes('/proyek')) {
    return {
      title: 'Paket Pekerjaan',
      accessPath: '/proyek',
      function: 'Melihat dan mengelola paket pekerjaan sesuai role, assignment, progres, risiko, dokumen, dan sumber asal data.',
      canDo: ['Melihat paket sesuai cakupan akses.', 'Mengelola paket hanya jika role memiliki kewenangan.'],
      nextSteps: ['Cek status paket, progres fisik/keuangan, deviasi, dan dokumen.', 'Gunakan detail paket untuk melihat traceability dan tindak lanjut.'],
      limits: ['Halo tidak mengubah data paket.', 'Data paket harus tetap mengikuti assignment scope.'],
    }
  }

  if (pathname.includes('/approval')) {
    return {
      title: 'Approval Center',
      accessPath: '/approval',
      function: 'Pusat review, revisi, dan persetujuan formal sesuai role dan assignment.',
      canDo: ['Melihat status approval jika memiliki akses.', 'Melakukan aksi approval hanya jika tombol aksi tersedia dan role berwenang.'],
      nextSteps: ['Cek sumber item, riwayat approval, dan catatan revisi.', 'Untuk role read-only, gunakan halaman ini sebagai pemantauan.'],
      limits: ['Halo tidak dapat menyetujui, menolak, atau meminta revisi.', 'GET Approval tetap harus read-only.'],
    }
  }

  if (pathname.includes('/surat')) {
    return {
      title: 'Surat Masuk & Keluar',
      accessPath: '/surat',
      function: 'Peta workflow administrasi surat, disposisi, tindak lanjut, surat keluar, dan pintu awal permohonan Peil Banjir.',
      canDo: ['Melihat alur surat jika role berwenang.', 'Menindaklanjuti surat hanya setelah modul database resmi tersedia dan role berwenang.'],
      nextSteps: ['Cek kategori surat dan target tindak lanjut.', 'Gunakan tombol route resmi ke Survey, Paket, Peil, Approval, Dashboard, atau Audit Log.'],
      limits: ['Modul surat resmi masih tahap persiapan.', 'Halo tidak membuat surat resmi otomatis.'],
    }
  }

  if (pathname.includes('/peil')) {
    return {
      title: 'Peil Banjir',
      accessPath: '/peil',
      function: 'Layanan permohonan rekomendasi teknis Peil Banjir dari Surat Masuk sampai rekomendasi/arsip.',
      canDo: ['Melihat workflow Peil jika memiliki akses.', 'Mengikuti panduan administrasi atau teknis sesuai role.'],
      nextSteps: ['Pastikan sumber permohonan dari Surat Masuk.', 'Cek persyaratan, survey, koordinat, review teknis, dan arsip rekomendasi.'],
      limits: ['Peil Banjir bukan monitoring tinggi muka air biasa.', 'Role Peil masih frontend-only sampai tahap Prisma/database khusus.'],
    }
  }

  if (pathname.includes('/asset')) {
    return {
      title: 'Asset SDA',
      accessPath: '/asset',
      function: 'Melihat data asset SDA seperti pintu air, pompa, drainase utama, kanal, tanggul, dan bangunan operasi.',
      canDo: ['Melihat asset sesuai akses yang tersedia.', 'Membuka detail asset bila modul menyediakan akses.'],
      nextSteps: ['Gunakan data asset untuk konteks operasional dan monitoring.', 'Laporkan kebutuhan perubahan melalui role berwenang.'],
      limits: ['Permission Asset masih perlu audit lanjutan karena saat ini terkait view_map.', 'Halo tidak mengubah data asset.'],
    }
  }

  if (pathname.includes('/audit-log')) {
    return {
      title: 'Audit Log',
      accessPath: '/audit-log',
      function: 'Melihat rekam jejak aktivitas penting, perubahan data, approval, dan akses sistem.',
      canDo: ['Membaca audit trail jika role memiliki akses.', 'Menggunakan log sebagai bukti pemeriksaan dan kontrol.'],
      nextSteps: ['Filter log sesuai kebutuhan pemeriksaan.', 'Cocokkan aktivitas dengan modul asal dan user pelaku.'],
      limits: ['Audit Log bersifat read-only untuk pemeriksaan.', 'Halo tidak menulis audit baru.'],
    }
  }

  if (pathname.includes('/pengguna')) {
    return {
      title: 'Manajemen Pengguna',
      accessPath: '/pengguna',
      function: 'Mengelola akun, role, dan assignment sesuai kewenangan.',
      canDo: ['Melihat dan mengelola user hanya jika memiliki manage_users.', 'Menjaga role pending tetap tidak disimpan sebelum Prisma siap.'],
      nextSteps: ['Pastikan role target boleh dikelola.', 'Jangan membuka role frontend-only sebelum migration resmi.'],
      limits: ['Tidak semua role boleh mengelola user.', 'Halo tidak membuat atau mengubah user.'],
    }
  }

  if (pathname.includes('/pengaturan')) {
    return {
      title: 'Pengaturan',
      accessPath: '/pengaturan',
      function: 'Melihat preferensi akun dan pengaturan yang tersedia sesuai role.',
      canDo: ['Melihat profil dan role aktif.', 'Mengakses pengaturan sistem hanya jika role memiliki kewenangan.'],
      nextSteps: ['Gunakan pengaturan personal sesuai kebutuhan.', 'Hubungi Admin Sistem untuk perubahan role atau assignment.'],
      limits: ['Pengaturan sistem tidak otomatis terbuka untuk semua role.', 'Halo tidak mengubah konfigurasi.'],
    }
  }

  if (pathname.includes('/administrasi') || pathname.includes('/kontrak') || pathname.includes('/dokumen') || pathname.includes('/serapan-anggaran')) {
    return {
      title: 'Administrasi',
      accessPath: '/administrasi',
      function: 'Mengelola atau melihat administrasi paket seperti kontrak, dokumen, keuangan, dan arsip sesuai kewenangan.',
      canDo: ['Melihat administrasi jika memiliki akses kontrak/dokumen.', 'Mengunggah atau mengubah dokumen hanya jika role memiliki hak aksi.'],
      nextSteps: ['Cek paket asal dan status dokumen.', 'Pastikan perubahan mengikuti audit trail dan kewenangan role.'],
      limits: ['Admin Sub Kegiatan masih memakai compatibility ADMINISTRASI_KONTRAK.', 'Halo tidak mengunggah dokumen.'],
    }
  }

  return {
    title: 'Dashboard SIAGA-SDA',
    accessPath: '/dashboard',
    function: 'Ringkasan status, misi harian, risiko, akses cepat, dan panduan sesuai role.',
    canDo: ['Melihat ringkasan sesuai role dan assignment.', 'Membuka modul sumber data melalui card atau menu yang tersedia.'],
    nextSteps: ['Cek misi harian dan assignment aktif.', 'Gunakan menu yang tampil sebagai daftar akses resmi Anda.'],
    limits: ['Halo masih panduan lokal.', 'Data misi resmi belum dibaca langsung oleh Halo.'],
  }
}

const HALO_ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  admin_sistem: 'Admin Sistem',
  admin_bidang: 'Admin Bidang',
  admin_sda: 'Admin SDA',
  admin_sub_kegiatan: 'Admin Sub Kegiatan',
  kabid: 'Kepala Bidang',
  kepala_bidang: 'Kepala Bidang',
  kepala_dinas: 'Pimpinan',
  pimpinan: 'Pimpinan',
  ppk: 'PPK',
  pptk: 'PPTK',
  direksi_teknis: 'Direksi Teknis',
  pejabat_pengadaan: 'Pejabat Pengadaan',
  pphp: 'PPHP',
  tim_perencanaan: 'Tim Perencanaan',
  tim_perencana_rutin: 'Tim Perencana (Rutin)',
  tim_survey: 'Tim Survey',
  tim_pengawasan: 'Tim Pengawasan',
  tim_pengawas_rutin: 'Tim Pengawas (Rutin)',
  konsultan_perencana: 'Konsultan Perencana',
  konsultan_pengawasan: 'Konsultan Pengawasan',
  konsultan_pengawas: 'Konsultan Pengawas',
  kontraktor: 'Kontraktor',
  auditor: 'Auditor',
  admin_surat: 'Admin Surat',
  admin_peil: 'Admin Peil Banjir',
  admin_peil_banjir: 'Admin Peil Banjir',
  tim_teknis_peil_banjir: 'Tim Teknis Peil Banjir',
  admin_asset: 'Admin Asset',
  mandor_operasional_sda: 'Mandor Operasional SDA',
  mandor_pintu_air: 'Mandor Pintu Air',
  petugas_pintu_air: 'Petugas Pintu Air',
  mandor_rehab_drainase: 'Mandor Rehab Drainase',
  mandor_rehabilitasi_drainase: 'Mandor Rehabilitasi Drainase',
}

function getHaloRoleLabel(role?: string) {
  if (!role) return ''
  const mapped = HALO_ROLE_LABELS[role]
  if (mapped) return mapped

  return role
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function getHaloRoleSummary(role?: string) {
  if (role === 'admin_peil' || role === 'admin_peil_banjir') {
    return 'Fokus role: administrasi permohonan Peil Banjir, verifikasi persyaratan, dokumen, dan penghubung workflow Surat ke Peil. Aksi tulis resmi tetap menunggu data/API Peil yang formal.'
  }

  if (role === 'tim_teknis_peil_banjir') {
    return 'Fokus role: survey lokasi Peil Banjir, koordinat, catatan teknis, dan bahan rekomendasi. Role ini tidak otomatis mendapat akses administrasi global atau approval formal.'
  }

  return null
}

function getHaloRoleGuide(role?: string): HaloRoleGuide {
  const guides: Record<string, HaloRoleGuide> = {
    super_admin: {
      focus: 'Mengawasi struktur sistem, user, role, data, dan audit secara menyeluruh.',
      canView: ['Dashboard, menu utama, audit log, user, dan pengaturan sistem.'],
      canAct: ['Mengelola user dan role sesuai batas keamanan sistem.'],
      limits: ['Tetap perlu menjaga audit trail dan tidak mengubah fondasi tanpa tahap khusus.'],
    },
    admin: {
      focus: 'Mengelola operasional sistem, user non-admin, data master, dan kelengkapan data.',
      canView: ['Dashboard, menu administrasi, paket, surat, peil, approval, audit sesuai akses.'],
      canAct: ['Mengelola user non-admin dan data yang menjadi kewenangan admin.'],
      limits: ['Admin Sistem/Admin Bidang masih dipetakan ke role admin umum sampai tahap role khusus.'],
    },
    admin_sub_kegiatan: {
      focus: 'Mengelola paket, kontrak, dokumen, progress, dan rekap sub kegiatan yang ditugaskan.',
      canView: ['Paket, administrasi, dokumen, laporan, masalah, dan rekap sesuai scope.'],
      canAct: ['Mengelola kontrak/paket/dokumen jika role dan assignment mengizinkan.'],
      limits: ['Database masih memakai compatibility ADMINISTRASI_KONTRAK.'],
    },
    kabid: {
      focus: 'Memantau paket bidang, memberi arahan tindak lanjut, dan mengevaluasi risiko/deviasi.',
      canView: ['Dashboard, paket, survey, approval, surat, Peil, audit sesuai akses.'],
      canAct: ['Memberi keputusan atau review hanya pada aksi yang memang tersedia untuk role.'],
      limits: ['Tidak semua aksi tulis otomatis tersedia.'],
    },
    pimpinan: {
      focus: 'Memantau kinerja, risiko, rekap, dan prioritas strategis secara read-only.',
      canView: ['Dashboard pimpinan, rekap, audit ringkas, approval, surat, Peil, dan risiko.'],
      canAct: ['Memberi arahan di luar Halo melalui workflow resmi.'],
      limits: ['Halo tidak memberi aksi tulis atau approval resmi.'],
    },
    ppk: {
      focus: 'Mengendalikan paket, review keputusan, approval, risiko, dan tindak lanjut pekerjaan.',
      canView: ['Paket, approval, laporan, surat, Peil, audit, dan rekap sesuai kewenangan.'],
      canAct: ['Melakukan approval atau tindakan jika tombol resmi tersedia.'],
      limits: ['Keputusan formal tetap dilakukan di modul resmi, bukan di Halo.'],
    },
    pptk: {
      focus: 'Mendukung pelaksanaan teknis kegiatan, laporan, progress, dan tindak lanjut lapangan.',
      canView: ['Paket, laporan, survey, approval tertentu, surat, dan Peil sesuai RBAC.'],
      canAct: ['Input laporan/masalah/survey jika role dan assignment mengizinkan.'],
      limits: ['Akses tetap mengikuti assignment dan tombol aksi resmi.'],
    },
    direksi_teknis: {
      focus: 'Memberi evaluasi teknis, catatan pengawasan, dan rekomendasi lapangan.',
      canView: ['Paket, laporan, pengawasan, approval terkait, dan Peil teknis.'],
      canAct: ['Membuat catatan teknis atau rekomendasi jika tersedia.'],
      limits: ['Tidak otomatis mendapat akses administrasi surat atau user.'],
    },
    pejabat_pengadaan: {
      focus: 'Mengawal pengadaan, tahapan penyedia, kontrak awal, dan dokumen pengadaan.',
      canView: ['Paket, RAB, administrasi kontrak, dan keuangan sesuai akses.'],
      canAct: ['Memperbarui tahapan pengadaan jika fitur tersedia.'],
      limits: ['Belum semua akun seed role ini tersedia.'],
    },
    pphp: {
      focus: 'Memeriksa hasil pekerjaan, kelengkapan serah terima, dan catatan pemeriksaan.',
      canView: ['Laporan, dokumen, approval pemeriksaan, dan kontrak sesuai akses.'],
      canAct: ['Memberi catatan pemeriksaan jika fitur tersedia.'],
      limits: ['Belum semua akun seed role ini tersedia.'],
    },
    tim_perencanaan: {
      focus: 'Survey investigasi, rekomendasi teknis awal, data perencanaan, dan bahan awal Paket Pekerjaan sesuai assignment.',
      canView: ['Survey, Paket Pekerjaan, RAB/perencanaan, dan Dashboard sesuai akses.'],
      canAct: ['Input survey dan menyiapkan data awal perencanaan jika assignment tersedia.'],
      limits: ['Tidak mendapat Peil, Surat, Approval formal, atau Manajemen User jika menu tidak muncul.'],
    },
    tim_survey: {
      focus: 'Pendataan awal, foto/GPS, kondisi eksisting, dan data survey lapangan.',
      canView: ['Survey, Paket terkait, dan Dashboard sesuai assignment.'],
      canAct: ['Input survey jika penugasan tersedia.'],
      limits: ['Tidak otomatis mendapat Peil, Surat, Approval formal, atau pengaturan sistem.'],
    },
    tim_pengawasan: {
      focus: 'Pengawasan pekerjaan rutin, catatan lapangan, masalah, dan kualitas pekerjaan.',
      canView: ['Paket, laporan, masalah, approval terkait, dan Dashboard sesuai assignment.'],
      canAct: ['Input catatan pengawasan atau masalah jika fitur tersedia.'],
      limits: ['Tidak otomatis mendapat Peil atau Surat.'],
    },
    konsultan_perencana: {
      focus: 'Mendukung survey teknis, desain, RAB, dan rekomendasi perencanaan.',
      canView: ['Survey, Paket terkait, RAB/perencanaan, dan dokumen sesuai assignment.'],
      canAct: ['Input survey atau bahan perencanaan jika ditugaskan.'],
      limits: ['Tidak otomatis mendapat Peil, Surat, Approval formal, atau user management.'],
    },
    konsultan_pengawasan: {
      focus: 'Mendukung pengawasan pelaksanaan, laporan, masalah kualitas, dan catatan teknis.',
      canView: ['Paket, laporan, masalah, approval terkait, dan dokumen sesuai assignment.'],
      canAct: ['Input catatan pengawasan atau masalah jika ditugaskan.'],
      limits: ['Tidak otomatis mendapat Peil, Surat, atau user management.'],
    },
    kontraktor: {
      focus: 'Pelaporan pekerjaan, dokumentasi, masalah lapangan, dan komunikasi sesuai paket yang ditugaskan.',
      canView: ['Paket, laporan, chat, masalah, dan dokumen sesuai assignment.'],
      canAct: ['Input laporan, dokumentasi, atau masalah hanya jika fitur dan assignment mengizinkan.'],
      limits: ['Tidak mendapat Peil, Surat, Approval formal, Audit Log, atau User Management.'],
    },
    auditor: {
      focus: 'Pemeriksaan read-only atas audit trail, dokumen, riwayat perubahan, dan kepatuhan workflow.',
      canView: ['Dashboard, audit log, rekap, dokumen, surat, Peil, dan approval secara baca.'],
      canAct: ['Melakukan pemeriksaan dan penelusuran, bukan perubahan data.'],
      limits: ['Auditor tidak boleh diberi aksi tulis.'],
    },
    admin_peil_banjir: {
      focus: 'Administrasi layanan rekomendasi Peil Banjir, persyaratan, dokumen, verifikasi, dan arsip.',
      canView: ['Dashboard, Surat Masuk & Keluar, dan Peil Banjir sesuai akses frontend.'],
      canAct: ['Mengikuti panduan administrasi Peil secara lokal.'],
      limits: ['Role ini belum aktif database/Prisma resmi dan belum boleh dianggap siap disimpan.'],
    },
    tim_teknis_peil_banjir: {
      focus: 'Survey lokasi Peil Banjir, koordinat, catatan teknis, dan bahan rekomendasi.',
      canView: ['Dashboard dan Peil Banjir sesuai akses frontend.'],
      canAct: ['Mengikuti panduan teknis Peil secara lokal.'],
      limits: ['Role ini belum aktif database/Prisma resmi dan tidak mendapat administrasi global.'],
    },
  }

  return guides[role || ''] || {
    focus: 'Menggunakan SIAGA-SDA sesuai role dan assignment yang tersedia.',
    canView: ['Menu yang tampil pada Sidebar atau MobileNav adalah akses utama Anda.'],
    canAct: ['Aksi hanya boleh dilakukan melalui tombol resmi yang tersedia pada modul.'],
    limits: ['Jika menu tidak muncul, akses dibatasi oleh role, permission, atau assignment.'],
  }
}

const HALO_FAQ_ITEMS: HaloFaqItem[] = [
  {
    question: 'Apa misi harian saya hari ini?',
    answer: 'Belum ada misi resmi yang terhubung. Setelah assignment dan data tugas resmi aktif, daftar misi akan mengikuti role dan scope Anda.',
    alwaysVisible: true,
  },
  {
    question: 'Mengapa saya belum memiliki tugas?',
    answer: 'Kemungkinan belum ada assignment aktif yang ditautkan ke akun Anda. Ini bukan error. Silakan hubungi admin atau pejabat berwenang jika penugasan lapangan memang sudah diterbitkan.',
    alwaysVisible: true,
  },
  {
    question: 'Apa fungsi Dashboard SIAGA-SDA?',
    answer: 'Dashboard adalah command center ringkas untuk melihat prioritas, risiko, progres, dan misi sesuai role serta assignment aktif. Detail resmi tetap dibuka dari modul sumber data masing-masing.',
    alwaysVisible: true,
  },
  {
    question: 'Bagaimana cara membaca status tugas saya?',
    answer: 'Gunakan ringkasan misi, status assignment, dan akses cepat sesuai role. Jika status masih kosong, berarti data tugas resmi belum terhubung ke akun atau belum disinkronkan.',
    alwaysVisible: true,
  },
  {
    question: 'Apa tugas Tim Perencana di SIAGA-SDA?',
    answer: 'Tim Perencana fokus pada survey awal, data kondisi lapangan, rekomendasi teknis, dan bahan awal perencanaan seperti RAB, gambar, atau kebutuhan paket pekerjaan sesuai assignment.',
    roles: ['tim_perencanaan'],
  },
  {
    question: 'Bagaimana alur Survey Investigasi?',
    answer: 'Survey Investigasi dimulai dari penugasan, pengumpulan data lapangan, foto/GPS, kondisi eksisting, rekomendasi teknis, lalu tindak lanjut ke arsip, paket pekerjaan, atau proses lain sesuai keputusan pejabat berwenang.',
    accessPath: '/survey',
  },
  {
    question: 'Bagaimana rekomendasi hasil survey menjadi Paket Pekerjaan?',
    answer: 'Rekomendasi survey harus direview dahulu. Jika disetujui, data dapat ditindaklanjuti sebagai paket pekerjaan atau pekerjaan rutin dengan relasi sumber yang jelas dan tetap tercatat untuk audit.',
    roles: ['tim_perencanaan', 'tim_survey', 'konsultan_perencana'],
  },
  {
    question: 'Bagaimana menyiapkan data awal untuk RAB/gambar/perencanaan?',
    answer: 'Siapkan kondisi eksisting, foto lapangan, koordinat, dimensi, rekomendasi teknis, dan catatan kebutuhan pekerjaan. Data ini menjadi bahan awal penyusunan RAB, gambar, dan dokumen perencanaan.',
    roles: ['tim_perencanaan', 'tim_survey', 'konsultan_perencana'],
  },
  {
    question: 'Jika ada paket deviasi dan perlu surat teguran, apa yang harus dilakukan?',
    answer: 'Halo SIAGA-SDA hanya memberi arahan konseptual. Surat teguran tetap harus mengikuti workflow resmi, review pejabat berwenang, dan dokumen sumber yang valid.',
    accessPath: '/surat',
  },
  {
    question: 'Apakah area tanya jawab sudah aktif resmi?',
    answer: 'Belum. Area Tanya Halo SIAGA-SDA masih dalam mode panduan lokal dan belum membaca sumber SOP resmi atau data misi resmi.',
    alwaysVisible: true,
  },
  {
    question: 'Apa fungsi Peil Banjir di SIAGA-SDA?',
    answer: 'Peil Banjir digunakan untuk mengelola permohonan rekomendasi peil banjir dari pihak ketiga, mulai dari surat masuk, verifikasi administrasi, survey lokasi, pengambilan titik koordinat, review perhitungan hidrologi dan hidrolika, penyusunan draft rekomendasi, approval PPTK/PPK, hingga penerbitan surat rekomendasi yang ditandatangani Kadis. Dinas PU Bidang SDA tidak menerbitkan izin bangunan.',
    accessPath: '/peil',
  },
  {
    question: 'Bagaimana alur permohonan rekomendasi Peil Banjir?',
    answer: 'Alur konseptualnya dimulai dari surat permohonan, verifikasi administrasi, survey lokasi, review teknis hidrologi/hidrolika, draft rekomendasi, review pejabat berwenang, penerbitan rekomendasi, lalu arsip.',
    accessPath: '/peil',
  },
  {
    question: 'Apa peran survey dan koordinat dalam Peil Banjir?',
    answer: 'Survey dan koordinat menjadi bahan teknis untuk menilai lokasi permohonan, kondisi drainase/banjir sekitar, serta dasar penyusunan rekomendasi. Catatan ini tetap bersifat panduan lokal sampai data Peil resmi tersedia.',
    accessPath: '/peil',
  },
  {
    question: 'Bagaimana alur Surat Masuk & Keluar?',
    answer: 'Surat diterima, dibaca, didisposisi, lalu ditindaklanjuti ke Survey, Paket, Peil, Approval, Arsip, Dashboard, dan Audit Log sesuai kategori serta kewenangan role.',
    accessPath: '/surat',
  },
  {
    question: 'Apa yang harus dicek sebelum surat ditindaklanjuti?',
    answer: 'Cek kategori surat, asal surat, perihal, lampiran, urgensi, disposisi, target tindak lanjut, dan apakah perlu survey, paket, proses Peil, approval, atau arsip.',
    accessPath: '/surat',
  },
  {
    question: 'Apa yang harus saya cek di Approval Center?',
    answer: 'Cek item pending, sumber data, status, catatan revisi, riwayat approval, dan apakah keputusan yang ditampilkan memang berada dalam kewenangan role serta assignment Anda.',
    accessPath: '/approval',
  },
  {
    question: 'Bagaimana membaca status pending approval?',
    answer: 'Status pending berarti item masih menunggu pemeriksaan atau keputusan pejabat berwenang. Untuk role read-only, gunakan informasi ini sebagai pemantauan, bukan aksi persetujuan.',
    accessPath: '/approval',
  },
  {
    question: 'Bagaimana mengelola user dan role?',
    answer: 'User dan role hanya boleh dikelola oleh role yang memiliki kewenangan Manajemen Pengguna. Perubahan role harus mengikuti mapping Prisma/database dan tidak boleh membuka role yang belum siap.',
    accessPath: '/pengguna',
  },
  {
    question: 'Bagaimana mengatur preferensi akun?',
    answer: 'Pengaturan akun digunakan untuk melihat profil, role aktif, dan preferensi yang tersedia. Pengaturan sistem hanya boleh dilakukan oleh role yang memiliki kewenangan.',
    accessPath: '/pengaturan',
  },
]

export function ProjectAiAssistant() {
  const pathname = usePathname()
  const currentUser = useAppStore((state) => state.currentUser)
  const dashboardDataSource = useAppStore((state) => state.dashboardDataSource)
  const projects = useAppStore((state) => state.projects)
  const [open, setOpen] = useState(false)
  const [now, setNow] = useState<Date | null>(null)
  const [avatarAvailable, setAvatarAvailable] = useState(false)
  const [activeWarningFilter, setActiveWarningFilter] = useState<HaloWarningFilter>('warning')

  useEffect(() => {
    const updateNow = () => setNow(new Date())
    updateNow()

    const intervalId = window.setInterval(updateNow, 60000)
    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const avatar = new Image()
    avatar.onload = () => setAvatarAvailable(true)
    avatar.onerror = () => setAvatarAvailable(false)
    avatar.src = '/assets/halo-siaga-sda-avatar.png'
  }, [])

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
    }
  }, [open])

  const context = useMemo(() => getPageContext(pathname), [pathname])
  const roleLabel = getHaloRoleLabel(currentUser?.role)
  const haloRoleSummary = getHaloRoleSummary(currentUser?.role)
  const roleGuide = useMemo(() => getHaloRoleGuide(currentUser?.role), [currentUser?.role])
  const pageGuide = useMemo(() => getPageGuide(pathname), [pathname])
  const userDisplayName = currentUser?.name?.trim() || 'pengguna SIAGA-SDA'
  const userPosition = currentUser?.jabatan?.trim()
  const pageAccessAllowed = currentUser?.role ? canAccessPage(currentUser.role, pageGuide.accessPath) : false
  const menuAccessNotes = useMemo(() => {
    const role = currentUser?.role
    if (!role) {
      return ['Menu akan mengikuti role dan assignment setelah akun aktif terbaca.']
    }

    const notes = [
      {
        label: 'Peil Banjir',
        accessPath: '/peil',
        message: 'Peil Banjir tidak muncul jika role belum memiliki akses modul Peil atau role Peil masih belum aktif database resmi.',
      },
      {
        label: 'Surat Masuk & Keluar',
        accessPath: '/surat',
        message: 'Surat tidak muncul jika role tidak memiliki akses modul persuratan atau modul masih dibatasi untuk persiapan.',
      },
      {
        label: 'Approval Center',
        accessPath: '/approval',
        message: 'Approval Center tidak muncul jika role tidak memiliki akses approval formal atau item approval berada di luar scope.',
      },
      {
        label: 'Manajemen Pengguna',
        accessPath: '/pengguna',
        message: 'Manajemen Pengguna hanya tampil untuk role yang memiliki kewenangan user/role management.',
      },
    ]

    const hiddenNotes = notes.filter((item) => !canAccessPage(role, item.accessPath))
    if (hiddenNotes.length === 0) {
      return ['Menu utama yang relevan untuk role Anda sudah dibuka sesuai guard frontend saat ini.']
    }

    return hiddenNotes.map((item) => `${item.label}: ${item.message}`)
  }, [currentUser?.role])
  const dateLabel = now
    ? now.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
    : 'hari ini'

  const countdownLabel = useMemo(() => {
    if (!now) return 'Menghitung...'

    const endOfDay = new Date(now)
    endOfDay.setHours(23, 59, 59, 999)
    const remainingMs = endOfDay.getTime() - now.getTime()

    if (remainingMs <= 0) return 'Hari ini berakhir'

    const hours = Math.floor(remainingMs / 3600000)
    const minutes = Math.floor((remainingMs % 3600000) / 60000)
    return `${String(hours).padStart(2, '0')} jam ${String(minutes).padStart(2, '0')} menit`
  }, [now])

  const roleSentence = roleLabel
    ? `Halo, ${userDisplayName}. Anda masuk sebagai ${roleLabel}${userPosition ? ` - ${userPosition}` : ''}. Panduan ini disesuaikan dengan role, halaman aktif, dan menu yang boleh terlihat.`
    : `Halo, ${userDisplayName}. Panduan ini menunggu role akun terbaca agar menu dan arahan bisa disesuaikan.`

  const haloVisibleProjects = useMemo(() => getHaloVisibleProjects(projects, currentUser), [projects, currentUser])
  const haloWarningSource = useMemo(() => buildProjectWarningSource(haloVisibleProjects, now ?? new Date()), [haloVisibleProjects, now])
  const hasPersonalTasks = haloWarningSource.personalTasks.length > 0
  const haloSubtitle = hasPersonalTasks
    ? 'Misi Harian Saya'
    : haloWarningSource.warningSummary.total > 0
      ? 'Peringatan Sistem & Kendali Waktu'
      : 'Belum ada misi pribadi'
  const criticalWarningCount = haloWarningSource.systemWarnings.filter(isCriticalOrLateWarning).length
  const recommendationCount = haloWarningSource.systemWarnings.filter(hasFollowUpRecommendation).length
  const filteredHaloWarnings = useMemo(() => {
    if (activeWarningFilter === 'personal') return []
    if (activeWarningFilter === 'critical') return haloWarningSource.systemWarnings.filter(isCriticalOrLateWarning)
    if (activeWarningFilter === 'recommendation') return haloWarningSource.systemWarnings.filter(hasFollowUpRecommendation)
    return haloWarningSource.systemWarnings
  }, [activeWarningFilter, haloWarningSource.systemWarnings])
  const visibleHaloWarnings = filteredHaloWarnings.slice(0, 10)
  const activeWarningFilterLabel = HALO_WARNING_FILTER_LABELS[activeWarningFilter]
  const warningSectionTitle = activeWarningFilter === 'personal'
    ? 'Misi Pribadi'
    : activeWarningFilter === 'critical'
      ? 'Paket Terlambat/Kritis'
      : activeWarningFilter === 'recommendation'
        ? 'Paket dengan Rekomendasi Tindak Lanjut'
        : 'Peringatan Sistem dalam scope Anda'
  const warningSectionDescription = activeWarningFilter === 'personal'
    ? 'Misi pribadi tetap dipisahkan dari peringatan sistem. Pada tahap ini data misi resmi belum terhubung.'
    : activeWarningFilter === 'critical'
      ? 'Daftar ini memfokuskan paket terlambat, health kritis, atau level critical dalam scope Anda.'
      : activeWarningFilter === 'recommendation'
        ? 'Daftar ini memfokuskan paket yang memiliki rekomendasi klarifikasi/teguran konseptual dan belum menjadi surat resmi.'
        : 'Daftar ini bukan Tugas Saya, tetapi paket berisiko yang terlihat sesuai role dan assignment scope.'

  const handleWarningFilterChange = (filter: HaloWarningFilter) => {
    setActiveWarningFilter(filter)
    window.setTimeout(() => {
      document.getElementById('halo-peringatan-sistem')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 0)
  }

  const warningSummaryCards: Array<{
    filter: HaloWarningFilter
    label: string
    value: string
    description: string
    className: string
    activeClassName: string
  }> = [
    {
      filter: 'personal',
      label: 'Misi Pribadi',
      value: String(haloWarningSource.personalTasks.length),
      description: 'Belum ada misi pribadi hari ini.',
      className: 'siaga-card-info text-blue-900 shadow-blue-950/10',
      activeClassName: 'border-blue-400 ring-blue-200',
    },
    {
      filter: 'warning',
      label: 'Peringatan Sistem',
      value: String(haloWarningSource.warningSummary.total),
      description: 'Paket berisiko dalam scope Anda.',
      className: 'siaga-card-warning text-amber-950 shadow-amber-950/10',
      activeClassName: 'border-amber-400 ring-amber-200',
    },
    {
      filter: 'critical',
      label: 'Terlambat/Kritis',
      value: String(criticalWarningCount),
      description: 'Butuh perhatian lebih cepat.',
      className: 'siaga-card-critical text-red-950 shadow-red-950/10',
      activeClassName: 'border-red-400 ring-red-200',
    },
    {
      filter: 'recommendation',
      label: 'Rekomendasi',
      value: String(recommendationCount),
      description: 'Teguran/klarifikasi konseptual.',
      className: 'siaga-card-recommendation text-cyan-950 shadow-cyan-950/10',
      activeClassName: 'border-cyan-400 ring-cyan-200',
    },
  ]

  const missionStats = [
    { label: 'Misi Aktif', value: '0', tone: 'text-blue-700 bg-blue-50 border-blue-100' },
    { label: 'Selesai', value: '0', tone: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
    { label: 'Peringatan Sistem', value: String(haloWarningSource.warningSummary.total), tone: 'text-amber-700 bg-amber-50 border-amber-100' },
  ]

  const faqItems = useMemo(() => {
    const role = currentUser?.role

    return HALO_FAQ_ITEMS.filter((item) => {
      if (item.alwaysVisible) return true
      if (!role) return false
      if (item.roles?.includes(role)) return true
      if (item.accessPath) return canAccessPage(role, item.accessPath)
      return false
    })
  }, [currentUser?.role])

  const dataSourceLabel = dashboardDataSource === 'database' ? 'Database' : 'Data Demo/Fallback'

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl shadow-slate-900/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 md:bottom-5"
        title="Halo SIAGA-SDA"
        aria-label="Halo SIAGA-SDA"
      >
        <Bot className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Halo SIAGA-SDA</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] bg-slate-950/45 p-3 pt-5 md:flex md:items-center md:justify-center md:p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="mx-auto mt-auto flex max-h-[94dvh] w-[calc(100vw-24px)] max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl shadow-slate-950/30 md:mt-0 md:max-h-[92vh] md:w-[90vw] md:max-w-[1200px] md:rounded-3xl lg:w-[75vw] xl:max-w-[1280px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="halo-siaga-sda-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="shrink-0 border-b border-slate-100 bg-gradient-to-br from-slate-950 via-[#0D2C54] to-cyan-800 px-4 py-4 text-white">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-lg">
                    {avatarAvailable ? (
                      <img
                        src="/assets/halo-siaga-sda-avatar.png"
                        alt="Avatar Halo SIAGA-SDA"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center bg-cyan-50 text-[#0D2C54]">
                        <span className="text-lg font-black">S</span>
                        <span className="text-[8px] font-bold leading-none">SDA</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100">Asisten Virtual</p>
                    <h2 id="halo-siaga-sda-title" className="text-lg font-black leading-tight">Halo SIAGA-SDA</h2>
                    <p className="mt-1 text-sm font-semibold text-cyan-50">{haloSubtitle}</p>
                    <p className="text-xs text-cyan-100">Dibantu AI Analis SDA</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="shrink-0 rounded-full bg-white/12 p-2 text-cyan-50 transition hover:bg-white/20"
                  aria-label="Tutup Halo SIAGA-SDA"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain bg-slate-100/70 p-3 sm:p-4">
              <section className="siaga-section-canvas p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[11px] font-bold text-cyan-800">Belum Terhubung Data Resmi</span>
                  <span className="rounded-full border border-cyan-200 bg-white px-2.5 py-1 text-[11px] font-bold text-cyan-800">Mode Panduan Lokal</span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-600">Persiapan UI</span>
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">{dataSourceLabel}</span>
                </div>
                <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-800">{roleSentence}</p>
                {haloRoleSummary && (
                  <p className="siaga-card-compact siaga-card-recommendation mt-2 px-3 py-2 text-xs font-semibold leading-relaxed text-cyan-900">
                    {haloRoleSummary}
                  </p>
                )}
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  Konteks halaman: {context}. Panel ini masih dalam mode panduan lokal, belum membaca misi resmi, dan belum melakukan perubahan data.
                </p>
              </section>

              <section className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
                <div className="siaga-card-compact px-4 py-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    <Clock className="h-4 w-4 text-cyan-700" aria-hidden="true" />
                    Sisa waktu misi harian
                  </div>
                  <div className="mt-2 text-2xl font-black text-slate-900">{countdownLabel}</div>
                  <p className="mt-1 text-xs text-slate-500">Menuju akhir hari kerja kalender lokal perangkat.</p>
                </div>

                <div className="siaga-card-compact px-4 py-3 sm:w-40">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    <CalendarDays className="h-4 w-4 text-blue-700" aria-hidden="true" />
                    Hari Ini
                  </div>
                  <p className="mt-2 text-sm font-bold leading-relaxed text-slate-800">{dateLabel}</p>
                </div>
              </section>

              <section className="siaga-section-canvas-muted p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      <Clock className="h-4 w-4 text-blue-700" aria-hidden="true" />
                      Kendali Waktu Pekerjaan
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      {haloWarningSource.warningSummary.total > 0
                        ? `${haloWarningSource.warningSummary.total} paket memerlukan perhatian dalam scope Anda. Detail paket dipusatkan pada Peringatan Sistem di bawah.`
                        : 'Belum ada peringatan waktu pekerjaan pada scope Anda.'}
                    </p>
                  </div>
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-black text-amber-800">
                    Ringkasan Agregat
                  </span>
                </div>

                <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2 xl:grid-cols-4">
                  {warningSummaryCards.map((card) => {
                    const isActive = activeWarningFilter === card.filter

                    return (
                      <button
                        key={card.filter}
                        type="button"
                        onClick={() => handleWarningFilterChange(card.filter)}
                        aria-pressed={isActive}
                        className={`siaga-card-interactive px-3 py-2.5 text-left ring-1 ring-white/80 focus:ring-4 ${card.className} ${isActive ? `${card.activeClassName} scale-[1.01] shadow-[0_18px_34px_rgba(15,23,42,0.14)]` : ''}`}
                      >
                        <span className="block font-black uppercase tracking-[0.14em] opacity-70">{card.label}</span>
                        <span className="mt-1 block text-2xl font-black leading-none">{card.value}</span>
                        <span className="mt-2 block text-[11px] font-semibold leading-relaxed opacity-80">{card.description}</span>
                        <span className="mt-3 inline-flex rounded-full border border-white/70 bg-white/70 px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] opacity-80">
                          {isActive ? 'Filter aktif' : 'Klik filter'}
                        </span>
                      </button>
                    )
                  })}
                </div>

                <div className="siaga-card-compact siaga-card-neutral mt-3 p-3">
                  <p className="text-sm font-extrabold text-slate-900">
                    {haloWarningSource.priorityWarning
                      ? `Prioritas tertinggi: ${haloWarningSource.priorityWarning.title}`
                      : 'Prioritas tertinggi belum tersedia.'}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Kendali Waktu hanya ringkasan. Buka daftar Peringatan Sistem untuk detail paket, pihak terkait, dan rekomendasi tindak lanjut.
                  </p>
                  {haloWarningSource.warningSummary.total > 0 && (
                    <button
                      type="button"
                      onClick={() => handleWarningFilterChange('warning')}
                      className="mt-3 inline-flex rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs font-black text-amber-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-50"
                    >
                      Lihat Peringatan Sistem
                    </button>
                  )}
                </div>
              </section>

              <section className="grid grid-cols-3 gap-2">
                {missionStats.map((item) => (
                  <div key={item.label} className={`siaga-card-compact p-2.5 text-center ${item.tone}`}>
                    <div className="text-2xl font-black">{item.value}</div>
                    <div className="mt-1 text-[11px] font-bold leading-tight">{item.label}</div>
                  </div>
                ))}
              </section>

              <section id="halo-peringatan-sistem" className="siaga-section-canvas siaga-card-warning p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 shadow-sm">
                    <Bell className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-black text-slate-900">{warningSectionTitle}</h3>
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-black text-amber-800">
                        Filter: {activeWarningFilterLabel}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-700">
                      {warningSectionDescription}
                    </p>
                    {activeWarningFilter !== 'personal' && haloWarningSource.warningSummary.total > 0 && (
                      <p className="mt-2 text-[11px] font-bold text-slate-500">
                        Menampilkan {visibleHaloWarnings.length} dari {filteredHaloWarnings.length} item pada filter aktif. Total peringatan sistem: {haloWarningSource.warningSummary.total}.
                      </p>
                    )}
                  </div>
                </div>

                {visibleHaloWarnings.length === 0 ? (
                  <div className="siaga-card-compact siaga-card-neutral mt-3 border-dashed p-3">
                    <p className="text-sm font-extrabold text-slate-800">
                      {activeWarningFilter === 'personal' ? 'Belum ada misi pribadi hari ini.' : 'Tidak ada item pada filter ini.'}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      Halo tetap memisahkan misi pribadi dari peringatan sistem dan tidak membuka data di luar scope.
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 max-h-[52dvh] space-y-3 overflow-y-auto pr-1 md:max-h-[56vh]">
                    {visibleHaloWarnings.map((warning) => (
                      <article key={warning.id} className="siaga-card-compact siaga-card-neutral p-3">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">{warning.project.kode}</p>
                            <h4 className="mt-1 line-clamp-2 text-sm font-black leading-snug text-slate-900">{warning.title}</h4>
                          </div>
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${warning.level === 'critical' ? 'bg-red-50 text-red-700' : warning.level === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>
                            {warning.statusLabel}
                          </span>
                        </div>

                        <div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-3">
                          <div className="siaga-card-compact px-3 py-2">
                            <p className="font-black uppercase tracking-[0.14em] text-slate-400">Progress</p>
                            <p className="mt-1 font-bold text-slate-800">{warning.progressFisik}% fisik / {warning.progressKeuangan}% keuangan</p>
                          </div>
                          <div className="siaga-card-compact px-3 py-2">
                            <p className="font-black uppercase tracking-[0.14em] text-slate-400">Target</p>
                            <p className="mt-1 font-bold text-slate-800">{warning.targetLabel}</p>
                          </div>
                          <div className="siaga-card-compact px-3 py-2">
                            <p className="font-black uppercase tracking-[0.14em] text-slate-400">Status Waktu</p>
                            <p className="mt-1 font-bold text-slate-800">{warning.remainingLabel}</p>
                          </div>
                        </div>

                        <p className="mt-3 text-xs leading-relaxed text-slate-600">{warning.detail}</p>

                        <div className="siaga-card-compact siaga-card-warning mt-3 px-3 py-2 text-xs leading-relaxed text-amber-950">
                          <p className="font-black">{warning.recommendation}</p>
                          <p className="mt-1">{warning.limitation}</p>
                        </div>

                        <div className="mt-3 grid gap-2 text-xs lg:grid-cols-2">
                          <div className="siaga-card-compact px-3 py-2">
                            <p className="font-black uppercase tracking-[0.14em] text-slate-400">Status Tindak Lanjut</p>
                            <p className="mt-1 font-bold text-slate-800">{warning.followUpStatus}</p>
                            <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                              Status ini konseptual dan belum menulis database.
                            </p>
                          </div>
                          <div className="siaga-card-compact px-3 py-2">
                            <p className="font-black uppercase tracking-[0.14em] text-slate-400">Pihak Terkait</p>
                            <ul className="mt-1 space-y-1 text-slate-600">
                              {warning.relatedParties.slice(0, 6).map((party) => (
                                <li key={party}>- {party}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[11px] font-semibold text-slate-500">
                            Status konseptual tersedia: {WARNING_FOLLOW_UP_STATUSES.length} tahap tindak lanjut.
                          </span>
                          <Link href={warning.href} className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-xs font-black text-white transition hover:bg-blue-700">
                            Buka Paket
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>

              <section className="siaga-section-canvas-muted siaga-card-recommendation border-dashed p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white text-cyan-700 shadow-sm">
                    <Target className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">Belum ada misi pribadi hari ini.</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-700">
                      Akun Anda sudah aktif, tetapi saat ini belum ada misi harian yang terhubung dengan role dan assignment Anda. Misi baru akan muncul setelah admin atau pejabat berwenang memberikan penugasan.
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500">
                      Ini bukan error. Halo SIAGA-SDA masih berjalan dalam mode panduan lokal dan belum membaca data misi resmi.
                    </p>
                  </div>
                </div>
              </section>

              <section className="siaga-section-canvas-muted siaga-card-warning p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white text-amber-700 shadow-sm">
                    <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-black text-amber-950">Deviasi Paket dan Draft Surat Teguran</h3>
                    <p className="mt-1 text-sm leading-relaxed text-amber-900">
                      Jika paket pekerjaan melewati batas deviasi, sistem dapat menyiapkan peringatan dan draft surat teguran untuk direview pejabat berwenang. Draft surat teguran bukan surat resmi sampai direview dan disahkan oleh pejabat berwenang.
                    </p>
                  </div>
                </div>
              </section>

              <section className="grid gap-3 lg:grid-cols-2">
                <div className="siaga-card px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-black text-slate-900">Panduan Role Saya</h3>
                    <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[11px] font-black text-cyan-800">
                      {roleLabel || 'Role belum terbaca'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{roleGuide.focus}</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Bisa dilihat</p>
                      <ul className="mt-1 space-y-1 text-xs leading-relaxed text-slate-600">
                        {roleGuide.canView.map((item) => (
                          <li key={item}>- {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Bisa dilakukan</p>
                      <ul className="mt-1 space-y-1 text-xs leading-relaxed text-slate-600">
                        {roleGuide.canAct.map((item) => (
                          <li key={item}>- {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Batasan</p>
                      <ul className="mt-1 space-y-1 text-xs leading-relaxed text-slate-600">
                        {roleGuide.limits.map((item) => (
                          <li key={item}>- {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="siaga-card px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-black text-slate-900">Panduan Halaman Aktif</h3>
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-black ${pageAccessAllowed ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-amber-200 bg-amber-50 text-amber-800'}`}>
                      {pageAccessAllowed ? 'Akses tersedia' : 'Akses dibatasi'}
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-700">{pageGuide.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700">{pageGuide.function}</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Di halaman ini</p>
                      <ul className="mt-1 space-y-1 text-xs leading-relaxed text-slate-600">
                        {pageGuide.canDo.map((item) => (
                          <li key={item}>- {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Langkah berikut</p>
                      <ul className="mt-1 space-y-1 text-xs leading-relaxed text-slate-600">
                        {pageGuide.nextSteps.map((item) => (
                          <li key={item}>- {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Catatan akses</p>
                      <ul className="mt-1 space-y-1 text-xs leading-relaxed text-slate-600">
                        {pageGuide.limits.map((item) => (
                          <li key={item}>- {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section className="siaga-card px-4 py-3">
                <h3 className="text-sm font-black text-slate-900">Mengapa Menu Tidak Muncul?</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Halo hanya menjelaskan hasil guard frontend yang sedang aktif. Jika menu tidak tampil, biasanya role, permission, atau assignment belum membuka modul tersebut.
                </p>
                <div className="mt-3 space-y-2">
                  {menuAccessNotes.map((item) => (
                    <p key={item} className="siaga-card-compact siaga-card-neutral px-3 py-2 text-xs font-semibold leading-relaxed text-slate-700">
                      {item}
                    </p>
                  ))}
                </div>
              </section>

              <section className="siaga-section-canvas-muted p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-900">
                  <MessageSquareText className="h-5 w-5 text-blue-700" aria-hidden="true" />
                  Tanya Halo SIAGA-SDA
                </div>
                <textarea
                  disabled
                  rows={3}
                  placeholder="Tanya seputar misi harian, SOP, deviasi paket, surat teguran, administrasi, atau alur kerja SIAGA-SDA..."
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-500 outline-none"
                />
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  Mode panduan lokal. Fitur tanya jawab resmi akan diaktifkan setelah sumber SOP dan batas akses disetujui.
                </p>

                <div className="mt-4 space-y-2">
                  {faqItems.map((item) => (
                    <details key={item.question} className="siaga-card-compact siaga-card-neutral px-3 py-2">
                      <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-bold text-slate-800">
                        <HelpCircle className="h-4 w-4 text-cyan-700" aria-hidden="true" />
                        {item.question}
                      </summary>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>

              <section className="siaga-section-canvas-muted siaga-card-info p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm">
                    <Bell className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-black text-blue-950">Konsep Pengingat Harian</h3>
                    <p className="mt-1 text-sm leading-relaxed text-blue-900">
                      Nantinya Halo SIAGA-SDA dapat menampilkan pengingat pagi untuk misi prioritas hari ini. Pada tahap ini pengingat masih konsep UI dan belum mengirim notifikasi resmi.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <div className="shrink-0 border-t border-slate-200 bg-white p-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-blue-700"
              >
                Tutup Halo SIAGA-SDA
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
