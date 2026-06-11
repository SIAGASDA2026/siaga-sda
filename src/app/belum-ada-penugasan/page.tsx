import { AccessSafetyPage } from '@/components/access/AccessSafetyPage'

export default function BelumAdaPenugasanPage() {
  return (
    <AccessSafetyPage
      tone="assignment"
      title="Belum Ada Penugasan Aktif"
      message="Anda memiliki role terkait, tetapi belum ditugaskan ke data/kegiatan/paket tersebut. Silakan hubungi Admin Sistem."
    />
  )
}

