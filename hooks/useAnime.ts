import { useState, useEffect, useCallback } from 'react'
import type { Anime } from '@/types/anime'

const BATCH_SIZE = 50;
const BATCH_DELAY = 1000;
const CACHE = new Map<string, { data: Anime[], timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000;

export function useAnime(season: string, year: number) {
  const [animeList, setAnimeList] = useState<Anime[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const cacheKey = `${season}-${year}`;

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchStreamingDataBatch = useCallback(async (animeList: Anime[]) => {
    const results = [];

    for (let i = 0; i < animeList.length; i += BATCH_SIZE) {
      const batch = animeList.slice(i, i + BATCH_SIZE);
      try {
        const response = await fetch('/api/anime/streaming', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            titles: batch.map(anime => anime.title),
            season,
            year
          })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        const batchResults = batch.map(anime => ({
          ...anime,
          episodes: data[anime.title]?.episodes || anime.episodes,
          streaming: data[anime.title]?.streaming || []
        }));

        results.push(...batchResults);
      } catch (err) {
        console.warn(`Error for batch:`, err);
        results.push(...batch.map(anime => ({ ...anime, streaming: [] })));
      }

      if (i + BATCH_SIZE < animeList.length) {
        await delay(BATCH_DELAY);
      }
    }

    return results;
  }, [season, year]);

  const fetchAnime = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const url = `/api/anime/season?season=${season}&year=${year}`;
      const response = await fetch(url);
      const data = await response.json();

      const tvAnime = data.data?.filter((anime: any) => anime.type === 'TV') || [];

      setAnimeList(tvAnime);
    } catch (err) {
      setError('Failed to load anime data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [season, year]);

  useEffect(() => {
    if (season) {
      setAnimeList([]);
      fetchAnime();
    }
  }, [season, year, fetchAnime]);

  return { animeList, isLoading, error }
}
