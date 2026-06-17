'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Clock, ExternalLink, FileText, MapPin, ShieldCheck, User, X } from 'lucide-react'

export type PhotoDocumentationItem = {
  id: string
  src: string
  thumbnailSrc?: string
  title?: string
  caption?: string
  module: 'survey' | 'paket' | 'administrasi' | 'surat' | 'peil' | 'asset' | 'peta' | 'audit' | 'lainnya'
  entityId?: string
  entityCode?: string
  entityName?: string
  location?: string
  takenAt?: string
  uploadedAt?: string
  uploadedBy?: string
  uploaderRole?: string
  progressPercent?: number
  physicalProgress?: number
  financialProgress?: number
  stage?: string
  status?: string
  verificationStatus?: string
  coordinates?: {
    lat?: number
    lng?: number
  }
  sourceLabel?: 'Database' | 'Demo' | 'Simulasi' | 'Persiapan' | 'Upload' | 'Lampiran'
  notes?: string
  detailHref?: string
}

type PhotoDocumentationViewerProps = {
  open: boolean
  items: PhotoDocumentationItem[]
  activeIndex?: number
  onClose: () => void
}

const MODULE_LABELS: Record<PhotoDocumentationItem['module'], string> = {
  survey: 'Survey Investigasi',
  paket: 'Paket Pekerjaan',
  administrasi: 'Administrasi',
  surat: 'Surat Masuk & Keluar',
  peil: 'Peil Banjir',
  asset: 'Asset SDA',
  peta: 'Peta Monitoring',
  audit: 'Audit Log',
  lainnya: 'Lainnya',
}

const SOURCE_STYLES: Record<NonNullable<PhotoDocumentationItem['sourceLabel']>, string> = {
  Database: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Demo: 'border-amber-200 bg-amber-50 text-amber-700',
  Simulasi: 'border-orange-200 bg-orange-50 text-orange-700',
  Persiapan: 'border-slate-200 bg-slate-50 text-slate-600',
  Upload: 'border-blue-200 bg-blue-50 text-blue-700',
  Lampiran: 'border-cyan-200 bg-cyan-50 text-cyan-700',
}

function formatDisplayDate(value?: string) {
  if (!value) return '-'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function DetailRow({ label, value }: { label: string; value?: string | number | null }) {
  if (value === undefined || value === null || value === '') return null
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-800">{value}</div>
    </div>
  )
}

export function PhotoDocumentationViewer({ open, items, activeIndex = 0, onClose }: PhotoDocumentationViewerProps) {
  const safeActiveIndex = Math.min(Math.max(activeIndex, 0), Math.max(items.length - 1, 0))
  const [currentIndex, setCurrentIndex] = useState(safeActiveIndex)

  useEffect(() => {
    setCurrentIndex(safeActiveIndex)
  }, [safeActiveIndex, open])

  const current = items[currentIndex]
  const hasMultiple = items.length > 1

  const metaRows = useMemo(() => {
    if (!current) return []
    const coordinateValue =
      current.coordinates?.lat !== undefined && current.coordinates?.lng !== undefined
        ? `${current.coordinates.lat.toFixed(6)}, ${current.coordinates.lng.toFixed(6)}`
        : undefined

    return [
      { label: 'Kode/ID Data', value: current.entityCode || current.entityId },
      { label: 'Nama Data', value: current.entityName },
      { label: 'Lokasi', value: current.location },
      { label: 'Tanggal Foto', value: formatDisplayDate(current.takenAt || current.uploadedAt) },
      { label: 'Uploader/Petugas', value: current.uploadedBy },
      { label: 'Role', value: current.uploaderRole },
      { label: 'Tahap', value: current.stage },
      { label: 'Status', value: current.status },
      { label: 'Verifikasi', value: current.verificationStatus },
      { label: 'Koordinat', value: coordinateValue },
      { label: 'Progress Fisik', value: current.physicalProgress !== undefined ? `${current.physicalProgress}%` : undefined },
      { label: 'Progress Keuangan', value: current.financialProgress !== undefined ? `${current.financialProgress}%` : undefined },
    ]
  }, [current])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft' && hasMultiple) setCurrentIndex((index) => Math.max(index - 1, 0))
      if (event.key === 'ArrowRight' && hasMultiple) setCurrentIndex((index) => Math.min(index + 1, items.length - 1))
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [hasMultiple, items.length, onClose, open])

  if (!open || !current) return null

  const sourceStyle = current.sourceLabel ? SOURCE_STYLES[current.sourceLabel] : SOURCE_STYLES.Upload

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/40 px-3 py-6" role="dialog" aria-modal="true">
      <div className="relative max-h-[86dvh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-100 bg-white/95 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-cyan-100 bg-cyan-50 px-2.5 py-1 text-[11px] font-bold text-cyan-700">
                Evidence Viewer
              </span>
              <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${sourceStyle}`}>
                {current.sourceLabel || 'Upload'}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Foto {currentIndex + 1} dari {items.length}
              </span>
            </div>
            <h2 className="mt-2 line-clamp-1 text-lg font-bold text-slate-900">{current.title || 'Dokumentasi Foto Lapangan'}</h2>
            <p className="mt-0.5 line-clamp-1 text-xs font-medium text-slate-500">{MODULE_LABELS[current.module]}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-800"
            aria-label="Tutup viewer foto"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-0 md:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
          <div className="bg-slate-950 p-3 sm:p-5">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900">
              <img
                src={current.src}
                alt={current.title || current.caption || 'Dokumentasi foto lapangan SIAGA-SDA'}
                loading="lazy"
                className="max-h-[56dvh] min-h-[240px] w-full object-contain"
              />
              {hasMultiple && (
                <>
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((index) => Math.max(index - 1, 0))}
                    disabled={currentIndex === 0}
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Foto sebelumnya"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((index) => Math.min(index + 1, items.length - 1))}
                    disabled={currentIndex === items.length - 1}
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Foto berikutnya"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {hasMultiple && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {items.map((item, index) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-14 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 bg-slate-800 ${
                      index === currentIndex ? 'border-cyan-300' : 'border-white/10'
                    }`}
                    aria-label={`Buka foto ${index + 1}`}
                  >
                    <img src={item.thumbnailSrc || item.src} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-4 p-4 sm:p-6">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">
                <ShieldCheck className="h-4 w-4" />
                Detail Dokumentasi
              </div>
              {current.caption && <p className="rounded-2xl bg-blue-50 p-3 text-sm font-medium leading-relaxed text-blue-900">{current.caption}</p>}
            </div>

            <div className="grid gap-2">
              {metaRows.map((row) => (
                <DetailRow key={row.label} label={row.label} value={row.value} />
              ))}
            </div>

            {current.notes && (
              <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
                <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  <FileText className="h-3.5 w-3.5" />
                  Catatan
                </div>
                <p className="text-sm leading-relaxed text-slate-700">{current.notes}</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-2 text-xs text-slate-500 sm:grid-cols-2 md:grid-cols-1">
              {current.uploadedAt && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  {formatDisplayDate(current.uploadedAt)}
                </div>
              )}
              {current.uploadedBy && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" />
                  {current.uploadedBy}
                </div>
              )}
              {current.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {current.location}
                </div>
              )}
            </div>

            {current.detailHref && (
              <Link
                href={current.detailHref}
                onClick={onClose}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
              >
                Buka Detail Modul
                <ExternalLink className="h-4 w-4" />
              </Link>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
