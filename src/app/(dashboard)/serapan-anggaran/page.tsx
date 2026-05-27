'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Topbar } from '@/components/layout/Topbar'
import { formatCurrency } from '@/lib/utils'

export default function SerapanAnggaranPage() {
  const { projects, currentUser } = useAppStore()
  const budgetYear = new Date().getFullYear()

  const summary = useMemo(() => {
    const groups: Record<string, { label: string; totalPagu: number; kontrak: number; serapan: number; count: number }> = {}
    projects.forEach((p) => {
      const program = p.program || 'Tidak Diketahui'
      const sub = p.subKegiatan || 'Umum'
      const key = `${program}||${sub}`
      const anggaran = p.anggaran || 0
      const kontrak = p.nilaiKontrak || 0
      const serapan = Math.round((p.progressKeuangan || 0) * anggaran / 100)
      if (!groups[key]) groups[key] = { label: `${program} › ${sub}`, totalPagu: 0, kontrak: 0, serapan: 0, count: 0 }
      groups[key].totalPagu += anggaran
      groups[key].kontrak += kontrak
      groups[key].serapan += serapan
      groups[key].count += 1
    })
    const rows = Object.values(groups).map((g) => ({
      label: g.label,
      totalPagu: g.totalPagu,
      kontrak: g.kontrak,
      serapan: g.serapan,
      persen: g.totalPagu > 0 ? Math.round((g.serapan / g.totalPagu) * 100) : 0,
    }))
    rows.sort((a, b) => b.serapan - a.serapan)
    return rows
  }, [projects])

  const totalPagu = summary.reduce((s, r) => s + r.totalPagu, 0)
  const totalKontrak = summary.reduce((s, r) => s + r.kontrak, 0)
  const totalSerapan = summary.reduce((s, r) => s + r.serapan, 0)

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <Topbar title={"Serapan Anggaran"} subtitle={`Program, Kegiatan, Sub Kegiatan - Tahun ${budgetYear}`} />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-4">
          <div className="text-xs uppercase text-slate-500">Total Pagu</div>
          <div className="mt-2 text-2xl font-black text-slate-900">{formatCurrency(totalPagu)}</div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-4">
          <div className="text-xs uppercase text-slate-500">Total Kontrak</div>
          <div className="mt-2 text-2xl font-black text-slate-900">{formatCurrency(totalKontrak)}</div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-4">
          <div className="text-xs uppercase text-slate-500">Total Serapan</div>
          <div className="mt-2 text-2xl font-black text-slate-900">{formatCurrency(totalSerapan)}</div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase text-slate-500">Serapan per Program / Sub Kegiatan (Top items)</div>
            <div className="mt-2 text-lg font-semibold text-slate-900">Ringkasan</div>
          </div>
          <Link href={'/proyek?view=serapan-anggaran'} className="text-sm font-semibold text-cyan-700">Lihat Data Lengkap</Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-[720px] w-full text-left text-sm text-slate-700">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.12em] text-slate-500">
                <th className="px-3 py-3">Program › Sub Kegiatan</th>
                <th className="px-3 py-3">Pagu</th>
                <th className="px-3 py-3">Kontrak</th>
                <th className="px-3 py-3">Serapan</th>
                <th className="px-3 py-3">% Serapan</th>
              </tr>
            </thead>
            <tbody>
              {summary.slice(0, 20).map((row) => (
                <tr key={row.label} className="border-b border-slate-100 bg-white hover:bg-slate-50">
                  <td className="px-3 py-3 align-top">
                    <div className="font-semibold text-slate-900">{row.label}</div>
                  </td>
                  <td className="px-3 py-3 font-black text-slate-900">{formatCurrency(row.totalPagu)}</td>
                  <td className="px-3 py-3 text-slate-800">{formatCurrency(row.kontrak)}</td>
                  <td className="px-3 py-3 text-slate-800">{formatCurrency(row.serapan)}</td>
                  <td className="px-3 py-3 text-slate-900">{row.persen}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
