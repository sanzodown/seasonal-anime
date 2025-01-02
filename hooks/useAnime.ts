import { useState, useEffect, useCallback } from 'react'
import type { Anime, AnimeResponse, Pagination } from '@/types/anime'

const RETRY_DELAY = 1000
const MAX_RETRIES = 3
const RATE_LIMIT_MESSAGE = 'Rate limit reached. Please wait a moment before trying again.'

interface JikanError {
  status: string
  type: string
  message: string
  error: string | null
}

interface ErrorResponse {
  error: string
}

function isRelevantToSeason(anime: Anime, targetSeason: string, targetYear: number): boolean {
  if (anime.season && anime.year) {
    return anime.season.toLowerCase() === targetSeason.toLowerCase() &&
      anime.year === targetYear
  }

  if (anime.status === 'Not yet aired' && anime.aired.prop.from.year && anime.aired.prop.from.month) {
    if (anime.aired.prop.from.month === 1 && anime.aired.prop.from.day === 1) {
      return false
    }

    const month = anime.aired.prop.from.month
    let season = ''

    if (month >= 1 && month <= 3) season = 'winter'
    else if (month >= 4 && month <= 6) season = 'spring'
    else if (month >= 7 && month <= 9) season = 'summer'
    else season = 'fall'

    return season === targetSeason.toLowerCase() &&
      anime.aired.prop.from.year === targetYear
  }

  if (anime.status === 'Currently Airing' && anime.aired.from) {
    const airDate = new Date(anime.aired.from)
    const year = airDate.getFullYear()
    const month = airDate.getMonth() + 1

    if (month === 1 && airDate.getDate() === 1) {
      return false
    }

    let season = ''
    if (month >= 1 && month <= 3) season = 'winter'
    else if (month >= 4 && month <= 6) season = 'spring'
    else if (month >= 7 && month <= 9) season = 'summer'
    else season = 'fall'

    return season === targetSeason.toLowerCase() && year === targetYear
  }

  return false
}

function deduplicateAnime(animeList: Anime[]): Anime[] {
  const seen = new Map<number, Anime>()
  const uniqueAnime = animeList.filter(anime => {
    if (!anime.mal_id) return false
    if (seen.has(anime.mal_id)) return false
    seen.set(anime.mal_id, anime)
    return true
  })
  return uniqueAnime
}

export function useAnime(season: string, year: number) {
  const [animeList, setAnimeList] = useState<Anime[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const fetchWithRetry = useCallback(async (url: string, retries = 0): Promise<Response> => {
    try {
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })

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

  const fetchAnime = useCallback(async (page = 1, isLoadMore = false) => {
    if (!isLoadMore) {
      setIsLoading(true)
    } else {
      setIsLoadingMore(true)
    }
    setError('')
    setRetryCount(0)

    try {
      const url = `/api/anime/season?season=${season}&year=${year}&page=${page}`
      const response = await fetchWithRetry(url)

      if (!response.ok) {
        const errorData: JikanError = await response.json()
        throw new Error(errorData.message || 'Failed to fetch anime data')
      }

      const responseData = await response.json()

      if ('error' in responseData) {
        const errorResponse = responseData as ErrorResponse
        throw new Error(errorResponse.error)
      }

      const data = responseData as AnimeResponse
      const tvAnime = data.data
        ?.filter((anime: Anime) => anime.type === 'TV' && anime.mal_id)
        ?.filter(anime => isRelevantToSeason(anime, season, year)) || []

      if (isLoadMore) {
        setAnimeList(prev => {
          const combined = [...prev, ...tvAnime]
          return deduplicateAnime(combined)
        })
      } else {
        setAnimeList(deduplicateAnime(tvAnime))
      }

      setPagination(data.pagination)
      setError('')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load anime data'
      setError(errorMessage)
      if (errorMessage.includes('rate-limit')) {
        setRetryCount(prev => prev + 1)
      }
    } finally {
      if (isLoadMore) {
        setIsLoadingMore(false)
      } else {
        setIsLoading(false)
      }
    }
  }, [season, year, fetchWithRetry])

  const loadMore = useCallback(() => {
    if (pagination && pagination.has_next_page) {
      fetchAnime(pagination.current_page + 1, true)
    }
  }, [pagination, fetchAnime])

  useEffect(() => {
    if (season) {
      setAnimeList([])
      setPagination(null)
      setIsLoading(true)
      setError('')
      setRetryCount(0)
      fetchAnime(1)
    }
  }, [season, year, fetchAnime])

  return {
    animeList,
    isLoading,
    error,
    retryCount,
    pagination,
    isLoadingMore,
    loadMore
  }
}
