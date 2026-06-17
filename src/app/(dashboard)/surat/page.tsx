'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle, Mail } from 'lucide-react'
import { ModuleLandingPage } from '@/components/modules/ModuleLandingPage'
import {
  SURAT_CATEGORIES,
  SURAT_CONCEPT_DEMO_ITEMS,
  SURAT_FOLLOW_UP_ACTIONS,
  SURAT_PREPARATION_BADGE,
  SURAT_STATUS_FLOW,
  SURAT_WORKFLOW_STEPS,
} from '@/lib/workflow-mapping'

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
      <section className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-blue-200 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">
              {SURAT_PREPARATION_BADGE.label}
            </div>
            <h2 className="mt-3 text-2xl font-black text-slate-950">Workflow Surat Masuk & Keluar</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
              {SURAT_PREPARATION_BADGE.description} Data resmi surat belum boleh diarahkan ke Pengumuman lama.
            </p>
          </div>
          <div className="rounded-2xl border border-cyan-100 bg-white/80 p-4 text-sm text-cyan-900">
            <div className="font-extrabold">Traceability target</div>
            <p className="mt-1 leading-6">Surat tetap bisa dilacak ke survey, paket, peil, approval, dashboard, dan audit log setelah data resmi tersedia.</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="text-sm font-extrabold text-slate-900">Timeline Alur Visual</div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          {SURAT_WORKFLOW_STEPS.map((step, index) => (
            <div key={step.id} className="rounded-2xl border border-blue-100 bg-blue-50/70 p-3">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-500">Tahap {index + 1}</div>
              <div className="mt-1 text-sm font-extrabold text-slate-900">{step.label}</div>
              <p className="mt-2 text-xs leading-5 text-slate-600">{step.description}</p>
              <div className="mt-3 rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-blue-700">{step.target}</div>
            </div>
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

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-extrabold text-slate-900">Peta Tindak Lanjut Surat</div>
            <p className="mt-1 text-sm text-slate-500">Semua aksi di bawah adalah route resmi dan belum menulis data ke database.</p>
          </div>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">Konseptual, bukan data resmi</span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {SURAT_FOLLOW_UP_ACTIONS.map((action) => (
            <Link key={action.id} href={action.href} className="group rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-extrabold text-slate-900">{action.label}</div>
                  <div className="mt-1 inline-flex rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-blue-700">{action.status}</div>
                </div>
                <ArrowRight className="h-4 w-4 flex-shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-500">{action.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="text-sm font-extrabold text-slate-900">Tombol Route Resmi</div>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { label: 'Kembali ke Dashboard', href: '/dashboard' },
            { label: 'Lihat Survey', href: '/survey' },
            { label: 'Lihat Paket Pekerjaan', href: '/proyek' },
            { label: 'Lihat Approval Center', href: '/approval' },
            { label: 'Lihat Peil Banjir', href: '/peil' },
            { label: 'Lihat Audit Log', href: '/audit-log' },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-extrabold text-slate-700 shadow-sm hover:border-blue-200 hover:bg-blue-50">
              {item.label}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-amber-100 bg-amber-50 p-5 shadow-sm">
        <div className="text-sm font-extrabold text-amber-900">Contoh alur konseptual</div>
        <p className="mt-1 text-sm leading-6 text-amber-800">Contoh berikut hanya untuk membantu membaca workflow. Semua nama contoh diberi suffix -demo dan bukan data resmi.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {SURAT_CONCEPT_DEMO_ITEMS.map((item) => (
            <div key={item.id} className="rounded-2xl border border-amber-200 bg-white p-4">
              <div className="text-sm font-extrabold text-slate-900">{item.title}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-[11px] font-bold text-cyan-800">{item.category}</span>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-800">{item.status}</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800">{item.nextStep}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900">
        <div className="flex items-start gap-2">
          <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <p className="leading-6">Tidak ada form input Surat resmi pada tahap ini. Tidak ada tabel data resmi palsu. Implementasi database dan API Surat disiapkan untuk tahap lanjutan setelah mapping disetujui.</p>
        </div>
      </section>
    </ModuleLandingPage>
  )
}
