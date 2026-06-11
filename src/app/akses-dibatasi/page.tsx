import { AccessSafetyPage } from '@/components/access/AccessSafetyPage'

export default function AksesDibatasiPage() {
  return (
    <AccessSafetyPage
      tone="restricted"
      title="Akses Dibatasi"
      message="Halaman ini hanya dapat diakses oleh user yang memiliki role dan penugasan aktif sesuai kewenangan. Silakan hubungi Admin Sistem jika akses ini diperlukan."
    />
  )
}

