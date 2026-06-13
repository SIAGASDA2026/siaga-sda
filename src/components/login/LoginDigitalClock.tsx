'use client'

import { useEffect, useState } from 'react'
import styles from './login.module.css'

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

function formatTime(date: Date) {
  return [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((value) => String(value).padStart(2, '0'))
    .join(':')
}

export function LoginDigitalClock() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    const updateClock = () => setNow(new Date())
    updateClock()
    const interval = window.setInterval(updateClock, 1000)

    return () => window.clearInterval(interval)
  }, [])

  const time = now ? formatTime(now) : '--:--:--'
  const date = now ? dateFormatter.format(now) : 'Memuat waktu lokal...'

  return (
    <section className={styles.digitalClock} aria-label={`Waktu lokal ${time}, ${date}`} title="Waktu lokal perangkat">
      <time className={styles.digitalClockTime}>{time}</time>
      <span className={styles.digitalClockDate}>{date}</span>
    </section>
  )
}
