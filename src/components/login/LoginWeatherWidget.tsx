'use client'

import { useEffect, useState } from 'react'
import styles from './login.module.css'

const WEATHER_REFRESH_INTERVAL = 15 * 60 * 1000

const dumaiWeatherPreview = {
  location: 'Dumai',
  condition: 'Berawan',
  temperature: 28,
  rainChance: 35,
  windSpeed: 12,
}

export function LoginWeatherWidget() {
  const [weatherSummary, setWeatherSummary] = useState(() => ({ ...dumaiWeatherPreview }))

  useEffect(() => {
    const refreshWeather = () => setWeatherSummary({ ...dumaiWeatherPreview })
    const interval = window.setInterval(refreshWeather, WEATHER_REFRESH_INTERVAL)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <section
      className={styles.weatherStrip}
      aria-label={`Cuaca ${weatherSummary.location}: ${weatherSummary.condition}, ${weatherSummary.temperature} derajat Celsius, hujan ${weatherSummary.rainChance} persen, angin ${weatherSummary.windSpeed} kilometer per jam`}
    >
      <span>Cuaca {weatherSummary.location}</span>
      <i aria-hidden="true">•</i>
      <strong>{weatherSummary.condition} {weatherSummary.temperature}°C</strong>
      <i aria-hidden="true">•</i>
      <span>Hujan {weatherSummary.rainChance}%</span>
      <i aria-hidden="true">•</i>
      <span>Angin {weatherSummary.windSpeed} km/jam</span>
    </section>
  )
}
