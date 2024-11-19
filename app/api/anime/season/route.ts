import { NextResponse } from 'next/server'
import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 600 }) // 10 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const season = searchParams.get('season')
  const year = searchParams.get('year')
  const cacheKey = `season-${season}-${year}`

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

    cache.set(cacheKey, data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur API:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    )
  }
}
