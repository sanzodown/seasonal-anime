'use client'

import { useState } from 'react'
import { Header } from '@/components/anime/Header'
import { SeasonSelector } from '@/components/anime/SeasonSelector'
import { AnimeGrid } from '@/components/anime/AnimeGrid'
import { useAnime } from '@/hooks/useAnime'
import { getCurrentSeason } from '@/lib/utils'

export default function SeasonalAnimePage() {
  const [season, setSeason] = useState(getCurrentSeason())
  const [year, setYear] = useState(new Date().getFullYear())
  const { animeList, isLoading, error, retryCount } = useAnime(season, year)

  const handleRetry = () => {
    // Force a re-render by changing the key of useAnime
    setSeason(prev => prev)
  }

  return (
    <div className="container mx-auto p-4">
      <Header />
      <SeasonSelector
        season={season}
        year={year}
        onSeasonChange={setSeason}
        onYearChange={setYear}
      />
      <AnimeGrid
        animeList={animeList}
        isLoading={isLoading}
        error={error}
        onRetry={handleRetry}
      />
    </div>
  )
}
