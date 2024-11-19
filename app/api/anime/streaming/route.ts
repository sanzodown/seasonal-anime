import { NextResponse } from 'next/server'
import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 600 }) // 10 minutes

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title')

  if (!title) {
    return NextResponse.json(
      { error: 'Le titre est requis' },
      { status: 400 }
    )
  }

  const cacheKey = `streaming-${title}`
  const cachedData = cache.get(cacheKey)
  if (cachedData) {
    return NextResponse.json(cachedData)
  }

  try {
    const cleanTitle = title
      .replace(/\([^)]*\)/g, '')
      .replace(/Season \d+/gi, '')
      .replace(/Part \d+/gi, '')
      .replace(/:.*$/, '')
      .trim()

    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: ANILIST_QUERY,
        variables: { search: cleanTitle }
      })
    })

    const data = await response.json()
    const streamingServices = {
      'Crunchyroll': ['STREAMING', 'WATCH'],
      'Netflix': ['STREAMING'],
      'ADN': ['STREAMING'],
      'Wakanim': ['STREAMING'],
      'Disney Plus': ['STREAMING'],
      'Prime Video': ['STREAMING'],
      'Hidive': ['STREAMING']
    } as const;

    type StreamingServiceKey = keyof typeof streamingServices;

    const result = {
      episodes: data.data?.Media?.episodes,
      streaming: data.data?.Media?.externalLinks
        ?.filter((link: any) => {
          const service = Object.entries(streamingServices).find(([name]) =>
            link.site.toLowerCase().includes(name.toLowerCase())
          )

          const isValidType = service && streamingServices[service[0] as StreamingServiceKey].includes(link.type)

          const isValidLanguage = !link.language || link.language === 'fr'

          return isValidType && isValidLanguage
        })
        .map((link: any) => ({
          name: link.site,
          url: link.url,
          language: link.language || 'global'
        })) || []
    }

    if (data.data?.Media?.streamingEpisodes?.length > 0) {
      const streamingEpisodes = data.data.Media.streamingEpisodes
        .filter((episode: any) =>
          Object.keys(streamingServices).some(service =>
            episode.site.toLowerCase().includes(service.toLowerCase())
          )
        )

      streamingEpisodes.forEach((episode: any) => {
        if (!result.streaming.some(s => s.name === episode.site)) {
          result.streaming.push({
            name: episode.site,
            url: episode.url,
            language: 'global'
          })
        }
      })
    }

    console.log(`Streaming data for ${cleanTitle}:`, {
      rawLinks: data.data?.Media?.externalLinks,
      filteredStreaming: result.streaming
    })

    cache.set(cacheKey, result)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    )
  }
}
