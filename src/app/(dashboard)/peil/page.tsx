'use client'

import { Landmark } from 'lucide-react'
import { ModuleLandingPage } from '@/components/modules/ModuleLandingPage'

export default function PeilPage() {
  return (
    <ModuleLandingPage
      title="Peil Banjir"
      subtitle="Layanan permohonan rekomendasi teknis peil banjir dari Surat Masuk sampai verifikasi administrasi, survey lokasi, review hidrologi/hidrolika, approval PPTK/PPK, tanda tangan Kadis, dan arsip Surat Keluar."
      icon={Landmark}
      primaryHref="/surat"
      primaryLabel="Buka Surat Masuk"
      cards={[
        { label: 'Permohonan Aktif', value: '0', desc: 'Belum ada data permohonan resmi.' },
        { label: 'Verifikasi Administrasi', value: '0', desc: 'Menunggu checklist persyaratan aktif.' },
        { label: 'Rekomendasi Terbit', value: '0', desc: 'Belum ada surat rekomendasi terbit.' },
      ]}
      checklist={[
        'Surat Masuk kategori Permohonan Rekomendasi Peil Banjir',
        'Persyaratan Administrasi dengan snapshot checklist per permohonan',
        'Survey lokasi, titik koordinat, dan review hidrologi/hidrolika',
        'Approval PPTK/PPK, tanda tangan Kadis, Surat Keluar, dan audit trail',
      ]}
    />
  )
}
