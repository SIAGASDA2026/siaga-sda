import { FileText } from 'lucide-react'
import styles from './login.module.css'

type LoginBrandHeroProps = {
  logoPuSrc: string
  logoSrc: string
}

const descriptions = [
  'Monitoring kegiatan dan progres pekerjaan Bidang Sumber Daya Air secara real-time.',
  'Mendukung survey investigasi, peta monitoring, paket pekerjaan, dan pelaporan terintegrasi.',
  'Mempercepat koordinasi, administrasi, dan pengambilan keputusan berbasis data.',
]

export function LoginBrandHero({ logoPuSrc, logoSrc }: LoginBrandHeroProps) {
  return (
    <section className={styles.brandHero}>
      <div className={styles.brandCopy}>
        <h1 className={`${styles.brandTitle} font-black leading-none tracking-tight text-white`}>
          SIAGA-SDA
        </h1>
        <p className="mt-1 text-[clamp(8px,1vw,14px)] font-black uppercase tracking-[0.3em] text-cyan-300">
          Command Center SDA
        </p>
        <div className="mt-1.5 h-0.5 w-14 rounded-full bg-cyan-300" />
        <p className={`${styles.brandSummary} mt-1.5 max-w-xl font-medium leading-snug text-slate-100`}>
          Sistem Informasi, Analisis, Gerak Cepat dan Administrasi Sumber Daya Air
        </p>

        <div className={styles.institutionIdentity}>
          <span className={styles.puLogoFrame}>
            <img src={logoPuSrc} alt="Logo PUPR" className={styles.puLogo} />
          </span>
          <p className={styles.institutionText}>
            <span>Dinas Pekerjaan Umum</span>
            <span>Bidang Sumber Daya Air</span>
            <span>Kota Dumai</span>
          </p>
        </div>

        <div className={`${styles.glass} ${styles.descriptionCard} rounded-xl`}>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-300/25">
              <FileText className="h-3.5 w-3.5" />
            </span>
            <h2 className="text-[clamp(10px,1.2vw,13px)] font-black text-white">Deskripsi Aplikasi</h2>
          </div>
          <p className={`${styles.mobileShort} mt-1 text-[9px] leading-tight text-slate-200`}>
            Monitoring SDA, survey, peta, paket pekerjaan, dan pelaporan terintegrasi.
          </p>
          <ul className={`${styles.descriptionList} mt-1.5 space-y-1 text-[clamp(9px,1vw,11px)] leading-snug text-slate-200`}>
            {descriptions.map((description) => (
              <li key={description} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.9)]" />
                <span>{description}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`${styles.logoStage} mx-auto flex items-center justify-center overflow-hidden`}>
        <img src={logoSrc} alt="Logo resmi SIAGA-SDA" className={styles.logoImage} />
      </div>
    </section>
  )
}
