import { NextResponse } from 'next/server'
import NodeCache from 'node-cache'
import { getCurrentSeason } from '@/lib/utils'

const cache = new NodeCache({ stdTTL: 0 }) // Default to no expiration

const ANILIST_QUERY = `
  query ($search: String) {
    Media(search: $search, type: ANIME) {
      id
      episodes
      title {
        romaji
        english
        native
      }
      synonyms
      externalLinks {
        site
        url
        language
        type
      }
      streamingEpisodes {
        title
        url
        site
      }
    }
  }
`

const streamingServices = {
  'Crunchyroll': ['STREAMING', 'WATCH'],
  'Netflix': ['STREAMING'],
  'ADN': ['STREAMING'],
  'Wakanim': ['STREAMING'],
  'Disney Plus': ['STREAMING'],
  'Prime Video': ['STREAMING'],
  'Hidive': ['STREAMING']
} as const

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Remove all non-alphanumeric characters
    .replace(/\s+/g, '')       // Remove spaces
}

export async function POST(request: Request) {
  try {
    const { titles, season, year } = await request.json()
    const currentYear = new Date().getFullYear()
    const currentSeason = getCurrentSeason()

    if (!titles || !Array.isArray(titles) || titles.length === 0) {
      return NextResponse.json({ error: 'Titles array is required' }, { status: 400 })
    }

    const results: Record<string, any> = {}
    const titlesToFetch: string[] = []

    // Determine if we should use expiring cache
    const shouldExpire = season === currentSeason &&
      Number(year) === currentYear
    const ttl = shouldExpire ? 604800 : 0 // 1 week or infinite

    // Check cache first
    titles.forEach(title => {
      const cacheKey = `streaming-${title}`
      const cachedData = cache.get(cacheKey)
      if (cachedData) {
        results[title] = cachedData
      } else {
        titlesToFetch.push(title)
      }
    })

    if (titlesToFetch.length > 0) {
      for (const title of titlesToFetch) {
        const cleanTitle = title
          .replace(/\([^)]*\)/g, '')
          .replace(/Season \d+/gi, '')
          .replace(/Part \d+/gi, '')
          .replace(/:.*$/, '')
          .trim()

        try {
          const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              query: ANILIST_QUERY,
              variables: { search: cleanTitle }
            })
          })

          if (!response.ok) {
            console.error(`AniList API error for "${title}":`, response.status)
            continue
          }

          const data = await response.json()
          if (data.errors) {
            console.error('AniList GraphQL Errors:', data.errors)
            continue
          }

          const media = data.data?.Media
          if (!media) continue

          // Check if this is really the anime we're looking for
          const normalizedOriginal = normalizeTitle(title)
          const normalizedEnglish = media.title.english ? normalizeTitle(media.title.english) : ''
          const normalizedRomaji = normalizeTitle(media.title.romaji)
          const normalizedSynonyms = (media.synonyms || []).map(normalizeTitle)

          const isMatch =
            normalizedOriginal === normalizedEnglish ||
            normalizedOriginal === normalizedRomaji ||
            normalizedSynonyms.includes(normalizedOriginal) ||
            normalizedOriginal.includes(normalizedRomaji) ||
            (normalizedEnglish && normalizedOriginal.includes(normalizedEnglish))

          if (!isMatch) continue

          const streaming = media.externalLinks
            ?.filter((link: any) => {
              if (!link) return false
              const service = Object.entries(streamingServices).find(([name]) =>
                link.site.toLowerCase().includes(name.toLowerCase())
              )
              return service && streamingServices[service[0] as keyof typeof streamingServices].includes(link.type)
            })
            .map((link: any) => ({
              name: link.site,
              url: link.url,
              language: link.language || 'global'
            })) || []

          const result = {
            episodes: media.episodes,
            streaming
          }

          const cacheKey = `streaming-${title}`
          cache.set(cacheKey, result, ttl)
          results[title] = result

        } catch (err) {
          console.error(`Error processing "${title}":`, err)
          continue
        }

        await new Promise(resolve => setTimeout(resolve, 250))
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('Streaming API Error:', error)
    return NextResponse.json(
      { error: `Error fetching data: ${error}` },
      { status: 500 }
    )
  }
}
