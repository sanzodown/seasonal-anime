import { NextResponse } from 'next/server'
import NodeCache from 'node-cache'
import { getCurrentSeason } from '@/lib/utils'

const cache = new NodeCache({ stdTTL: 0 }) // Default to no expiration

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const season = searchParams.get('season')
  const year = searchParams.get('year')
  const currentYear = new Date().getFullYear()
  const currentSeason = getCurrentSeason()

  const cacheKey = `season-${season}-${year}`

  // Set TTL to 1 week (604800 seconds) for current/future seasons, infinite for past seasons
  const isPastSeason = Number(year) < currentYear ||
    (Number(year) === currentYear &&
      ['winter', 'spring', 'summer', 'fall'].indexOf(season!) <
      ['winter', 'spring', 'summer', 'fall'].indexOf(currentSeason))

  const ttl = isPastSeason ? 0 : 604800

  const cachedData = cache.get(cacheKey)
  if (cachedData) {
    return NextResponse.json(cachedData)
  }

  try {
    const url = season === 'upcoming'
      ? 'https://api.jikan.moe/v4/seasons/upcoming'
      : `https://api.jikan.moe/v4/seasons/${year}/${season}`

    const response = await fetch(url)
    const data = await response.json()

    cache.set(cacheKey, data, ttl)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur API:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    )
  }
}
