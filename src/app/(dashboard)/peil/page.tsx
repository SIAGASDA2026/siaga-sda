'use client'

import { Landmark } from 'lucide-react'
import { ModuleLandingPage } from '@/components/modules/ModuleLandingPage'

export default function PeilPage() {
  return (
    <ModuleLandingPage
      title="Peil Banjir"
      subtitle="Monitoring titik peil, tinggi muka air, ambang banjir, status genangan, dan histori pengukuran."
      icon={Landmark}
      primaryHref="/peta"
      primaryLabel="Buka Peta Monitoring"
      cards={[
        { label: 'Titik Peil Aktif', value: '0', desc: 'Belum ada tabel titik peil.' },
        { label: 'Status Siaga', value: '0', desc: 'Menunggu threshold peil.' },
        { label: 'Update Hari Ini', value: '0', desc: 'Belum ada observasi peil.' },
      ]}
      checklist={['Master titik peil dan koordinat', 'Input tinggi muka air lapangan', 'Threshold aman/waspada/siaga/kritis', 'Approval dan audit peil']}
    />
  )
}
