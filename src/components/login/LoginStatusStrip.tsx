import { Map, Radio, Waves, Wifi } from 'lucide-react'
import styles from './login.module.css'

const statusItems = [
  { title: 'Sistem Online', description: 'Semua layanan berjalan normal', Icon: Wifi },
  { title: 'Peta Aktif', description: 'Pembaruan wilayah real-time', Icon: Map },
  { title: 'Pasang Surut', description: 'Update setiap 15 menit', Icon: Waves },
] as const

export function LoginStatusStrip() {
  return (
    <section className={`${styles.glass} ${styles.statusStrip} overflow-hidden rounded-xl`} aria-label="Status sistem SIAGA-SDA">
      {statusItems.map(({ title, description, Icon }) => (
        <div key={title} className={`${styles.statusItem} flex items-center gap-1.5 border-l border-cyan-200/10 bg-white/[0.015] text-white first:border-l-0`}>
          <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full border border-cyan-200/40 text-cyan-300">
            <Icon className="h-3 w-3" />
          </span>
          <span className="min-w-0">
            <span className="flex items-center gap-1 truncate text-[clamp(8px,1vw,11px)] font-black leading-tight">
              {title}
              <Radio className="h-2.5 w-2.5 flex-none text-emerald-300" />
            </span>
            <span className={`${styles.statusDescription} mt-0.5 block truncate text-[9px] text-slate-300`}>{description}</span>
          </span>
        </div>
      ))}
    </section>
  )
}
