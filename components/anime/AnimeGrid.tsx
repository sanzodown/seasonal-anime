import { AnimeCard } from "./AnimeCard"
import { LoadingAnimation } from "./LoadingAnimation"
import type { Anime } from "@/types/anime"

interface AnimeGridProps {
  animeList: Anime[]
  isLoading: boolean
  error: string | null
}

export function AnimeGrid({ animeList, isLoading, error }: AnimeGridProps) {
  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingAnimation />
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-center text-red-500 min-h-[50vh] flex items-center justify-center">
        {error}
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {animeList.map((anime, index) => (
        <AnimeCard
          key={`${anime.mal_id}-${anime.title}-${index}`}
          anime={anime}
        />
      ))}
    </div>
  )
}
