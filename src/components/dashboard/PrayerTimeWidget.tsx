'use client'

import { useEffect, useMemo, useState } from 'react'
import { Bell, BellRing, CalendarDays, CheckCircle, Clock, MapPin, RefreshCw } from 'lucide-react'

type PrayerKey = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha'

type PrayerTime = {
  key: PrayerKey
  label: string
  time: string
  date: Date
}

type PrayerApiResponse = {
  data?: {
    timings?: Partial<Record<PrayerKey, string>>
  }
}

const DUMAI_COORDINATE = {
  latitude: 1.6666,
  longitude: 101.4000,
}

const PRAYER_LABELS: Record<PrayerKey, string> = {
  Fajr: 'Subuh',
  Dhuhr: 'Dzuhur',
  Asr: 'Ashar',
  Maghrib: 'Maghrib',
  Isha: 'Isya',
}

const FALLBACK_TIMES: Record<PrayerKey, string> = {
  Fajr: '04:52',
  Dhuhr: '12:12',
  Asr: '15:36',
  Maghrib: '18:16',
  Isha: '19:28',
}

const dayFormatter = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Jakarta',
})

const timeFormatter = new Intl.DateTimeFormat('id-ID', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZone: 'Asia/Jakarta',
})

function getCleanTime(value?: string) {
  const match = value?.match(/\d{1,2}:\d{2}/)
  return match ? match[0].padStart(5, '0') : null
}

function buildPrayerDate(time: string, baseDate: Date, addDay = false) {
  const [hour, minute] = time.split(':').map(Number)
  const date = new Date(baseDate)
  date.setHours(hour, minute, 0, 0)
  if (addDay) date.setDate(date.getDate() + 1)
  return date
}

function formatDuration(ms: number) {
  const safeMs = Math.max(0, ms)
  const totalSeconds = Math.floor(safeMs / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function PrayerTimeWidget({ compact = false }: { compact?: boolean }) {
  const [now, setNow] = useState(() => new Date())
  const [timings, setTimings] = useState<Record<PrayerKey, string>>(FALLBACK_TIMES)
  const [source, setSource] = useState<'api' | 'fallback'>('fallback')
  const [loading, setLoading] = useState(false)
  const [notificationEnabled, setNotificationEnabled] = useState(false)

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    setNotificationEnabled(typeof Notification !== 'undefined' && Notification.permission === 'granted')
  }, [])

  const loadPrayerTimes = async () => {
    setLoading(true)
    try {
      const today = new Date()
      const date = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`
      const url = `https://api.aladhan.com/v1/timings/${date}?latitude=${DUMAI_COORDINATE.latitude}&longitude=${DUMAI_COORDINATE.longitude}&method=20`
      const response = await fetch(url, { cache: 'no-store' })
      if (!response.ok) throw new Error('Gagal memuat waktu salat')
      const payload = await response.json() as PrayerApiResponse
      const nextTimings = { ...FALLBACK_TIMES }

      Object.keys(PRAYER_LABELS).forEach((key) => {
        const prayerKey = key as PrayerKey
        const cleanTime = getCleanTime(payload.data?.timings?.[prayerKey])
        if (cleanTime) nextTimings[prayerKey] = cleanTime
      })

      setTimings(nextTimings)
      setSource('api')
    } catch {
      setTimings(FALLBACK_TIMES)
      setSource('fallback')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPrayerTimes()
  }, [])

  const prayers = useMemo<PrayerTime[]>(() => (
    (Object.keys(PRAYER_LABELS) as PrayerKey[]).map((key) => ({
      key,
      label: PRAYER_LABELS[key],
      time: timings[key],
      date: buildPrayerDate(timings[key], now),
    }))
  ), [now, timings])

  const nextPrayer = useMemo(() => {
    const upcoming = prayers.find((prayer) => prayer.date.getTime() > now.getTime())
    if (upcoming) return upcoming
    return {
      ...prayers[0],
      date: buildPrayerDate(prayers[0].time, now, true),
    }
  }, [now, prayers])

  const countdown = formatDuration(nextPrayer.date.getTime() - now.getTime())
  const notificationKey = `${nextPrayer.key}-${nextPrayer.date.toDateString()}`

  useEffect(() => {
    if (!notificationEnabled || typeof Notification === 'undefined') return
    const msToPrayer = nextPrayer.date.getTime() - now.getTime()
    if (msToPrayer > 1000 || msToPrayer < -30000) return

    const storedKey = window.localStorage.getItem('siaga-prayer-notification-key')
    if (storedKey === notificationKey) return

    new Notification(`Waktu Salat ${nextPrayer.label}`, {
      body: `Sudah masuk waktu ${nextPrayer.label} untuk wilayah Dumai.`,
      icon: '/brand/logo-siaga-sda.png',
      tag: notificationKey,
    })
    window.localStorage.setItem('siaga-prayer-notification-key', notificationKey)
  }, [nextPrayer, notificationEnabled, notificationKey, now])

  const requestNotification = async () => {
    if (typeof Notification === 'undefined') return
    const permission = await Notification.requestPermission()
    setNotificationEnabled(permission === 'granted')
  }

  return (
    <section className={`overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm ${compact ? 'p-4' : 'p-5'}`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#1976D2]">
            <Clock className="h-4 w-4" />
            Waktu & Pengingat Salat
          </div>
          <div className="mt-2 text-3xl font-extrabold tabular-nums text-slate-900 md:text-4xl">{timeFormatter.format(now)}</div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" />{dayFormatter.format(now)}</span>
            <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />Dumai, WIB</span>
          </div>
        </div>

        <div className="rounded-2xl bg-[#0D2C54] p-4 text-white lg:min-w-[280px]">
          <div className="text-xs font-semibold uppercase tracking-wide text-cyan-100">Salat Berikutnya</div>
          <div className="mt-1 flex items-end justify-between gap-3">
            <div>
              <div className="text-2xl font-extrabold">{nextPrayer.label}</div>
              <div className="text-sm text-blue-100">{nextPrayer.time} WIB</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-blue-100">Hitung mundur</div>
              <div className="text-xl font-black tabular-nums">{countdown}</div>
            </div>
          </div>
        </div>
      </div>

      <div className={`mt-4 grid gap-2 ${compact ? 'grid-cols-2 sm:grid-cols-5' : 'grid-cols-2 md:grid-cols-5'}`}>
        {prayers.map((prayer) => {
          const isNext = prayer.key === nextPrayer.key
          const isPast = prayer.date.getTime() < now.getTime()
          return (
            <div
              key={prayer.key}
              className={`rounded-xl border px-3 py-3 ${isNext ? 'border-[#1976D2] bg-blue-50' : isPast ? 'border-green-100 bg-green-50' : 'border-slate-100 bg-slate-50'}`}
            >
              <div className={`text-xs font-bold ${isNext ? 'text-[#0D2C54]' : 'text-slate-500'}`}>{prayer.label}</div>
              <div className="mt-1 text-lg font-extrabold tabular-nums text-slate-900">{prayer.time}</div>
              <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                {isPast ? <CheckCircle className="h-3 w-3 text-green-600" /> : <Clock className="h-3 w-3" />}
                {isNext ? 'Berikutnya' : isPast ? 'Sudah lewat' : 'Terjadwal'}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-slate-500">
          Sumber: {source === 'api' ? 'API jadwal salat online' : 'fallback lokal Dumai'}.
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={loadPrayerTimes}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Update
          </button>
          <button
            type="button"
            onClick={requestNotification}
            disabled={notificationEnabled}
            className={`inline-flex h-9 items-center justify-center gap-2 rounded-xl px-3 text-xs font-bold ${notificationEnabled ? 'bg-green-50 text-green-700' : 'bg-[#1976D2] text-white hover:bg-[#0D2C54]'}`}
          >
            {notificationEnabled ? <BellRing className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />}
            {notificationEnabled ? 'Pengingat Aktif' : 'Aktifkan Pengingat'}
          </button>
        </div>
      </div>
    </section>
  )
}

export default PrayerTimeWidget
