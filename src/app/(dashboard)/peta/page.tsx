'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ElementType } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useAppStore } from '@/store/useAppStore'
import { Topbar } from '@/components/layout/Topbar'
import { Proyek } from '@/types'
import { BRAND } from '@/lib/brand'
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
  ArrowLeft,
  Bell,
  BriefcaseBusiness,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Droplets,
  ExternalLink,
  Filter,
  Layers,
  LocateFixed,
  Mail,
  Maximize2,
  Navigation,
  MapPin,
  MessageSquare,
  RotateCcw,
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
  const { projects, currentUser } = useAppStore()
  const searchParams = useSearchParams()
  const targetProjectId = searchParams.get('proyek')
  const fromSource = searchParams.get('from')
  const fromPaket = fromSource === 'paket' || (!fromSource && searchParams.has('proyek'))
  const fromDashboard = fromSource === 'dashboard'
  const showBackButton = fromPaket || fromDashboard
  const backTarget = fromDashboard ? '/dashboard' : '/proyek'
  const backLabel = fromDashboard ? 'Kembali ke Dashboard' : 'Kembali ke Paket Pekerjaan'
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
  // Panel collapse states untuk mobile
  const [showLayerPanel, setShowLayerPanel] = useState(false)
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [showDetailPanel, setShowDetailPanel] = useState(false)

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
  const featuredProject = selected || filtered[0] || null
  const featuredBadge = featuredProject ? getHealthBadge(featuredProject.health) : null

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
            .on('click', () => {
              setSelected(project)
              setShowDetailPanel(true)
            })
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
        project.nama, project.kode, project.lokasi, project.kecamatan,
        project.kontraktor, (project as any).program, (project as any).subKegiatan,
      ].filter(Boolean).join(' ').toLowerCase().includes(keyword)
      const matchLayer = activeLayers.paket || (activeLayers.warning && project.health !== 'on_track')
      marker.setOpacity(
        matchHealth && matchCategory && matchPackageType && matchWorkStage && matchYear && matchProgram && matchSubKegiatan && matchQuery && matchLayer ? 1 : 0.12
      )
    })
  }, [activeLayers, filter, filterKategori, filterJenisProyek, filterTahap, filterTahun, filterProgram, filterSubKegiatan, query, mapReady])

  const toggleLayer = (key: LayerKey) => {
    setActiveLayers((current) => ({ ...current, [key]: !current[key] }))
  }

  const focusSelectedLocation = () => {
    if (!selected || !leafletMap.current) return
    leafletMap.current.flyTo([selected.koordinat.lat, selected.koordinat.lng], 15, { duration: 0.8 })
  }

  const resetFilters = () => {
    setQuery(''); setFilter('all'); setFilterKategori('all')
    setFilterJenisProyek('all'); setFilterTahap('all'); setFilterTahun('all')
    setFilterProgram('all'); setFilterSubKegiatan('all')
  }

  useEffect(() => {
    if (!mapReady || !targetProjectId || !leafletMap.current) return
    const target = projects.find((project) => project.id === targetProjectId)
    if (!target?.koordinat) return
    setSelected(target)
    setShowDetailPanel(true)
    leafletMap.current.flyTo([target.koordinat.lat, target.koordinat.lng], 15, { duration: 0.8 })
  }, [mapReady, projects, targetProjectId])

  return (
    <>
      <Topbar title="Peta Monitoring" subtitle="Pantau layer paket, survey, asset, pasang surut, dan warning SDA" />
      <div className="siaga-page-canvas min-h-[calc(100vh-64px)]">

        {/* Header Banner */}
        <section className="relative overflow-hidden bg-[#061d3b] px-4 py-4 text-white md:px-6 md:py-5">
          <div className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(circle_at_85%_10%,rgba(0,172,193,.24),transparent_32%),linear-gradient(135deg,rgba(13,44,84,.98),rgba(4,20,45,.98))]" />
          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white p-1.5 shadow-xl md:h-16 md:w-16">
                <img src={BRAND.logoPath} alt={`Logo ${BRAND.name}`} className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0">
                <div className="text-2xl font-black leading-none md:text-3xl">{BRAND.name}</div>
                <div className="mt-0.5 text-xs font-semibold text-blue-100 md:text-sm">{BRAND.fullName}</div>
                <div className="mt-1 inline-flex rounded-lg bg-blue-600 px-2 py-0.5 text-xs font-black">{BRAND.tagline}</div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur">
                <Bell className="h-5 w-5" />
                {(stats.warning + stats.kritis) > 0 && (
                  <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 text-[10px] font-black">
                    {Math.min(stats.warning + stats.kritis, 9)}
                  </span>
                )}
              </button>
              <div className="hidden items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 backdrop-blur md:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-black">
                  {currentUser?.name?.slice(0, 1) || 'A'}
                </div>
                <div>
                  <div className="text-sm font-black">{currentUser?.name || 'Admin SDA'}</div>
                  <div className="text-xs text-blue-100">{currentUser?.role || 'Administrator'}</div>
                </div>
              </div>
            </div>
          </div>
          {showBackButton && (
            <Link href={backTarget} className="relative z-10 mt-3 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-bold text-white backdrop-blur hover:bg-white/15">
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </Link>
          )}
        </section>

        {/* Konten utama */}
        <div className="p-3 md:p-4">

          {/* Stat Cards */}
          <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5 md:gap-3">
            <MapStatCard icon={MapPin} label="Total Titik Monitoring" value={stats.total + stats.survey + stats.documents} desc="Titik" tone="blue" href="/peta" />
            <MapStatCard icon={BriefcaseBusiness} label="Paket Aktif" value={stats.total} desc="Paket" tone="green" href="/proyek" />
            <MapStatCard icon={Search} label="Survey Aktif" value={stats.survey} desc="Lokasi" tone="blue" href="/survey" />
            <MapStatCard icon={AlertTriangle} label="Warning / Deviasi" value={stats.warning + stats.kritis} desc="Lokasi" tone="red" href="/masalah" />
            <MapStatCard icon={Droplets} label="Asset SDA" value={layerCounts.asset || 31} desc="Unit" tone="cyan" href="/asset" />
          </div>

          {/* Tab layer scroll horizontal (mobile) */}
          <div className="siaga-panel-canvas mb-3 p-3">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <div className="text-sm font-black text-slate-900">Layer Peta Aktif</div>
                <div className="text-xs text-slate-500">Pilih layer isi peta dan lihat jumlah titik.</div>
              </div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{filtered.length} titik</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {layerMeta.map((layer) => {
                const Icon = layer.icon
                const active = activeLayers[layer.key]
                return (
                  <button
                    key={layer.key}
                    type="button"
                    onClick={() => toggleLayer(layer.key)}
                    className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-black transition ${
                      active ? 'border-blue-600 bg-blue-600 text-white shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? 'text-white' : layer.color}`} />
                    <span>{layer.label.split(' ')[0]}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${active ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-500'}`}>{layerCounts[layer.key]}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Main grid: peta + sidebar */}
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">

            {/* Kolom Kiri: Peta */}
            <div className="min-w-0 space-y-3">

              {/* Filter bar di atas peta */}
              <div className="siaga-filter-canvas p-4">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-black text-slate-900">Filter dan Layer</div>
                <div className="text-xs text-slate-500">Tampilkan dan atur filter paket, program, tahun, dan layer peta.</div>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-xs font-black text-slate-600 hover:bg-slate-100"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Filter
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <select
                value={filterKategori}
                onChange={(e) => setFilterKategori(e.target.value)}
                className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700"
              >
                <option value="all">Semua Metode</option>
                {PROJECT_CATEGORIES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
              <select
                value={filterTahun}
                onChange={(e) => setFilterTahun(e.target.value)}
                className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700"
              >
                <option value="all">Semua Tahun</option>
                {budgetYears.map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
              <select
                value={filterProgram}
                onChange={(e) => setFilterProgram(e.target.value)}
                className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700"
              >
                <option value="all">Semua Program</option>
                {programs.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <select
                value={filterSubKegiatan}
                onChange={(e) => setFilterSubKegiatan(e.target.value)}
                className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700"
              >
                <option value="all">Semua Sub Kegiatan</option>
                {subKegiatanOptions.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
          </div>

              {/* Peta */}
              <div className="siaga-table-canvas">
                {/* Kontrol atas peta */}
                <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
                  <div className="flex items-center gap-2 text-sm font-black text-slate-700">
                    <Layers className="h-4 w-4 text-blue-600" />
                    Peta Monitoring
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Filter health */}
                    <div className="flex gap-1 overflow-x-auto">
                      {(['all', 'on_track', 'warning', 'kritis'] as const).map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setFilter(item)}
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-black transition ${filter === item ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                          {{ all: 'Semua', on_track: 'On Track', warning: 'Warning', kritis: 'Kritis' }[item]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Map container — tinggi responsif */}
                <div
                  ref={mapRef}
                  className="w-full"
                  style={{ height: 'clamp(320px, 50vh, 600px)' }}
                />

                {/* Legenda di bawah peta */}
                <div className="border-t border-slate-100 bg-slate-50 px-3 py-2">
                  <div className="mb-1.5 text-[10px] font-black uppercase tracking-wide text-slate-400">Legenda Peta</div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                    {layerMeta.map((layer) => {
                      const Icon = layer.icon
                      return (
                        <Link
                          key={layer.key}
                          href={
                            layer.key === 'paket' ? '/proyek' :
                            layer.key === 'survey' ? '/survey' :
                            layer.key === 'warning' ? '/masalah' :
                            layer.key === 'surat' ? '/surat' :
                            layer.key === 'asset' ? '/asset' : '/peta'
                          }
                          className="flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-xs font-semibold text-slate-600 hover:bg-white"
                        >
                          <Icon className={`h-3.5 w-3.5 ${layer.color}`} />
                          <span>{layer.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Ringkasan bawah */}
              <div className="grid gap-3 sm:grid-cols-2">
                <TideSummaryCard tideStatus={tideStatus} />
                <ActivitySummary projects={filtered} stats={stats} />
              </div>
            </div>

            {/* Kolom Kanan: Detail Panel */}
            <aside className="space-y-3">
              {/* Detail proyek */}
              <div className="siaga-panel-canvas p-4">
                {featuredProject && featuredBadge ? (
                  <DetailPanel
                    selected={featuredProject}
                    badge={featuredBadge}
                    onClose={() => setSelected(null)}
                    onFocus={focusSelectedLocation}
                  />
                ) : (
                  <EmptyDetail stats={stats} />
                )}
              </div>

              {/* Warning mini — hanya di sidebar desktop */}
              {(stats.warning + stats.kritis) > 0 && (
                <WarningMiniCard stats={stats} />
              )}
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}

function EmptyDetail({ stats }: { stats: { total: number; onTrack: number; warning: number; kritis: number } }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
          <Layers className="h-6 w-6" />
        </div>
        <h2 className="mt-3 text-lg font-black text-slate-900">Pilih marker lokasi</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          Klik marker pada peta untuk melihat detail paket, koordinat, progress, deviasi, dokumen, dan akses lanjutan.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Total Paket', value: stats.total, color: 'bg-blue-50 text-blue-700' },
          { label: 'On Track', value: stats.onTrack, color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Warning', value: stats.warning, color: 'bg-amber-50 text-amber-700' },
          { label: 'Kritis', value: stats.kritis, color: 'bg-red-50 text-red-700' },
        ].map((item) => (
          <div key={item.label} className={`rounded-2xl p-3 ${item.color}`}>
            <div className="text-2xl font-black">{item.value}</div>
            <div className="text-xs font-semibold opacity-80">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MapStatCard({
  icon: Icon, label, value, desc, tone, href,
}: {
  icon: ElementType; label: string; value: number; desc: string
  tone: 'blue' | 'green' | 'red' | 'cyan'; href: string
}) {
  const toneClass = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-emerald-50 text-emerald-700',
    red: 'bg-red-50 text-red-700',
    cyan: 'bg-cyan-50 text-cyan-700',
  }[tone]
  return (
    <Link href={href} className="siaga-card-interactive min-w-0 p-3">
      <div className="flex items-center gap-2 md:gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-[10px] font-black text-slate-500">{label}</div>
          <div className="text-xl font-black leading-tight text-blue-700">{value}</div>
          <div className="text-[11px] font-semibold text-slate-500">{desc}</div>
        </div>
      </div>
    </Link>
  )
}

function MapToolButton({ icon: Icon, label, onClick }: { icon: ElementType; label: string; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} title={label} className="flex h-12 w-12 items-center justify-center border-b border-slate-100 text-blue-700 last:border-b-0 hover:bg-blue-50">
      <Icon className="h-5 w-5" />
    </button>
  )
}

function TideSummaryCard({ tideStatus, compact = false }: { tideStatus: string; compact?: boolean }) {
  return (
    <section className="siaga-card-recommendation p-4">
      <div className="mb-3 flex items-center gap-2">
        <Waves className="h-5 w-5 text-blue-600" />
        <div className="text-sm font-black text-slate-900">Pasang Surut</div>
        <span className="text-[11px] text-slate-400">(Pantai Dumai)</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="siaga-card-compact siaga-card-info p-3">
          <TrendingUp className="mb-1 h-4 w-4 text-blue-700" />
          <div className="text-[10px] font-bold text-slate-600">Tertinggi</div>
          <div className="text-xl font-black text-blue-700">2.15 m</div>
          <div className="text-[10px] text-slate-500">08:45 WIB</div>
        </div>
        <div className="siaga-card-compact siaga-card-success p-3">
          <TrendingDown className="mb-1 h-4 w-4 text-emerald-700" />
          <div className="text-[10px] font-bold text-slate-600">Terendah</div>
          <div className="text-xl font-black text-emerald-700">0.35 m</div>
          <div className="text-[10px] text-slate-500">15:12 WIB</div>
        </div>
        <div className={`siaga-card-compact p-3 ${tideStatus === 'Normal' ? 'siaga-card-success' : tideStatus === 'Waspada' ? 'siaga-card-warning' : 'siaga-card-critical'}`}>
          <AlertTriangle className={`mb-1 h-4 w-4 ${tideStatus === 'Normal' ? 'text-emerald-700' : tideStatus === 'Waspada' ? 'text-amber-700' : 'text-red-700'}`} />
          <div className="text-[10px] font-bold text-slate-600">Status</div>
          <div className={`text-base font-black ${tideStatus === 'Normal' ? 'text-emerald-700' : tideStatus === 'Waspada' ? 'text-amber-700' : 'text-red-700'}`}>{tideStatus}</div>
        </div>
      </div>
    </section>
  )
}

function ActivitySummary({ projects, stats }: { projects: Proyek[]; stats: { warning: number; kritis: number } }) {
  const latest = projects.slice(0, 4)
  return (
    <section className="siaga-card-info p-4">
      <div className="mb-3 text-sm font-black text-slate-900">Aktivitas Terbaru</div>
      <div className="space-y-1.5">
        {latest.map((project, index) => (
          <Link key={project.id} href={`/proyek/${project.id}?from=peta`} className="siaga-card-interactive siaga-card-neutral flex items-center gap-3 p-2">
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white ${project.health === 'kritis' ? 'bg-red-500' : project.health === 'warning' ? 'bg-amber-500' : 'bg-blue-600'}`}>
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-black text-slate-800">{project.nama}</div>
              <div className="truncate text-[11px] text-slate-400">Fisik {project.progressFisik}% - {project.kecamatan}</div>
            </div>
          </Link>
        ))}
        {latest.length === 0 && (
          <div className="siaga-empty-canvas p-4 text-center text-sm text-slate-500">Belum ada aktivitas.</div>
        )}
      </div>
      <div className="siaga-card-compact siaga-card-warning mt-3 px-3 py-2 text-xs font-bold text-amber-800">
        Warning aktif: {stats.warning + stats.kritis} lokasi
      </div>
    </section>
  )
}

function WarningMiniCard({ stats }: { stats: { warning: number; kritis: number; survey: number } }) {
  return (
    <section className="siaga-card-warning p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-black text-slate-900">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          Warning Center
        </div>
        <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-black text-white">{stats.warning + stats.kritis}</span>
      </div>
      <div className="grid grid-cols-3 divide-x divide-slate-100 text-center">
        <div><div className="text-2xl font-black text-red-600">{stats.warning + stats.kritis}</div><div className="text-[11px] text-slate-500">Deviasi/Kritis</div></div>
        <div><div className="text-2xl font-black text-amber-600">{stats.warning}</div><div className="text-[11px] text-slate-500">Warning</div></div>
        <div><div className="text-2xl font-black text-blue-600">{stats.survey}</div><div className="text-[11px] text-slate-500">Survey</div></div>
      </div>
      <Link href="/masalah" className="siaga-card-interactive siaga-card-info mt-3 flex h-10 items-center justify-center gap-2 text-sm font-black text-blue-700">
        Lihat Semua Warning
        <ExternalLink className="h-4 w-4" />
      </Link>
    </section>
  )
}

function DetailPanel({
  selected, badge, onClose, onFocus, compact = false,
}: {
  selected: Proyek
  badge: ReturnType<typeof getHealthBadge> | null
  onClose: () => void
  onFocus: () => void
  compact?: boolean
}) {
  const openIssues = selected.masalah.filter((item) => item.status === 'open').length
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <BriefcaseBusiness className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-black leading-tight text-slate-900">{selected.nama}</h2>
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

      <div className="flex flex-wrap gap-2">
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

      <div className="space-y-3">
        <ProgressLine label="Progress Fisik" value={selected.progressFisik} color="bg-blue-600" />
        <ProgressLine label="Progress Keuangan" value={selected.progressKeuangan} color="bg-emerald-500" />
        <div className="siaga-card-compact siaga-card-warning p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Deviasi / Rencana</span>
            <span className={`flex items-center gap-1 text-sm font-black ${selected.deviasi < -10 ? 'text-red-600' : selected.deviasi < 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {selected.deviasi < 0 ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
              {selected.deviasi > 0 ? '+' : ''}{selected.deviasi}%
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2 border-t border-slate-100 pt-3 text-sm">
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

      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={onFocus} className="flex items-center justify-center gap-2 rounded-2xl border border-cyan-100 bg-cyan-50 px-3 py-2.5 text-sm font-black text-cyan-700">
          <LocateFixed className="h-4 w-4" />
          Fokus Lokasi
        </button>
        <Link href={`/proyek/${selected.id}`} className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-3 py-2.5 text-sm font-black text-white shadow-lg shadow-blue-200">
          Buka Detail
          <ExternalLink className="h-4 w-4" />
        </Link>
        <Link href={`/chat?proyek=${selected.id}`} className="siaga-card-interactive siaga-card-neutral flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-black text-slate-700">
          <MessageSquare className="h-4 w-4" />
          Chat
        </Link>
        <Link href={`/laporan?proyek=${selected.id}`} className="siaga-card-interactive siaga-card-neutral flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-black text-slate-700">
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
    <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-2">
      <span className="text-xs font-semibold text-slate-400">{label}</span>
      <span className={`min-w-0 text-right text-xs font-bold ${danger ? 'text-red-600' : 'text-slate-700'}`}>{value}</span>
    </div>
  )
}
