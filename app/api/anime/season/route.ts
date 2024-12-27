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
  const currentYear = new Date().getFullYear()
  const currentSeason = getCurrentSeason()

  const cacheKey = `season-${season}-${year}`
  const cachedData = cache.get(cacheKey)

  if (cachedData) {
    const response = NextResponse.json(cachedData)
    response.headers.set('Cache-Control', 'public, max-age=604800, s-maxage=604800')
    return response
  }

  try {
    const url = season === 'upcoming'
      ? 'https://api.jikan.moe/v4/seasons/upcoming'
      : `https://api.jikan.moe/v4/seasons/${year}/${season}`

    const response = await fetch(url)
    const data = await response.json()

    if (response.status === 429 || !response.ok) {
      return NextResponse.json(
        data,
        { status: response.status }
      )
    }

    const isPastSeason = Number(year) < currentYear ||
      (Number(year) === currentYear &&
        ['winter', 'spring', 'summer', 'fall'].indexOf(season!) <
        ['winter', 'spring', 'summer', 'fall'].indexOf(currentSeason))

    const ttl = isPastSeason ? 0 : 604800
    cache.set(cacheKey, data, ttl)

    const apiResponse = NextResponse.json(data)

    if (isPastSeason) {
      apiResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    } else {
      apiResponse.headers.set('Cache-Control', 'public, max-age=604800, s-maxage=604800')
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
