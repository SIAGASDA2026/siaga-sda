'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRight, CheckCircle, LucideIcon } from 'lucide-react'
import { Topbar } from '@/components/layout/Topbar'

type ModuleLandingPageProps = {
  title: string
  subtitle: string
  icon: LucideIcon
  cards: { label: string; value: string; desc: string }[]
  checklist: string[]
  primaryHref?: string
  primaryLabel?: string
  children?: ReactNode
}

export function ModuleLandingPage({
  title,
  subtitle,
  icon: Icon,
  cards,
  checklist,
  primaryHref = '/dashboard',
  primaryLabel = 'Kembali ke Dashboard',
  children,
}: ModuleLandingPageProps) {
  return (
    <>
      <Topbar title={title} subtitle={subtitle} />
      <div className="space-y-5 p-4 sm:p-5">
        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#1976D2]">
                <Icon className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-black text-slate-900">{title}</h1>
                <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-500">{subtitle}</p>
              </div>
            </div>
            <Link href={primaryHref} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0D2C54] px-4 text-sm font-extrabold text-white hover:bg-[#1976D2]">
              {primaryLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {children}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <div key={card.label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="text-3xl font-black text-[#0D2C54]">{card.value}</div>
              <div className="mt-1 text-sm font-extrabold text-slate-900">{card.label}</div>
              <div className="mt-1 text-xs leading-relaxed text-slate-500">{card.desc}</div>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">
          Modul ini disiapkan sebagai shell UI SIAGA-SDA tahap awal. Data resmi, workflow, approval, dan audit detail akan aktif setelah migration database modul terkait dibuat.
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-3 text-sm font-extrabold text-slate-900">Kebutuhan Tahap Lanjutan</div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {checklist.map((item) => (
              <div key={item} className="flex gap-2 rounded-xl border border-slate-100 p-3 text-sm text-slate-700">
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#43A047]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

export default ModuleLandingPage
