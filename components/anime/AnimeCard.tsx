import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Anime } from "@/types/anime"
import { VideoPlayer } from './VideoPlayer'
import { AnimeDetails } from './AnimeDetails'
import Image from 'next/image'

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
  console.log(anime.title + ' :=> ' + (anime.streaming && anime.streaming.length > 0 ? anime.streaming[0].name : 'No streaming'))

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
          <Image
            src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
            alt={anime.title}
            className="w-full h-full object-cover transition-all duration-300 scale-[1.15] group-hover:scale-100 group-hover:blur-[5px]"
            loading="lazy"
            width={500}
            height={300}
            style={{ objectFit: 'cover' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(anime.status)}`}>
              {getStatusText(anime.status)}
            </span>
          </div>
          {anime.streaming && anime.streaming.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {anime.streaming.map((stream, index) => (
                <span
                  key={index}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium text-white ${getStreamingColor(stream.name)}`}
                >
                  {stream.name}
                </span>
              ))}
            </div>
          )}
        </div>
        <CardContent className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="space-y-3 text-white">
            <h2 className="text-2xl font-bold leading-tight line-clamp-2 drop-shadow-lg">
              {anime.title}
            </h2>
            <p className="text-sm leading-relaxed line-clamp-4 text-gray-100/90 font-medium">
              {anime.synopsis}
            </p>
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
