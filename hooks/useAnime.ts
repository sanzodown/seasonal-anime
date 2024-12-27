import { useState, useEffect, useCallback } from 'react'
import type { Anime } from '@/types/anime'

const RETRY_DELAY = 1000 // 1 second
const MAX_RETRIES = 3
const RATE_LIMIT_MESSAGE = 'Rate limit reached. Please wait a moment before trying again.'

interface JikanError {
  status: string
  type: string
  message: string
  error: string | null
}

export function useAnime(season: string, year: number) {
  const [animeList, setAnimeList] = useState<Anime[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  const fetchWithRetry = useCallback(async (url: string, retries = 0): Promise<Response> => {
    try {
      const response = await fetch(url)

      if (response.status === 429) {
        if (retries < MAX_RETRIES) {
          setError(RATE_LIMIT_MESSAGE)
          const delay = RETRY_DELAY * Math.pow(2, retries)
          await new Promise(resolve => setTimeout(resolve, delay))
          return fetchWithRetry(url, retries + 1)
        }
        const errorData: JikanError = await response.json()
        throw new Error(errorData.message || RATE_LIMIT_MESSAGE)
      }

      return response
    } catch (err) {
      if (retries < MAX_RETRIES) {
        const delay = RETRY_DELAY * Math.pow(2, retries)
        await new Promise(resolve => setTimeout(resolve, delay))
        return fetchWithRetry(url, retries + 1)
      }
      throw err
    }
  }, [])

  const fetchAnime = useCallback(async () => {
    setIsLoading(true)
    setError('')
    setRetryCount(0)

    try {
      const url = `/api/anime/season?season=${season}&year=${year}`
      const response = await fetchWithRetry(url)

      if (!response.ok) {
        const errorData: JikanError = await response.json()
        throw new Error(errorData.message || 'Failed to fetch anime data')
      }

      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }

      const tvAnime = data.data?.filter((anime: any) => anime.type === 'TV') || []
      setAnimeList(tvAnime)
      setError('')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load anime data'
      setError(errorMessage)
      if (errorMessage.includes('rate-limit')) {
        setRetryCount(prev => prev + 1)
      }
    } finally {
      setIsLoading(false)
    }
  }, [season, year, fetchWithRetry])

  useEffect(() => {
    if (season) {
      setAnimeList([])
      fetchAnime()
    }
  }, [season, year, fetchAnime])

  return { animeList, isLoading, error, retryCount }
}
