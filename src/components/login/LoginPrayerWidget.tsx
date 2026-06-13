'use client'

import { useEffect, useRef, useState } from 'react'
import { Info, MapPin, Moon, Sun, Sunrise, Sunset } from 'lucide-react'
import styles from './login.module.css'

const prayerTimes = [
  { name: 'Subuh', time: '05:03', status: 'Selesai', description: 'Waktu Subuh telah selesai.', Icon: Sunrise },
  { name: 'Zuhur', time: '12:20', status: 'Selesai', description: 'Waktu Zuhur telah selesai.', Icon: Sun },
  { name: 'Asar', time: '15:43', status: 'Selesai', description: 'Waktu Asar telah selesai.', Icon: Sunset },
  { name: 'Maghrib', time: '18:17', status: 'Berikutnya', description: 'Waktu sholat berikutnya setelah Asar 15:43.', Icon: Sunset },
  { name: 'Isyaa', time: '19:31', status: 'Belum Mulai', description: 'Waktu Isyaa dimulai setelah Maghrib.', Icon: Moon },
] as const

type PrayerName = (typeof prayerTimes)[number]['name']

export function LoginPrayerWidget() {
  const widgetRef = useRef<HTMLElement>(null)
  const activePrayer = prayerTimes.find((item) => item.status === 'Berikutnya') ?? prayerTimes[0]
  const [selectedName, setSelectedName] = useState<PrayerName | null>(null)
  const selected = prayerTimes.find((item) => item.name === selectedName)

  useEffect(() => {
    const closeDetail = (event: PointerEvent) => {
      if (!widgetRef.current?.contains(event.target as Node)) setSelectedName(null)
    }

    document.addEventListener('pointerdown', closeDetail)
    return () => document.removeEventListener('pointerdown', closeDetail)
  }, [])

  return (
    <section
      ref={widgetRef}
      className={`${styles.glass} ${styles.prayerCard} relative rounded-2xl text-white`}
      aria-labelledby="login-prayer-title"
      onMouseLeave={() => setSelectedName(null)}
    >
      <div className={styles.prayerHeader}>
        <div className="flex min-w-0 items-center gap-2.5">
          <MapPin className="h-5 w-5 flex-none text-cyan-200" />
          <div>
            <h2 id="login-prayer-title" className="text-[clamp(11px,1.2vw,15px)] font-black leading-tight">Dumai</h2>
            <p className="text-[clamp(8px,.75vw,10px)] text-slate-300">Waktu Sholat</p>
          </div>
        </div>
        <p className="truncate text-right text-[clamp(8px,.9vw,11px)] text-slate-200">
          Waktu berikutnya: <strong className="ml-1 text-cyan-300">{activePrayer.name} {activePrayer.time}</strong>
        </p>
      </div>

      <div className={styles.prayerGrid}>
        {prayerTimes.map((item) => {
          const isSelected = item.name === selectedName
          const isActive = item.name === activePrayer.name
          const Icon = item.Icon

          return (
            <button
              key={item.name}
              type="button"
              onMouseEnter={() => setSelectedName(item.name)}
              onClick={() => setSelectedName(item.name)}
              onFocus={() => setSelectedName(item.name)}
              onBlur={() => setSelectedName(null)}
              aria-label={`${item.name} pukul ${item.time}, ${item.status}`}
              aria-pressed={isSelected}
              className={`${styles.interactive} ${styles.prayerItem} ${isActive ? styles.prayerItemActive : ''} ${isSelected ? styles.prayerItemSelected : ''}`}
            >
              <Icon className={styles.prayerIcon} />
              <span className={styles.prayerName}>{item.name}</span>
              <strong className={styles.prayerTime}>{item.time}</strong>
              <span className={styles.prayerStatus}>{item.status}</span>
            </button>
          )
        })}
      </div>

      {selected && (
        <div className={styles.prayerPopover} aria-live="polite">
          <div className="flex items-center justify-between gap-3 font-black">
            <span>{selected.name}</span>
            <span className="text-cyan-300">{selected.time}</span>
          </div>
          <dl className="mt-1 space-y-0.5">
            <div className="flex justify-between gap-3"><dt className="text-slate-400">Status</dt><dd className="text-cyan-300">{selected.status}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-400">Lokasi</dt><dd>Dumai</dd></div>
          </dl>
          <p className={styles.prayerDescription}>{selected.description}</p>
        </div>
      )}

      <p className={`${styles.helperText} flex items-center gap-1 text-slate-400`}>
        <Info className="h-3 w-3 flex-none" />
        Klik, sentuh, arahkan pointer, atau fokuskan waktu untuk melihat detail.
      </p>
    </section>
  )
}
