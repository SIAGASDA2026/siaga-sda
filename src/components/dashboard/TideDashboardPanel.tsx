'use client'

import { useEffect, useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { AlertTriangle, ArrowDown, ArrowUp, Clock, Database, MapPin, RefreshCw, ShieldAlert, Waves } from 'lucide-react'

type TideWarningStatus = 'AMAN' | 'WASPADA' | 'SIAGA' | 'KRITIS'
type TideTrend = 'AIR_NAIK' | 'AIR_TURUN' | 'STABIL'

type TidePoint = {
  id: string
  time: string
  observedAt: string
  waterLevel: number
  predictedLevel: number
  tideStatus: 'Pasang' | 'Surut'
  trendStatus: TideTrend
  warningStatus: TideWarningStatus
  source: string
}

const TIDE_STATION = {
  code: 'PST-DMI-01',
  name: 'Stasiun Pasut Dumai',
  location: 'Pantai Dumai',
  latitude: 1.6789,
  longitude: 101.4450,
  source: 'Cache internal SIAGA-SDA',
}

const TIDE_THRESHOLDS = {
  warning: 0.8,
  alert: 1.2,
  critical: 1.8,
}

const TIDE_POINTS: TidePoint[] = [
  { id: 't-01', time: '07:00', observedAt: '07:00 WIB', waterLevel: 0.62, predictedLevel: 0.68, tideStatus: 'Surut', trendStatus: 'AIR_NAIK', warningStatus: 'AMAN', source: 'Prediksi cache' },
  { id: 't-02', time: '08:00', observedAt: '08:00 WIB', waterLevel: 0.74, predictedLevel: 0.78, tideStatus: 'Pasang', trendStatus: 'AIR_NAIK', warningStatus: 'AMAN', source: 'Prediksi cache' },
  { id: 't-03', time: '09:00', observedAt: '09:00 WIB', waterLevel: 0.91, predictedLevel: 0.94, tideStatus: 'Pasang', trendStatus: 'AIR_NAIK', warningStatus: 'WASPADA', source: 'Prediksi cache' },
  { id: 't-04', time: '10:00', observedAt: '10:00 WIB', waterLevel: 1.08, predictedLevel: 1.12, tideStatus: 'Pasang', trendStatus: 'AIR_NAIK', warningStatus: 'WASPADA', source: 'Prediksi cache' },
  { id: 't-05', time: '11:00', observedAt: '11:00 WIB', waterLevel: 1.24, predictedLevel: 1.27, tideStatus: 'Pasang', trendStatus: 'AIR_NAIK', warningStatus: 'SIAGA', source: 'Prediksi cache' },
  { id: 't-06', time: '12:00', observedAt: '12:00 WIB', waterLevel: 1.36, predictedLevel: 1.42, tideStatus: 'Pasang', trendStatus: 'AIR_NAIK', warningStatus: 'SIAGA', source: 'Prediksi cache' },
  { id: 't-07', time: '13:00', observedAt: '13:00 WIB', waterLevel: 1.48, predictedLevel: 1.52, tideStatus: 'Pasang', trendStatus: 'AIR_NAIK', warningStatus: 'SIAGA', source: 'Prediksi cache' },
  { id: 't-08', time: '14:00', observedAt: '14:00 WIB', waterLevel: 1.58, predictedLevel: 1.61, tideStatus: 'Pasang', trendStatus: 'AIR_NAIK', warningStatus: 'SIAGA', source: 'Prediksi cache' },
  { id: 't-09', time: '15:00', observedAt: '15:00 WIB', waterLevel: 1.71, predictedLevel: 1.74, tideStatus: 'Pasang', trendStatus: 'AIR_NAIK', warningStatus: 'SIAGA', source: 'Prediksi cache' },
  { id: 't-10', time: '16:00', observedAt: '16:00 WIB', waterLevel: 1.84, predictedLevel: 1.86, tideStatus: 'Pasang', trendStatus: 'AIR_NAIK', warningStatus: 'KRITIS', source: 'Prediksi cache' },
  { id: 't-11', time: '17:00', observedAt: '17:00 WIB', waterLevel: 1.76, predictedLevel: 1.80, tideStatus: 'Surut', trendStatus: 'AIR_TURUN', warningStatus: 'SIAGA', source: 'Prediksi cache' },
  { id: 't-12', time: '18:00', observedAt: '18:00 WIB', waterLevel: 1.42, predictedLevel: 1.46, tideStatus: 'Surut', trendStatus: 'AIR_TURUN', warningStatus: 'SIAGA', source: 'Prediksi cache' },
  { id: 't-13', time: '19:00', observedAt: '19:00 WIB', waterLevel: 1.04, predictedLevel: 1.08, tideStatus: 'Surut', trendStatus: 'AIR_TURUN', warningStatus: 'WASPADA', source: 'Prediksi cache' },
]

const statusStyle: Record<TideWarningStatus, { bg: string; text: string; border: string; dot: string }> = {
  AMAN: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100', dot: 'bg-green-500' },
  WASPADA: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', dot: 'bg-amber-500' },
  SIAGA: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100', dot: 'bg-orange-500' },
  KRITIS: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100', dot: 'bg-red-500' },
}

function getWarningStatus(level: number): TideWarningStatus {
  if (level >= TIDE_THRESHOLDS.critical) return 'KRITIS'
  if (level >= TIDE_THRESHOLDS.alert) return 'SIAGA'
  if (level >= TIDE_THRESHOLDS.warning) return 'WASPADA'
  return 'AMAN'
}

function getTrend(current: number, previous: number): TideTrend {
  const diff = current - previous
  if (Math.abs(diff) <= 0.03) return 'STABIL'
  return diff > 0 ? 'AIR_NAIK' : 'AIR_TURUN'
}

function formatCountdown(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function buildTodayDate(time: string, now: Date) {
  const [hour, minute] = time.split(':').map(Number)
  const date = new Date(now)
  date.setHours(hour, minute, 0, 0)
  return date
}

export function TideDashboardPanel({ compact = false }: { compact?: boolean }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(intervalId)
  }, [])

  const data = useMemo(() => TIDE_POINTS.map((point, index) => {
    const previous = TIDE_POINTS[Math.max(index - 1, 0)]
    const trendStatus = index === 0 ? point.trendStatus : getTrend(point.waterLevel, previous.waterLevel)
    return {
      ...point,
      trendStatus,
      warningStatus: getWarningStatus(point.waterLevel),
    }
  }), [])

  const currentPoint = data[5]
  const peakPoint = data.reduce((max, point) => point.predictedLevel > max.predictedLevel ? point : max, data[0])
  const lowPoint = data.reduce((min, point) => point.predictedLevel < min.predictedLevel ? point : min, data[0])
  const targetPoint = currentPoint.trendStatus === 'AIR_TURUN' ? lowPoint : peakPoint
  let targetDate = buildTodayDate(targetPoint.time, now)
  if (targetDate.getTime() < now.getTime()) {
    targetDate = new Date(targetDate.getTime() + 24 * 60 * 60 * 1000)
  }
  const countdown = formatCountdown(targetDate.getTime() - now.getTime())
  const style = statusStyle[currentPoint.warningStatus]
  const oneHourDiff = currentPoint.waterLevel - data[4].waterLevel
  const warningMessage = currentPoint.warningStatus === 'KRITIS'
    ? `Air laut berada pada level kritis ${currentPoint.waterLevel.toFixed(2)} m. Aktifkan pemantauan pintu air dan rumah pompa.`
    : currentPoint.warningStatus === 'SIAGA'
      ? `Air laut masuk status siaga ${currentPoint.waterLevel.toFixed(2)} m dan menuju puncak ${peakPoint.predictedLevel.toFixed(2)} m.`
      : currentPoint.warningStatus === 'WASPADA'
        ? `Air laut melewati ambang waspada. Pantau wilayah rawan rob dan saluran outfall.`
        : 'Kondisi pasang surut masih aman berdasarkan ambang aktif.'

  if (compact) {
    return (
      <section className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#00ACC1]">
              <Waves className="h-4 w-4" />
              Pasang Surut Air Laut
            </div>
            <div className="mt-2 flex flex-wrap items-end gap-3">
              <div className="text-3xl font-black tabular-nums text-slate-900">+{currentPoint.waterLevel.toFixed(2)} m</div>
              <span className={`mb-1 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-extrabold ${style.bg} ${style.text} ${style.border}`}>
                <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                {currentPoint.warningStatus}
              </span>
            </div>
            <div className="mt-1 text-xs text-slate-500">{TIDE_STATION.name} - update {currentPoint.observedAt}</div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:min-w-[320px]">
            <div className="rounded-xl bg-white p-3">
              <div className="text-[10px] font-bold uppercase text-slate-400">Tren</div>
              <div className="mt-1 flex items-center gap-1 text-sm font-extrabold text-[#0D2C54]">
                {currentPoint.trendStatus === 'AIR_NAIK' ? <ArrowUp className="h-4 w-4 text-red-600" /> : <ArrowDown className="h-4 w-4 text-green-600" />}
                {currentPoint.trendStatus.replace('_', ' ')}
              </div>
            </div>
            <div className="rounded-xl bg-white p-3">
              <div className="text-[10px] font-bold uppercase text-slate-400">Menuju Puncak</div>
              <div className="mt-1 text-sm font-extrabold tabular-nums text-[#0D2C54]">{countdown}</div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#00ACC1]">
              <Waves className="h-4 w-4" />
              Pasang Surut Air Laut
            </div>
            <h3 className="mt-2 text-2xl font-black text-slate-900">{TIDE_STATION.name}</h3>
            <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{TIDE_STATION.location}</span>
              <span className="inline-flex items-center gap-1"><Database className="h-3.5 w-3.5" />{TIDE_STATION.source}</span>
              <span>Kode {TIDE_STATION.code}</span>
            </div>
          </div>

          <div className={`rounded-2xl border px-4 py-3 ${style.bg} ${style.border}`}>
            <div className="text-xs font-bold uppercase text-slate-500">Status Saat Ini</div>
            <div className={`mt-1 text-2xl font-black ${style.text}`}>{currentPoint.warningStatus}</div>
            <div className="mt-1 text-sm text-slate-600">+{currentPoint.waterLevel.toFixed(2)} m pada {currentPoint.observedAt}</div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <MetricCard label="Tinggi Muka Air" value={`+${currentPoint.waterLevel.toFixed(2)} m`} desc="Observasi terakhir" />
          <MetricCard label="Tren 1 Jam" value={`${oneHourDiff >= 0 ? '+' : ''}${oneHourDiff.toFixed(2)} m`} desc={currentPoint.trendStatus.replace('_', ' ')} tone={currentPoint.trendStatus === 'AIR_NAIK' ? 'red' : 'green'} />
          <MetricCard label="Pasang Tertinggi" value={`+${peakPoint.predictedLevel.toFixed(2)} m`} desc={`${peakPoint.time} WIB`} tone="blue" />
          <MetricCard label="Surut Terendah" value={`+${lowPoint.predictedLevel.toFixed(2)} m`} desc={`${lowPoint.time} WIB`} tone="slate" />
        </div>

        <div className="mt-4 rounded-2xl bg-[#0D2C54] p-4 text-white">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-cyan-100">
                {currentPoint.trendStatus === 'AIR_TURUN' ? 'Menuju Surut Terendah' : 'Menuju Pasang Tertinggi'}
              </div>
              <div className="mt-1 text-3xl font-black tabular-nums">{countdown}</div>
            </div>
            <div className="max-w-2xl rounded-xl bg-white/10 p-3 text-sm leading-relaxed text-blue-50">
              <div className="mb-1 flex items-center gap-2 font-bold text-white">
                {currentPoint.warningStatus === 'AMAN' ? <Clock className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
                Warning System
              </div>
              {warningMessage}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm xl:col-span-3">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-extrabold text-slate-900">Grafik Pasang Surut 12 Jam</div>
              <div className="text-xs text-slate-500">Ringan untuk dashboard, detail 24 jam/7 hari disiapkan pada tahap database.</div>
            </div>
            <div className="flex flex-wrap gap-2 text-[10px] font-bold">
              <ThresholdBadge label="Waspada" value={TIDE_THRESHOLDS.warning} color="bg-amber-100 text-amber-700" />
              <ThresholdBadge label="Siaga" value={TIDE_THRESHOLDS.alert} color="bg-orange-100 text-orange-700" />
              <ThresholdBadge label="Kritis" value={TIDE_THRESHOLDS.critical} color="bg-red-100 text-red-700" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="tideLevel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ACC1" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#00ACC1" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 2.1]} tickFormatter={(value) => `${value}m`} />
              <Tooltip formatter={(value: number, name: string) => [`+${Number(value).toFixed(2)} m`, name === 'waterLevel' ? 'Observasi' : 'Prediksi']} />
              <ReferenceLine y={TIDE_THRESHOLDS.warning} stroke="#FFB300" strokeDasharray="4 4" />
              <ReferenceLine y={TIDE_THRESHOLDS.alert} stroke="#F97316" strokeDasharray="4 4" />
              <ReferenceLine y={TIDE_THRESHOLDS.critical} stroke="#E53935" strokeDasharray="4 4" />
              <Area type="monotone" dataKey="waterLevel" stroke="#00ACC1" strokeWidth={3} fill="url(#tideLevel)" />
              <Area type="monotone" dataKey="predictedLevel" stroke="#1976D2" strokeWidth={2} strokeDasharray="4 3" fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-extrabold text-slate-900">Tabel Observasi & Prediksi</div>
              <div className="text-xs text-slate-500">Mobile akan tampil sebagai list.</div>
            </div>
            <RefreshCw className="h-4 w-4 text-slate-300" />
          </div>

          <div className="hidden overflow-hidden rounded-xl border border-slate-100 md:block">
            <table className="w-full text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left font-bold text-slate-500">Waktu</th>
                  <th className="px-3 py-2 text-right font-bold text-slate-500">Level</th>
                  <th className="px-3 py-2 text-left font-bold text-slate-500">Status</th>
                  <th className="px-3 py-2 text-left font-bold text-slate-500">Tren</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.slice(2, 11).map((point) => <TideTableRow key={point.id} point={point} />)}
              </tbody>
            </table>
          </div>

          <div className="space-y-2 md:hidden">
            {data.slice(2, 11).map((point) => {
              const pointStyle = statusStyle[point.warningStatus]
              return (
                <div key={point.id} className="rounded-xl border border-slate-100 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-extrabold text-slate-900">{point.time} WIB</div>
                      <div className="text-xs text-slate-500">{point.tideStatus} - {point.trendStatus.replace('_', ' ')}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-slate-900">+{point.waterLevel.toFixed(2)} m</div>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${pointStyle.bg} ${pointStyle.text} ${pointStyle.border}`}>{point.warningStatus}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function MetricCard({ label, value, desc, tone = 'slate' }: { label: string; value: string; desc: string; tone?: 'slate' | 'blue' | 'green' | 'red' }) {
  const toneClass = {
    slate: 'text-slate-900 bg-slate-50',
    blue: 'text-blue-800 bg-blue-50',
    green: 'text-green-800 bg-green-50',
    red: 'text-red-800 bg-red-50',
  }[tone]
  return (
    <div className={`rounded-xl p-3 ${toneClass}`}>
      <div className="text-[10px] font-bold uppercase tracking-wide opacity-70">{label}</div>
      <div className="mt-1 text-xl font-black tabular-nums">{value}</div>
      <div className="mt-0.5 text-xs opacity-70">{desc}</div>
    </div>
  )
}

function ThresholdBadge({ label, value, color }: { label: string; value: number; color: string }) {
  return <span className={`rounded-full px-2 py-1 ${color}`}>{label} +{value.toFixed(2)}m</span>
}

function TideTableRow({ point }: { point: TidePoint }) {
  const pointStyle = statusStyle[point.warningStatus]
  return (
    <tr className="hover:bg-slate-50">
      <td className="px-3 py-2 font-bold text-slate-800">{point.time}</td>
      <td className="px-3 py-2 text-right font-black text-slate-900">+{point.waterLevel.toFixed(2)} m</td>
      <td className="px-3 py-2">
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${pointStyle.bg} ${pointStyle.text} ${pointStyle.border}`}>{point.warningStatus}</span>
      </td>
      <td className="px-3 py-2 text-slate-500">
        <span className="inline-flex items-center gap-1">
          {point.trendStatus === 'AIR_NAIK' ? <ArrowUp className="h-3 w-3 text-red-600" /> : point.trendStatus === 'AIR_TURUN' ? <ArrowDown className="h-3 w-3 text-green-600" /> : <AlertTriangle className="h-3 w-3 text-amber-600" />}
          {point.trendStatus.replace('_', ' ')}
        </span>
      </td>
    </tr>
  )
}

export default TideDashboardPanel
