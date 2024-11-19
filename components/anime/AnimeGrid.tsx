import { AnimeCard } from "./AnimeCard"
import type { Anime } from "@/types/anime"

interface AnimeGridProps {
  animeList: Anime[]
  isLoading: boolean
  error: string | null
}

export function AnimeGrid({ animeList, isLoading, error }: AnimeGridProps) {
  if (isLoading) {
    return <p className="text-center">Chargement...</p>
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {animeList.map((anime) => (
        <AnimeCard key={anime.mal_id} anime={anime} />
      ))}
    </div>
  )
} 
