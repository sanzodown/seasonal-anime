import { useState, useEffect } from 'react'
import type { Anime } from '@/types/anime'

const BATCH_SIZE = 8;
const BATCH_DELAY = 300;
const CACHE = new Map<string, { data: Anime[], timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export function useAnime(season: string, year: number) {
  const [animeList, setAnimeList] = useState<Anime[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const cacheKey = `${season}-${year}`;

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchStreamingDataBatch = async (animeList: Anime[]) => {
    const results = [];

    for (let i = 0; i < animeList.length; i += BATCH_SIZE) {
      const batch = animeList.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map(async (anime) => {
          try {
            const response = await fetch(`/api/anime/streaming?title=${encodeURIComponent(anime.title)}`);

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return {
              ...anime,
              episodes: data.episodes || anime.episodes,
              streaming: data.streaming || []
            };
          } catch (err) {
            console.warn(`Erreur pour ${anime.title}:`, err);
            return { ...anime, streaming: [] };
          }
        })
      );

      results.push(...batchResults);
      if (i + BATCH_SIZE < animeList.length) {
        await delay(BATCH_DELAY);
      }
    }

    return results;
  };

  const fetchAnime = async () => {
    setIsLoading(true);
    setError('');

    // Vérifier le cache côté client
    const cached = CACHE.get(cacheKey);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      setAnimeList(cached.data);
      setIsLoading(false);
      return;
    }

    try {
      const url = `/api/anime/season?season=${season}&year=${year}`;
      const response = await fetch(url);
      const data = await response.json();

      const tvAnime = data.data?.filter((anime: any) => anime.type === 'TV') || [];
      const animeWithStreaming = await fetchStreamingDataBatch(tvAnime);

      // Mettre en cache les résultats
      CACHE.set(cacheKey, {
        data: animeWithStreaming,
        timestamp: now
      });

      setAnimeList(animeWithStreaming);
    } catch (err) {
      setError('Échec du chargement des données. Veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (season) {
      fetchAnime()
    }
  }, [season, year])

  return { animeList, isLoading, error }
}
