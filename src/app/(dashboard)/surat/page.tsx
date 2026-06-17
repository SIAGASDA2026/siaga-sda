'use client'

import { Mail } from 'lucide-react'
import { ModuleLandingPage } from '@/components/modules/ModuleLandingPage'

export default function SuratPage() {
  return (
    <ModuleLandingPage
      title="Surat Masuk & Keluar"
      subtitle="Disposisi, undangan rapat, tindak lanjut surat, arsip, dan relasi ke survey/paket/peil."
      icon={Mail}
      primaryHref="/dashboard"
      primaryLabel="Kembali ke Dashboard"
      cards={[
        { label: 'Surat Penting', value: '0', desc: 'Belum ada tabel surat resmi.' },
        { label: 'Disposisi Pending', value: '0', desc: 'Menunggu workflow surat.' },
        { label: 'Tindak Lanjut', value: '0', desc: 'Belum terhubung ke survey/paket/peil.' },
      ]}
      checklist={['Input surat masuk dan surat keluar', 'Disposisi berbasis role dan assignment', 'Relasi surat ke survey, paket, dan peil', 'Audit log dan approval surat formal']}
    >
      <section className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm text-blue-900">
        <div className="font-extrabold">Status workflow surat</div>
        <p className="mt-1 leading-6">
          Modul surat masih berstatus persiapan. Data resmi surat belum boleh diarahkan ke Pengumuman lama.
          Alur target: surat masuk/usulan - disposisi - survey atau paket/peil - approval bila diperlukan - dashboard rekap - audit log.
        </p>
      </section>
    </ModuleLandingPage>
  )
}
