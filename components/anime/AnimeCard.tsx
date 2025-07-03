import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Anime } from "@/types/anime"
import { AnimeDetails } from './AnimeDetails'
import Image from 'next/image'
import { formatBroadcastTime, formatAiredDate } from '@/lib/utils'
import { useBookmarks } from '@/hooks/useBookmarks'
import { Button } from '@/components/ui/button'
import { Bookmark, BookmarkCheck } from 'lucide-react'

interface AnimeCardProps {
  anime: Anime
}

export function AnimeCard({ anime }: AnimeCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks()

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isBookmarked(anime.mal_id)) {
      removeBookmark(anime.mal_id)
    } else {
      addBookmark(anime)
    }
  }

  const getStreamingColor = (name: string) => {
    switch (name.toLowerCase()) {
      case 'crunchyroll':
        return 'bg-[#F47521]'
      case 'netflix':
        return 'bg-[#E50914]'
      case 'disney plus':
      case 'disney+':
        return 'bg-[#113CCF]'
      case 'prime video':
      case 'amazon prime video':
        return 'bg-[#00A8E1]'
      case 'hidive':
        return 'bg-[#00BAAF]'
      case 'adn':
        return 'bg-[#0099FF]'
      case 'wakanim':
        return 'bg-[#FF1F1F]'
      default:
        return 'bg-blue-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Currently Airing':
        return 'bg-green-500'
      case 'Finished Airing':
        return 'bg-red-500'
      default:
        return 'bg-yellow-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Currently Airing':
        return 'Airing'
      case 'Finished Airing':
        return 'Finished'
      default:
        return 'Coming Soon'
    }
  }

  return (
    <>
      <Card
        className="group relative overflow-hidden transition-all duration-300 ease-in-out transform h-[420px]
          hover:scale-[1.02] hover:shadow-xl hover:shadow-white/25
          hover:backdrop-blur-sm hover:border-2 hover:border-white/50
          bg-white dark:bg-gray-800 cursor-pointer"
        onClick={() => setIsDetailsOpen(true)}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={`/api/image-proxy?url=${encodeURIComponent(
              anime.images.jpg.large_image_url || anime.images.jpg.image_url
            )}`}
            alt={anime.title}
            className="w-full h-full object-cover transition-all duration-300 scale-[1.15] group-hover:scale-100 group-hover:blur-[5px]"
            loading="lazy"
            width={400}
            height={240}
            style={{ objectFit: 'cover' }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 md:opacity-0 md:group-hover:opacity-100" />

          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 md:opacity-0 md:group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/30 hover:bg-black/50"
              onClick={handleBookmarkClick}
            >
              {isBookmarked(anime.mal_id) ? (
                <BookmarkCheck className="h-5 w-5 text-yellow-400" />
              ) : (
                <Bookmark className="h-5 w-5 text-white" />
              )}
            </Button>
          </div>

          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 md:opacity-0 md:group-hover:opacity-100">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(anime.status)}`}>
              {getStatusText(anime.status)}
            </span>
          </div>

          {anime.streaming && anime.streaming.length > 0 && (
            <div className="absolute top-12 left-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
              {anime.streaming.map((stream, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStreamingColor(stream.name)}`}
                >
                  {stream.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300">
          <div className="space-y-2 text-white">
            <h2 className="text-lg font-bold leading-tight line-clamp-2 drop-shadow-lg">
              {anime.title_english || anime.title}
            </h2>
            {anime.title_english && anime.title_english !== anime.title && (
              <p className="text-sm text-gray-300/90 line-clamp-1 -mt-0.5 mb-1">
                {anime.title}
              </p>
            )}
            {anime.status === 'Currently Airing' && anime.broadcast?.day && anime.broadcast?.time && (
              <p className="text-xs font-medium text-green-400">
                Next episode: {formatBroadcastTime(anime.broadcast.day, anime.broadcast.time)}
              </p>
            )}
            {anime.status === 'Not yet aired' && (
              <p className="text-xs font-medium text-yellow-400">
                Starts: {formatAiredDate(anime.aired)}
              </p>
            )}
            <p className="text-xs leading-relaxed line-clamp-3 text-gray-100/90 font-medium hidden md:block">
              {anime.synopsis}
            </p>
          </div>
        </div>
      </Card>

      <AnimeDetails
        anime={anime}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </>
  )
}
