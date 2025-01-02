import { NextResponse } from 'next/server'
import NodeCache from 'node-cache'
import { getCurrentSeason } from '@/lib/utils'

export const runtime = 'edge'
export const revalidate = false

const cache = new NodeCache({ stdTTL: 0 })

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const season = searchParams.get('season')
  const year = searchParams.get('year')
  const page = searchParams.get('page') || '1'
  const currentYear = new Date().getFullYear()
  const currentSeason = getCurrentSeason()

  const cacheKey = `season-${season}-${year}-${page}`
  const cachedData = cache.get(cacheKey)

  if (cachedData) {
    const response = NextResponse.json(cachedData)
    response.headers.set('Cache-Control', 'public, max-age=604800, s-maxage=604800')
    return response
  }

  try {
    const url = season === 'upcoming'
      ? `https://api.jikan.moe/v4/seasons/upcoming?page=${page}`
      : `https://api.jikan.moe/v4/seasons/${year}/${season}?page=${page}`

    const response = await fetch(url)
    const data = await response.json()

    if (response.status === 429 || !response.ok) {
      return NextResponse.json(
        data,
        { status: response.status }
      )
    }

    const isCurrentOrAdjacentSeason = Number(year) === currentYear &&
      Math.abs(['winter', 'spring', 'summer', 'fall'].indexOf(season!) -
        ['winter', 'spring', 'summer', 'fall'].indexOf(currentSeason)) <= 1

    const ttl = isCurrentOrAdjacentSeason ? 3600 : 0
    cache.set(cacheKey, data, ttl)

    const apiResponse = NextResponse.json(data)

    if (isCurrentOrAdjacentSeason) {
      apiResponse.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600')
    } else {
      apiResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    }

    return apiResponse
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Error fetching data' },
      { status: 500 }
    )
  }
}
