'use client'

import Link from 'next/link'
import { Mail } from 'lucide-react'
import { ModuleLandingPage } from '@/components/modules/ModuleLandingPage'
import { SURAT_CATEGORIES, SURAT_FOLLOW_UP_ROUTES, SURAT_STATUS_FLOW } from '@/lib/workflow-mapping'

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

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="text-sm font-extrabold text-slate-900">Peta Alur Surat Resmi</div>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          {['Surat Masuk', 'Disposisi', 'Survey/Paket/Peil', 'Approval/Arsip', 'Dashboard/Audit Log'].map((step, index) => (
            <div key={step} className="rounded-2xl border border-blue-100 bg-blue-50/70 p-3">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-500">Tahap {index + 1}</div>
              <div className="mt-1 text-sm font-extrabold text-slate-900">{step}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {SURAT_FOLLOW_UP_ROUTES.filter((item) => ['/survey', '/proyek', '/approval', '/dashboard'].includes(item.href)).map((item) => (
            <Link key={item.href} href={item.href} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-extrabold text-slate-700 shadow-sm hover:border-blue-200 hover:bg-blue-50">
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="text-sm font-extrabold text-slate-900">Status Tampilan Surat</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {SURAT_STATUS_FLOW.map((status) => (
              <span key={status} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700">{status}</span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="text-sm font-extrabold text-slate-900">Kategori Surat Target</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {SURAT_CATEGORIES.map((category) => (
              <span key={category} className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-800">{category}</span>
            ))}
          </div>
        </div>
      </section>
    </ModuleLandingPage>
  )
}
