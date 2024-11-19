import { useState, useEffect } from 'react'
import type { Anime } from '@/types/anime'

export function useAnime(season: string, year: number) {
  const [animeList, setAnimeList] = useState<Anime[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (season) {
      fetchAnime()
    }
  }, [season, year])

  const fetchAnime = async () => {
    setIsLoading(true)
    setError('')
    try {
      const url = season === 'upcoming'
        ? 'https://api.jikan.moe/v4/seasons/upcoming'
        : `https://api.jikan.moe/v4/seasons/${year}/${season}`

      const response = await fetch(url)
      const data = await response.json()

      const tvAnime = data.data?.filter((anime: any) => anime.type === 'TV') || []
      setAnimeList(tvAnime)
    } catch (err) {
      setError('Échec du chargement des données. Veuillez réessayer plus tard.')
    } finally {
      setIsLoading(false)
    }
  }

  return { animeList, isLoading, error }
}
