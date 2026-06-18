'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AlertTriangle, Bell, Bot, CalendarDays, Clock, HelpCircle, MessageSquareText, Target, X } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { canAccessPage } from '@/lib/rbac'

type HaloFaqItem = {
  question: string
  answer: string
  alwaysVisible?: boolean
  accessPath?: string
  roles?: string[]
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
  const [open, setOpen] = useState(false)
  const [now, setNow] = useState<Date | null>(null)
  const [avatarAvailable, setAvatarAvailable] = useState(false)

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

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  const context = useMemo(() => getPageContext(pathname), [pathname])
  const roleLabel = getHaloRoleLabel(currentUser?.role)
  const haloRoleSummary = getHaloRoleSummary(currentUser?.role)
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
    ? `Misi Anda sebagai ${roleLabel} yang harus diselesaikan hari ini, ${dateLabel}.`
    : `Misi Anda yang harus diselesaikan hari ini, ${dateLabel}.`

  const missionStats = [
    { label: 'Misi Aktif', value: '0', tone: 'text-blue-700 bg-blue-50 border-blue-100' },
    { label: 'Selesai', value: '0', tone: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
    { label: 'Perlu Perhatian', value: '0', tone: 'text-amber-700 bg-amber-50 border-amber-100' },
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
          className="fixed inset-0 z-[70] bg-slate-950/45 p-3 pt-10 md:flex md:items-end md:justify-end"
          onClick={() => setOpen(false)}
        >
          <div
            className="mx-auto mt-auto flex max-h-[88dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl shadow-slate-950/30 md:mb-5 md:mr-5 md:mt-0 md:max-h-[82dvh] md:rounded-3xl"
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
                    <p className="mt-1 text-sm font-semibold text-cyan-50">Misi Harian Saya</p>
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

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain bg-slate-50 p-4">
              <section className="rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[11px] font-bold text-cyan-800">Belum Terhubung Data Resmi</span>
                  <span className="rounded-full border border-cyan-200 bg-white px-2.5 py-1 text-[11px] font-bold text-cyan-800">Mode Panduan Lokal</span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-600">Persiapan UI</span>
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">{dataSourceLabel}</span>
                </div>
                <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-800">{roleSentence}</p>
                {haloRoleSummary && (
                  <p className="mt-2 rounded-2xl border border-cyan-100 bg-cyan-50 px-3 py-2 text-xs font-semibold leading-relaxed text-cyan-900">
                    {haloRoleSummary}
                  </p>
                )}
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  Konteks halaman: {context}. Panel ini masih dalam mode panduan lokal, belum membaca misi resmi, dan belum melakukan perubahan data.
                </p>
              </section>

              <section className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    <Clock className="h-4 w-4 text-cyan-700" aria-hidden="true" />
                    Sisa Waktu
                  </div>
                  <div className="mt-2 text-2xl font-black text-slate-900">{countdownLabel}</div>
                  <p className="mt-1 text-xs text-slate-500">Menuju akhir hari kerja kalender lokal perangkat.</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:w-40">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    <CalendarDays className="h-4 w-4 text-blue-700" aria-hidden="true" />
                    Hari Ini
                  </div>
                  <p className="mt-2 text-sm font-bold leading-relaxed text-slate-800">{dateLabel}</p>
                </div>
              </section>

              <section className="grid grid-cols-3 gap-2">
                {missionStats.map((item) => (
                  <div key={item.label} className={`rounded-2xl border p-3 text-center ${item.tone}`}>
                    <div className="text-2xl font-black">{item.value}</div>
                    <div className="mt-1 text-[11px] font-bold leading-tight">{item.label}</div>
                  </div>
                ))}
              </section>

              <section className="rounded-2xl border border-dashed border-cyan-200 bg-cyan-50/70 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white text-cyan-700 shadow-sm">
                    <Target className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">Belum Ada Misi Harian</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-700">
                      Akun Anda sudah aktif, tetapi saat ini belum ada misi harian yang terhubung dengan role dan assignment Anda. Misi baru akan muncul setelah admin atau pejabat berwenang memberikan penugasan.
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500">
                      Ini bukan error. Halo SIAGA-SDA masih berjalan dalam mode panduan lokal dan belum membaca data misi resmi.
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
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

              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
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
                    <details key={item.question} className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2">
                      <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-bold text-slate-800">
                        <HelpCircle className="h-4 w-4 text-cyan-700" aria-hidden="true" />
                        {item.question}
                      </summary>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
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
