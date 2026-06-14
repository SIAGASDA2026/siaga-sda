import styles from './login.module.css'

type LoginBrandHeroProps = {
  logoPuSrc: string
  logoSrc: string
}

export function LoginBrandHero({ logoPuSrc, logoSrc }: LoginBrandHeroProps) {
  return (
    <section className={styles.brandHero}>
      <div className={`${styles.logoStage} mx-auto flex items-center justify-center`}>
        <img src={logoSrc} alt="Logo resmi SIAGA-SDA" className={styles.logoImage} />
      </div>

      <div className={styles.brandCopy}>
        <h1 className={`${styles.brandTitle} font-black leading-none tracking-tight text-white`}>
          SIAGA-SDA
        </h1>
        <p className="mt-1 text-[clamp(8px,1vw,14px)] font-black uppercase tracking-[0.3em] text-cyan-300">
          Command Center SDA
        </p>
        <div className="mt-1.5 h-0.5 w-14 rounded-full bg-cyan-300" />
        <p className={`${styles.brandSummary} mt-1.5 font-medium leading-snug text-slate-100`}>
          <span className={styles.brandSummaryLine}>SISTEM INFORMASI, ANALISIS, GERAK CEPAT DAN ADMINISTRASI</span>
          <span className={styles.brandSummaryLine}>SUMBER DAYA AIR</span>
          <span className={styles.brandSummaryMeta}>Data real-time untuk keputusan yang tepat dan terintegrasi.</span>
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
      </div>
    </section>
  )
}
