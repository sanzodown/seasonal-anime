'use client'

import { useState } from 'react'
import { Header } from '@/components/anime/Header'
import { SeasonSelector } from '@/components/anime/SeasonSelector'
import { AnimeGrid } from '@/components/anime/AnimeGrid'
import { useAnime } from '@/hooks/useAnime'
import { getCurrentSeason } from '@/lib/utils'

export default function SeasonalAnimePage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [season, setSeason] = useState(getCurrentSeason())
  const [year, setYear] = useState(new Date().getFullYear())
  const { animeList, isLoading, error } = useAnime(season, year)

  return (
    <div className="container mx-auto p-4">
      <Header
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />
      <SeasonSelector
        season={season}
        year={year}
        onSeasonChange={setSeason}
        onYearChange={setYear}
      />
      <AnimeGrid animeList={animeList} isLoading={isLoading} error={error} />
    </div>
  )
}
