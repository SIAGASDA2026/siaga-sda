'use client'

import { Building2 } from 'lucide-react'
import { ModuleLandingPage } from '@/components/modules/ModuleLandingPage'

export default function AssetPage() {
  return (
    <ModuleLandingPage
      title="Asset SDA"
      subtitle="Inventaris pintu air, rumah pompa, pompa mobile, tanggul, drainase utama, kolam retensi, dan status operasional."
      icon={Building2}
      primaryHref="/peta"
      primaryLabel="Buka Peta Monitoring"
      cards={[
        { label: 'Asset Aktif', value: '0', desc: 'Belum ada tabel asset SDA.' },
        { label: 'Perlu Respon', value: '0', desc: 'Menunggu status operasional asset.' },
        { label: 'Laporan Asset', value: '0', desc: 'Belum terhubung laporan operasi.' },
      ]}
      checklist={['Peta asset SDA', 'Status operasi pintu air/rumah pompa', 'Riwayat pemeliharaan asset', 'Relasi asset ke warning dan operasional']}
    />
  )
}
