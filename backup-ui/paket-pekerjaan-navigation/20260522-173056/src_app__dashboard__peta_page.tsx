'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ElementType } from 'react'
import Link from 'next/link'
import { useAppStore } from '@/store/useAppStore'
import { Topbar } from '@/components/layout/Topbar'
import { Proyek } from '@/types'
import { formatCurrency, getHealthBadge, getStatusLabel } from '@/lib/utils'
import {
  PROJECT_CATEGORIES,
  PROJECT_PACKAGE_TYPES,
  PROJECT_WORK_STAGES,
  filterProjectsByScope,
  getProjectBudgetYear,
  getProjectBudgetYears,
  getProjectCategoryLabel,
  getProjectPackageType,
  getProjectPackageTypeLabel,
  getProjectPrograms,
  getProjectSubKegiatan,
  getProjectWorkStage,
  getProjectWorkStageLabel,
} from '@/lib/reporting'
import {
  AlertTriangle,
  BriefcaseBusiness,
  Camera,
  Droplets,
  ExternalLink,
  Filter,
  Layers,
  LocateFixed,
  Mail,
  MapPin,
  MessageSquare,
  Search,
  Settings2,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Waves,
  X,
} from 'lucide-react'

type HealthFilter = 'all' | 'on_track' | 'warning' | 'kritis'
type LayerKey = 'paket' | 'survey' | 'asset' | 'operasional' | 'peil' | 'pasang_surut' | 'surat' | 'warning'

const statusColor: Record<Proyek['health'], string> = {
  on_track: '#16a34a',
  warning: '#f59e0b',
  kritis: '#dc2626',
}

const layerMeta: Array<{
  key: LayerKey
  label: string
  icon: ElementType
  color: string
}> = [
  { key: 'paket', label: 'Paket Pekerjaan', icon: BriefcaseBusiness, color: 'text-emerald-600' },
  { key: 'survey', label: 'Survey Investigasi', icon: Search, color: 'text-blue-600' },
  { key: 'asset', label: 'Asset SDA', icon: Droplets, color: 'text-cyan-600' },
  { key: 'operasional', label: 'Operasional SDA', icon: Settings2, color: 'text-sky-700' },
  { key: 'peil', label: 'Peil Banjir', icon: Waves, color: 'text-violet-600' },
  { key: 'pasang_surut', label: 'Pasang Surut', icon: Waves, color: 'text-teal-600' },
  { key: 'surat', label: 'Surat Masuk', icon: Mail, color: 'text-indigo-600' },
  { key: 'warning', label: 'Deviasi / Warning', icon: AlertTriangle, color: 'text-amber-600' },
]

export default function PetaPage() {
  const { projects } = useAppStore()
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMap = useRef<any>(null)
  const markersRef = useRef<Array<{ marker: any; project: Proyek }>>([])
  const [selected, setSelected] = useState<Proyek | null>(null)
  const [filter, setFilter] = useState<HealthFilter>('all')
  const [filterKategori, setFilterKategori] = useState('all')
  const [filterJenisProyek, setFilterJenisProyek] = useState('all')
  const [filterTahap, setFilterTahap] = useState('all')
  const [filterTahun, setFilterTahun] = useState('all')
  const [filterProgram, setFilterProgram] = useState('all')
  const [filterSubKegiatan, setFilterSubKegiatan] = useState('all')
  const [query, setQuery] = useState('')
  const [activeLayers, setActiveLayers] = useState<Record<LayerKey, boolean>>({
    paket: true,
    survey: true,
    asset: true,
    operasional: true,
    peil: true,
    pasang_surut: true,
    surat: true,
    warning: true,
  })
  const [mapReady, setMapReady] = useState(false)

  const budgetYears = getProjectBudgetYears(projects)
  const programs = getProjectPrograms(projects)
  const subKegiatanOptions = getProjectSubKegiatan(projects)

  const scopedProjects = useMemo(
    () => filterProjectsByScope(projects, filterKategori, filterJenisProyek, filterTahap, filterTahun, filterProgram, filterSubKegiatan),
    [projects, filterKategori, filterJenisProyek, filterTahap, filterTahun, filterProgram, filterSubKegiatan]
  )

  const visibleProjects = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return scopedProjects

    return scopedProjects.filter((project) => {
      const haystack = [
        project.nama,
        project.kode,
        project.lokasi,
        project.kecamatan,
        project.kontraktor,
        (project as any).program,
        (project as any).subKegiatan,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(keyword)
    })
  }, [query, scopedProjects])

  const filtered = useMemo(
    () => (filter === 'all' ? visibleProjects : visibleProjects.filter((p) => p.health === filter)),
    [filter, visibleProjects]
  )

  const stats = {
    total: filtered.length,
    onTrack: filtered.filter((p) => p.health === 'on_track').length,
    warning: filtered.filter((p) => p.health === 'warning').length,
    kritis: filtered.filter((p) => p.health === 'kritis').length,
    survey: filtered.reduce((sum, p) => sum + (p.surveys?.length || 0), 0),
    documents: filtered.reduce((sum, p) => sum + (((p as any).dokumen?.length || p.rabList?.length || 0)), 0),
  }

  const layerCounts: Record<LayerKey, number> = {
    paket: filtered.length,
    survey: stats.survey,
    asset: 0,
    operasional: filtered.length,
    peil: 0,
    pasang_surut: 0,
    surat: stats.documents,
    warning: stats.warning + stats.kritis,
  }

  const tideStatus = stats.kritis > 0 ? 'Kritis' : stats.warning > 0 ? 'Waspada' : 'Normal'
  const selectedBadge = selected ? getHealthBadge(selected.health) : null

  useEffect(() => {
    if (typeof window === 'undefined' || leafletMap.current || !mapRef.current) return

    const initMap = async () => {
      try {
        const L = (await import('leaflet')).default
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        })

        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link')
          link.id = 'leaflet-css'
          link.rel = 'stylesheet'
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          document.head.appendChild(link)
        }

        if (!mapRef.current || leafletMap.current) return

        const map = L.map(mapRef.current, {
          center: [1.67, 101.44],
          zoom: 12,
          zoomControl: false,
        })

        L.control.zoom({ position: 'topleft' }).addTo(map)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap',
          maxZoom: 19,
        }).addTo(map)

        leafletMap.current = map

        projects.forEach((project) => {
          const color = statusColor[project.health]
          const icon = L.divIcon({
            className: '',
            html: `<div style="
              position:relative;width:44px;height:44px;border-radius:18px;
              background:${color};border:4px solid white;
              box-shadow:0 12px 30px rgba(15,23,42,0.28);
              display:flex;align-items:center;justify-content:center;
              cursor:pointer;font-weight:800;font-size:11px;color:white;
            ">${project.progressFisik}%<span style="
              position:absolute;bottom:-6px;left:50%;transform:translateX(-50%) rotate(45deg);
              width:12px;height:12px;background:${color};border-right:3px solid white;border-bottom:3px solid white;
            "></span></div>`,
            iconSize: [44, 50],
            iconAnchor: [22, 48],
          })

          const marker = L.marker([project.koordinat.lat, project.koordinat.lng], { icon })
            .addTo(map)
            .on('click', () => setSelected(project))

          markersRef.current.push({ marker, project })
        })

        setTimeout(() => map.invalidateSize(), 250)
        setMapReady(true)
      } catch (err) {
        console.error('Map init error:', err)
      }
    }

    initMap()

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove()
        leafletMap.current = null
        markersRef.current = []
      }
    }
  }, [projects])

  useEffect(() => {
    if (!mapReady) return

    const keyword = query.trim().toLowerCase()

    markersRef.current.forEach(({ marker, project }) => {
      const matchHealth = filter === 'all' || project.health === filter
      const matchCategory = filterKategori === 'all' || (project as any).kategoriPekerjaan === filterKategori
      const matchPackageType = filterJenisProyek === 'all' || getProjectPackageType(project) === filterJenisProyek
      const matchWorkStage = filterTahap === 'all' || getProjectWorkStage(project) === filterTahap
      const matchYear = filterTahun === 'all' || String(getProjectBudgetYear(project)) === String(filterTahun)
      const matchProgram = filterProgram === 'all' || (project as any).program === filterProgram
      const matchSubKegiatan = filterSubKegiatan === 'all' || (project as any).subKegiatan === filterSubKegiatan
      const matchQuery = !keyword || [
        project.nama,
        project.kode,
        project.lokasi,
        project.kecamatan,
        project.kontraktor,
        (project as any).program,
        (project as any).subKegiatan,
      ].filter(Boolean).join(' ').toLowerCase().includes(keyword)
      const matchLayer = activeLayers.paket || (activeLayers.warning && project.health !== 'on_track')

      marker.setOpacity(
        matchHealth && matchCategory && matchPackageType && matchWorkStage && matchYear && matchProgram && matchSubKegiatan && matchQuery && matchLayer
          ? 1
          : 0.12
      )
    })
  }, [
    activeLayers,
    filter,
    filterKategori,
    filterJenisProyek,
    filterTahap,
    filterTahun,
    filterProgram,
    filterSubKegiatan,
    query,
    mapReady,
  ])

  const toggleLayer = (key: LayerKey) => {
    setActiveLayers((current) => ({ ...current, [key]: !current[key] }))
  }

  const focusSelectedLocation = () => {
    if (!selected || !leafletMap.current) return
    leafletMap.current.flyTo([selected.koordinat.lat, selected.koordinat.lng], 15, { duration: 0.8 })
  }

  return (
    <>
      <Topbar title="Peta Monitoring" subtitle="Pantau kondisi kegiatan, asset, dan informasi SDA Kota Dumai" />
      <div className="min-h-[calc(100vh-56px)] bg-[#f3f7fb] p-3 md:p-5">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="min-w-0 space-y-4">
            <div className="rounded-[22px] border border-white/70 bg-white/90 p-3 shadow-sm md:p-4">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {layerMeta.map((layer) => {
                  const Icon = layer.icon
                  const active = activeLayers[layer.key]
                  return (
                    <button
                      key={layer.key}
                      type="button"
                      onClick={() => toggleLayer(layer.key)}
                      className={`flex shrink-0 items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold transition md:px-4 ${
                        active
                          ? 'border-cyan-100 bg-white text-slate-800 shadow-[0_10px_24px_rgba(15,23,42,0.08)]'
                          : 'border-slate-200 bg-slate-50 text-slate-400'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${active ? layer.color : 'text-slate-300'}`} />
                      <span>{layer.label}</span>
                      <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                        {layerCounts[layer.key]}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="overflow-hidden rounded-[26px] border border-white bg-white shadow-[0_22px_60px_rgba(15,23,42,0.10)]">
              <div className="flex flex-col gap-3 border-b border-slate-100 bg-white/95 p-3 md:flex-row md:items-center md:p-4">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Cari lokasi, paket, asset, survey, atau surat..."
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap">
                  <select value={filterKategori} onChange={(event) => setFilterKategori(event.target.value)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700">
                    <option value="all">Semua Pengadaan</option>
                    {PROJECT_CATEGORIES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                  <select value={filterJenisProyek} onChange={(event) => setFilterJenisProyek(event.target.value)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700">
                    <option value="all">Semua Jenis</option>
                    {PROJECT_PACKAGE_TYPES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                  <select value={filterTahap} onChange={(event) => setFilterTahap(event.target.value)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700">
                    <option value="all">Semua Tahap</option>
                    {PROJECT_WORK_STAGES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                  <select value={filterTahun} onChange={(event) => setFilterTahun(event.target.value)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700">
                    <option value="all">Semua Tahun</option>
                    {budgetYears.map((year) => <option key={year} value={year}>{year}</option>)}
                  </select>
                  <button type="button" className="flex h-11 items-center justify-center gap-2 rounded-xl border border-cyan-100 bg-cyan-50 px-3 text-xs font-bold text-cyan-700">
                    <Filter className="h-4 w-4" />
                    Filter
                  </button>
                </div>
              </div>

              <div className="relative h-[62vh] min-h-[440px] md:h-[calc(100vh-315px)] md:min-h-[560px]">
                <div ref={mapRef} className="absolute inset-0 z-0" />

                <div className="pointer-events-none absolute left-3 top-3 z-[900] rounded-2xl border border-white/80 bg-white/90 p-3 shadow-lg backdrop-blur md:left-4 md:top-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <ShieldCheck className="h-4 w-4 text-cyan-600" />
                    Command Layer
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                    <span>Paket: <b className="text-slate-900">{stats.total}</b></span>
                    <span>Survey: <b className="text-slate-900">{stats.survey}</b></span>
                    <span>Warning: <b className="text-amber-600">{stats.warning}</b></span>
                    <span>Kritis: <b className="text-red-600">{stats.kritis}</b></span>
                  </div>
                </div>

                <div className="absolute right-3 top-3 z-[900] w-[min(270px,calc(100%-1.5rem))] rounded-2xl border border-cyan-100 bg-white/92 p-4 shadow-xl backdrop-blur md:right-4 md:top-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                      <Waves className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Pasang Surut Saat Ini</div>
                      <div className="text-[11px] text-slate-500">Pelabuhan Dumai</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <div>
                      <div className="text-2xl font-black text-slate-900">Belum ada data</div>
                      <div className="text-[11px] text-slate-500">Menunggu integrasi sensor/tabel</div>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-[11px] font-bold ${tideStatus === 'Normal' ? 'bg-emerald-50 text-emerald-700' : tideStatus === 'Waspada' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                      {tideStatus}
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3 z-[900] grid gap-3 md:grid-cols-[210px_minmax(0,1fr)_300px]">
                  <div className="rounded-2xl border border-white bg-white/94 p-3 shadow-lg backdrop-blur">
                    <div className="mb-2 text-xs font-black text-slate-900">Legenda</div>
                    <div className="grid grid-cols-2 gap-1.5 md:grid-cols-1">
                      {[
                        { color: '#16a34a', label: 'Aktif / Baik' },
                        { color: '#f59e0b', label: 'Waspada / Deviasi' },
                        { color: '#dc2626', label: 'Kritis' },
                        { color: '#94a3b8', label: 'Offline / Tidak aktif' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2 text-[11px] text-slate-600">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="hidden rounded-2xl border border-white bg-white/94 p-3 shadow-lg backdrop-blur md:block">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-xs font-black text-slate-900">Status Layer</div>
                      <div className="text-[11px] text-slate-400">Total item {stats.total + stats.survey + stats.documents}</div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-[11px]">
                      {layerMeta.slice(0, 8).map((layer) => (
                        <div key={layer.key} className="rounded-xl bg-slate-50 px-2 py-2">
                          <div className="font-bold text-slate-900">{layerCounts[layer.key]}</div>
                          <div className="truncate text-slate-500">{layer.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="hidden rounded-2xl border border-amber-100 bg-amber-50/95 p-3 shadow-lg backdrop-blur md:block">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-black text-slate-900">Peringatan SDA</div>
                        <div className="text-[11px] text-slate-500">Berdasarkan status proyek aktif</div>
                      </div>
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="mt-3 text-sm font-black text-slate-900">{stats.warning + stats.kritis} titik perlu perhatian</div>
                    <div className="mt-1 text-[11px] text-slate-500">Data peil/pasang surut belum terhubung ke sumber resmi.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {(['all', 'on_track', 'warning', 'kritis'] as const).map((item) => {
                const labels = { all: 'Semua', on_track: 'On Track', warning: 'Warning', kritis: 'Kritis' }
                const activeClass = {
                  all: 'border-slate-300 bg-slate-900 text-white',
                  on_track: 'border-emerald-200 bg-emerald-600 text-white',
                  warning: 'border-amber-200 bg-amber-500 text-white',
                  kritis: 'border-red-200 bg-red-600 text-white',
                }
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFilter(item)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold shadow-sm ${
                      filter === item ? activeClass[item] : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    {labels[item]}
                  </button>
                )
              })}
              <select value={filterProgram} onChange={(event) => setFilterProgram(event.target.value)} className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600">
                <option value="all">Semua Program</option>
                {programs.map((program) => <option key={program} value={program}>{program}</option>)}
              </select>
              <select value={filterSubKegiatan} onChange={(event) => setFilterSubKegiatan(event.target.value)} className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600">
                <option value="all">Semua Sub Kegiatan</option>
                {subKegiatanOptions.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
          </section>

          <aside className="hidden min-h-[calc(100vh-96px)] rounded-[26px] border border-white bg-white p-5 shadow-sm xl:block">
            {selected ? (
              <DetailPanel selected={selected} badge={selectedBadge} onClose={() => setSelected(null)} onFocus={focusSelectedLocation} />
            ) : (
              <EmptyDetail stats={stats} />
            )}
          </aside>
        </div>

        {selected && selectedBadge && (
          <div className="fixed inset-x-0 bottom-0 z-[1100] max-h-[72vh] overflow-y-auto rounded-t-[28px] border border-white bg-white p-4 shadow-[0_-18px_50px_rgba(15,23,42,0.20)] xl:hidden">
            <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-slate-300" />
            <DetailPanel selected={selected} badge={selectedBadge} onClose={() => setSelected(null)} onFocus={focusSelectedLocation} compact />
          </div>
        )}
      </div>
    </>
  )
}

function EmptyDetail({ stats }: { stats: { total: number; onTrack: number; warning: number; kritis: number } }) {
  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
          <Layers className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-xl font-black text-slate-900">Pilih marker lokasi</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Klik marker pada peta untuk melihat detail paket, koordinat, progress, deviasi, dokumen, dan akses lanjutan.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Total Paket', value: stats.total, color: 'bg-blue-50 text-blue-700' },
          { label: 'On Track', value: stats.onTrack, color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Warning', value: stats.warning, color: 'bg-amber-50 text-amber-700' },
          { label: 'Kritis', value: stats.kritis, color: 'bg-red-50 text-red-700' },
        ].map((item) => (
          <div key={item.label} className={`rounded-2xl p-4 ${item.color}`}>
            <div className="text-2xl font-black">{item.value}</div>
            <div className="text-xs font-semibold opacity-80">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DetailPanel({
  selected,
  badge,
  onClose,
  onFocus,
  compact = false,
}: {
  selected: Proyek
  badge: ReturnType<typeof getHealthBadge> | null
  onClose: () => void
  onFocus: () => void
  compact?: boolean
}) {
  const openIssues = selected.masalah.filter((item) => item.status === 'open').length

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <BriefcaseBusiness className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-black leading-tight text-slate-900">{selected.nama}</h2>
            <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{selected.lokasi}</span>
            </div>
          </div>
        </div>
        <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 p-2 text-slate-400 hover:text-slate-700">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {badge && (
          <span className={`rounded-full border px-2.5 py-1 text-[11px] font-black ${badge.bg} ${badge.text} ${badge.border}`}>
            {badge.label}
          </span>
        )}
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-black text-blue-700">
          {getProjectPackageTypeLabel(getProjectPackageType(selected))}
        </span>
        <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-[11px] font-black text-cyan-700">
          {getProjectWorkStageLabel(getProjectWorkStage(selected))}
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        <ProgressLine label="Progress Fisik" value={selected.progressFisik} color="bg-blue-600" />
        <ProgressLine label="Progress Keuangan" value={selected.progressKeuangan} color="bg-emerald-500" />
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Deviasi / Rencana</span>
            <span className={`flex items-center gap-1 text-sm font-black ${selected.deviasi < -10 ? 'text-red-600' : selected.deviasi < 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {selected.deviasi < 0 ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
              {selected.deviasi > 0 ? '+' : ''}{selected.deviasi}%
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-2 border-t border-slate-100 pt-4 text-sm">
        <InfoRow label="Jenis Data" value="Paket Pekerjaan" />
        <InfoRow label="Kategori" value={getProjectCategoryLabel((selected as any).kategoriPekerjaan)} />
        <InfoRow label="Kecamatan" value={selected.kecamatan} />
        <InfoRow label="Koordinat" value={`${selected.koordinat.lat.toFixed(5)}, ${selected.koordinat.lng.toFixed(5)}`} />
        <InfoRow label="Nilai Kontrak" value={formatCurrency(selected.anggaran)} />
        <InfoRow label="Kontraktor" value={selected.kontraktor || '-'} />
        <InfoRow label="Status" value={getStatusLabel(selected.status)} />
        <InfoRow label="Masalah Open" value={`${openIssues} masalah`} danger={openIssues > 0} />
        <InfoRow label="Dokumen" value={`${((selected as any).dokumen?.length || selected.rabList?.length || 0)} file`} />
        <InfoRow label="Survey" value={`${selected.surveys?.length || 0} data`} />
      </div>

      <div className={`mt-5 grid gap-2 ${compact ? 'grid-cols-1' : 'grid-cols-2'}`}>
        <button type="button" onClick={onFocus} className="flex items-center justify-center gap-2 rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm font-black text-cyan-700">
          <LocateFixed className="h-4 w-4" />
          Fokus Lokasi
        </button>
        <Link href={`/proyek/${selected.id}`} className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-200">
          Buka Detail
          <ExternalLink className="h-4 w-4" />
        </Link>
        <Link href={`/chat?proyek=${selected.id}`} className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700">
          <MessageSquare className="h-4 w-4" />
          Chat
        </Link>
        <Link href={`/laporan?proyek=${selected.id}`} className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700">
          <Camera className="h-4 w-4" />
          Laporan Foto
        </Link>
      </div>
    </div>
  )
}

function ProgressLine({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-xs">
        <span className="font-semibold text-slate-500">{label}</span>
        <span className="font-black text-slate-900">{value}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  )
}

function InfoRow({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-3">
      <span className="text-xs font-semibold text-slate-400">{label}</span>
      <span className={`min-w-0 text-right text-xs font-bold ${danger ? 'text-red-600' : 'text-slate-700'}`}>{value}</span>
    </div>
  )
}
