'use client'

import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, ArrowDown, ArrowUp, Waves } from 'lucide-react'
import styles from './login.module.css'

const tideData = [
  { time: '06:00', level: 0.42, phase: 'Surut', status: 'Normal', trend: 'down', x: 8, y: 76 },
  { time: '09:00', level: 0.55, phase: 'Naik', status: 'Normal', trend: 'up', x: 29, y: 67 },
  { time: '12:00', level: 1.05, phase: 'Naik', status: 'Siaga', trend: 'up', x: 50, y: 42 },
  { time: '15:00', level: 1.35, phase: 'Puncak', status: 'Waspada', trend: 'up', x: 71, y: 20 },
  { time: '18:00', level: 0.72, phase: 'Turun', status: 'Normal', trend: 'down', x: 92, y: 58 },
] as const

function statusTone(status: string) {
  if (status === 'Waspada') return 'text-red-300'
  if (status === 'Siaga') return 'text-amber-300'
  return 'text-emerald-300'
}

export function LoginTideWidget() {
  const widgetRef = useRef<HTMLElement>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const selected = tideData.find((item) => item.time === selectedTime)
  const peak = tideData[3]
  const points = tideData.map((item) => `${item.x},${item.y}`).join(' ')

  useEffect(() => {
    const closeDetail = (event: PointerEvent) => {
      if (!widgetRef.current?.contains(event.target as Node)) setSelectedTime(null)
    }

    document.addEventListener('pointerdown', closeDetail)
    return () => document.removeEventListener('pointerdown', closeDetail)
  }, [])

  return (
    <section
      ref={widgetRef}
      className={`${styles.glass} ${styles.tideCard} rounded-xl text-white`}
      aria-labelledby="login-tide-title"
      onMouseLeave={() => setSelectedTime(null)}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-cyan-300 text-[#03234b]">
            <Waves className="h-3.5 w-3.5" />
          </span>
          <h2 id="login-tide-title" className="truncate text-[clamp(10px,1.2vw,13px)] font-black">Pasang Surut Hari Ini</h2>
        </div>
        <span className="inline-flex flex-none items-center gap-1 rounded-full border border-red-400/70 px-2 py-0.5 text-[9px] font-bold text-red-300">
          <AlertTriangle className="h-3 w-3" />
          Waspada
        </span>
      </div>

      <div className="mt-1.5 grid min-h-0 gap-2 md:grid-cols-[80px_minmax(0,1fr)]">
        <div className={`${styles.desktopOnly} rounded-lg border border-cyan-200/20 bg-cyan-300/5 p-2`}>
          <p className="text-[9px] text-slate-300">Puncak</p>
          <p className="text-base font-black">{peak.time}</p>
          <p className="text-xs font-black text-cyan-300">{peak.level.toFixed(2)} m</p>
        </div>

        <div className="min-w-0">
          <div className={`${styles.tideChart} relative rounded-lg border border-cyan-200/10 bg-[#031a37]/70 px-1 py-1`} aria-label="Grafik interaktif pasang surut">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
              {[20, 40, 60, 80].map((y) => (
                <line key={y} x1="2" x2="98" y1={y} y2={y} stroke="rgba(148, 210, 255, .14)" strokeWidth=".5" />
              ))}
              <polyline points={points} fill="none" stroke="#31d8ff" strokeWidth="1.6" className={styles.chartGlow} />
              {selected && (
                <line x1={selected.x} x2={selected.x} y1="8" y2="92" stroke="rgba(251, 113, 133, .65)" strokeDasharray="3 3" strokeWidth=".7" />
              )}
            </svg>
            {tideData.map((item) => {
              const isSelected = item.time === selectedTime
              return (
                <button
                  key={item.time}
                  type="button"
                  onMouseEnter={() => setSelectedTime(item.time)}
                  onClick={() => setSelectedTime(item.time)}
                  onFocus={() => setSelectedTime(item.time)}
                  onBlur={() => setSelectedTime(null)}
                  aria-label={`${item.time}, tinggi ${item.level.toFixed(2)} meter, fase ${item.phase}, status ${item.status}`}
                  aria-pressed={isSelected}
                  className={`absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white outline-none transition focus:ring-2 focus:ring-cyan-300/30 ${isSelected ? 'scale-125 bg-red-400 shadow-[0_0_10px_rgba(248,113,113,1)]' : 'bg-cyan-400 shadow-[0_0_7px_rgba(34,211,238,.8)]'}`}
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                />
              )
            })}
            {selected && (
              <div className={styles.tidePopover} aria-live="polite">
                <div className="flex items-center justify-between gap-2 font-black">
                  <span>{selected.time}</span>
                  <span className={statusTone(selected.status)}>{selected.status}</span>
                </div>
                <div className="text-slate-300">Tinggi <span className="float-right text-white">{selected.level.toFixed(2)} m</span></div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`${styles.tideTable} mt-1.5 rounded-lg border border-cyan-200/15`}>
        <table className="w-full table-fixed text-left text-[clamp(7px,0.8vw,10px)]">
          <thead className="bg-cyan-300/10 text-slate-300">
            <tr>
              <th className="px-1.5 py-1 font-medium">Waktu</th>
              <th className="px-1.5 py-1 font-medium">Tinggi</th>
              <th className="px-1.5 py-1 font-medium">Fase</th>
              <th className="px-1.5 py-1 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {tideData.map((item) => {
              const TrendIcon = item.trend === 'up' ? ArrowUp : ArrowDown
              const isSelected = item.time === selectedTime
              return (
                <tr
                  key={item.time}
                  tabIndex={0}
                  role="button"
                  aria-label={`Lihat detail pasang surut pukul ${item.time}`}
                  aria-selected={isSelected}
                  onClick={() => setSelectedTime(item.time)}
                  onMouseEnter={() => setSelectedTime(item.time)}
                  onFocus={() => setSelectedTime(item.time)}
                  onBlur={() => setSelectedTime(null)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') setSelectedTime(item.time)
                  }}
                  className={`cursor-pointer border-t border-cyan-200/10 outline-none transition hover:bg-cyan-300/10 focus:bg-cyan-300/10 ${isSelected ? 'bg-red-400/15' : ''}`}
                >
                  <td className="px-1.5 py-[clamp(2px,.45vh,5px)] font-bold">{item.time}</td>
                  <td className="px-1.5 py-[clamp(2px,.45vh,5px)]">
                    <span>{item.level.toFixed(2)}</span>
                    <TrendIcon className={`ml-1 inline h-2.5 w-2.5 ${item.trend === 'up' ? 'text-emerald-300' : 'text-red-300'}`} />
                  </td>
                  <td className="truncate px-1.5 py-[clamp(2px,.45vh,5px)]">{item.phase}</td>
                  <td className={`truncate px-1.5 py-[clamp(2px,.45vh,5px)] font-bold ${statusTone(item.status)}`}>{item.status}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
