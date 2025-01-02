import { AnimeCard } from "./AnimeCard"
import { LoadingAnimation } from "./LoadingAnimation"
import type { Anime, Pagination } from "@/types/anime"
import { AlertCircle, RefreshCw, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"

interface AnimeGridProps {
  animeList: Anime[]
  isLoading: boolean
  error: string
  onRetry?: () => void
  pagination?: Pagination | null
  isLoadingMore?: boolean
  onLoadMore?: () => void
}

export function AnimeGrid({
  animeList,
  isLoading,
  error,
  onRetry,
  pagination,
  isLoadingMore,
  onLoadMore
}: AnimeGridProps) {
  const { ref, hasMore } = useInfiniteScroll({
    onLoadMore: () => onLoadMore?.(),
    isLoading: isLoadingMore || false,
    hasNextPage: pagination?.has_next_page || false,
    rootMargin: '500px'
  })

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
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {animeList.map((anime, index) => (
          <AnimeCard
            key={`${anime.mal_id}-${anime.title}-${index}`}
            anime={anime}
          />
        ))}
      </div>

      {/* Loading and pagination status */}
      <div className="flex flex-col items-center justify-center gap-2 min-h-[60px] relative">
        {/* Infinite scroll trigger */}
        <div
          ref={ref}
          className="absolute left-0 right-0 h-[300px] -top-[200px] pointer-events-none"
          aria-hidden="true"
        />

        {isLoadingMore && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading more anime...
          </div>
        )}
        {!isLoadingMore && hasMore && pagination?.items.total && (
          <div className="text-sm text-muted-foreground">
            Showing {animeList.length} of {pagination.items.total} anime
          </div>
        )}
        {!isLoadingMore && !hasMore && animeList.length > 0 && (
          <div className="text-sm text-muted-foreground">
            You&apos;ve reached the end
          </div>
        )}
      </div>
    </div>
  )
}
