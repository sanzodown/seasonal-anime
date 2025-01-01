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
  const {
    animeList,
    isLoading,
    error,
    pagination,
    isLoadingMore,
    loadMore
  } = useAnime(season, year)

  const handleRetry = () => {
    setSeason(prev => prev)
  }

  return (
    <div className="container mx-auto p-4">
      <Header
        onSeasonChange={setSeason}
        onYearChange={setYear}
      />
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
        pagination={pagination}
        isLoadingMore={isLoadingMore}
        onLoadMore={loadMore}
      />
    </div>
  )
}
