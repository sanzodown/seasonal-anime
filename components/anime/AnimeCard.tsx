import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Anime } from "@/types/anime"
import { VideoPlayer } from './VideoPlayer'
import { AnimeDetails } from './AnimeDetails'

interface AnimeCardProps {
  anime: Anime
}

export function AnimeCard({ anime }: AnimeCardProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDetailsOpen(true)
  }

  const formatDay = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()
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
        className="group relative overflow-hidden transition-all duration-300 ease-in-out transform h-[500px]
          hover:scale-[1.02] hover:shadow-xl hover:shadow-white/25
          hover:backdrop-blur-sm hover:border-2 hover:border-white/50
          bg-white dark:bg-gray-800 cursor-pointer"
        onClick={() => anime.trailer?.youtube_id && setIsVideoOpen(true)}
        onContextMenu={handleContextMenu}
      >
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
            alt={anime.title}
            className="w-full h-full object-cover transition-all duration-300 scale-[1.15] group-hover:scale-100 group-hover:blur-[5px]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(anime.status)}`}>
              {getStatusText(anime.status)}
            </span>
          </div>
        </div>
        <CardContent className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="space-y-3 text-white">
            <h2 className="text-2xl font-bold leading-tight line-clamp-2 drop-shadow-lg">
              {anime.title}
            </h2>
            <p className="text-sm leading-relaxed line-clamp-4 text-gray-100/90 font-medium">
              {anime.synopsis}
            </p>
            {anime.broadcast?.day && (
              <p className="font-geist-mono text-xs text-gray-100/80 uppercase tracking-wider">
                Diffusion : {formatDay(anime.broadcast.day)} {anime.broadcast.time}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <VideoPlayer
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        youtubeId={anime.trailer?.youtube_id}
      />

      <AnimeDetails
        anime={anime}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </>
  )
}
