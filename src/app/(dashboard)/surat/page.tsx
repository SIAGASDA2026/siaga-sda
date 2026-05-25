'use client'

import { Mail } from 'lucide-react'
import { ModuleLandingPage } from '@/components/modules/ModuleLandingPage'

export default function SuratPage() {
  return (
    <ModuleLandingPage
      title="Surat Masuk & Keluar"
      subtitle="Disposisi, undangan rapat, tindak lanjut surat, arsip, dan relasi ke survey/paket/peil."
      icon={Mail}
      primaryHref="/pengumuman"
      primaryLabel="Buka Pengumuman Lama"
      cards={[
        { label: 'Surat Penting', value: '0', desc: 'Belum ada tabel surat resmi.' },
        { label: 'Disposisi Pending', value: '0', desc: 'Menunggu workflow surat.' },
        { label: 'Tindak Lanjut', value: '0', desc: 'Belum terhubung ke survey/paket/peil.' },
      ]}
      checklist={['Input surat masuk dan surat keluar', 'Disposisi berbasis role dan assignment', 'Relasi surat ke survey, paket, dan peil', 'Audit log dan approval surat formal']}
    />
  )
}
