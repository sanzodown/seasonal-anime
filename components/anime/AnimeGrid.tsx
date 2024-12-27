import { AnimeCard } from "./AnimeCard"
import { LoadingAnimation } from "./LoadingAnimation"
import type { Anime } from "@/types/anime"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AnimeGridProps {
  animeList: Anime[]
  isLoading: boolean
  error: string
  onRetry?: () => void
}

export function AnimeGrid({ animeList, isLoading, error, onRetry }: AnimeGridProps) {
  if (isLoading) {
    return <LoadingAnimation />
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 p-8">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Error Loading Anime</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <Button
            variant="outline"
            onClick={onRetry}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (animeList.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-muted-foreground">
        No anime found for this season
      </div>
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
