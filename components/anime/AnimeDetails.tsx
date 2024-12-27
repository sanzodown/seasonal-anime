"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Anime } from "@/types/anime"
import { useStreamingData } from "@/hooks/useStreamingData"
import { useEffect, useRef, useState } from "react"
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { VideoPlayer } from "./VideoPlayer"
import { formatBroadcastTime, formatSeasonStart } from '@/lib/utils'

interface AnimeDetailsProps {
  anime: Anime
  isOpen: boolean
  onClose: () => void
}

function getStreamingColor(name: string): string {
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

function getStatusColor(status: string): string {
  switch (status) {
    case 'Currently Airing':
      return 'bg-green-500'
    case 'Finished Airing':
      return 'bg-red-500'
    default:
      return 'bg-yellow-500'
  }
}

function getStatusText(status: string): string {
  switch (status) {
    case 'Currently Airing':
      return 'Airing'
    case 'Finished Airing':
      return 'Finished'
    default:
      return 'Coming Soon'
  }
}

export function AnimeDetails({ anime, isOpen, onClose }: AnimeDetailsProps) {
  const { streamingData, isLoading, error, fetchStreamingData } = useStreamingData()
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (isOpen && !hasFetched.current && !streamingData[anime.title]) {
      hasFetched.current = true
      fetchStreamingData(anime.title)
    }

    if (!isOpen) {
      hasFetched.current = false
    }
  }, [isOpen, anime.title, streamingData, fetchStreamingData])

  const currentStreamingData = streamingData[anime.title]
  const isLoadingCurrent = isLoading[anime.title]
  const currentError = error[anime.title]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] p-0 bg-black/95 border-white/10 max-h-[90vh] overflow-hidden custom-scrollbar">
        <DialogTitle className="sr-only">
          {anime.title} Details
        </DialogTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 h-[80vh] md:h-[90vh]">
          {/* Left Column - Image and Trailer Button */}
          <div className="relative h-full overflow-hidden">
            <div className="absolute inset-0">
              <Image
                src={`/api/image-proxy?url=${encodeURIComponent(
                  anime.images.jpg.large_image_url || anime.images.jpg.image_url
                )}`}
                alt={anime.title}
                width={1920}
                height={1080}
                priority
                className="object-cover w-full h-full scale-105 transition-transform duration-300"
                style={{
                  filter: 'contrast(1.1) saturate(1.2)',
                  transform: 'scale(1.05)'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/20 to-black backdrop-blur-[2px]" />
            </div>

            {anime.trailer?.youtube_id && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  onClick={() => setIsVideoOpen(true)}
                  variant="ghost"
                  size="lg"
                  className="text-white hover:bg-white/10 transition-all duration-300
                    gap-2 group px-6 py-3 relative"
                >
                  <Play className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  <span className="hidden sm:inline font-medium">Watch Trailer</span>
                  <span className="sm:hidden font-medium">Trailer</span>
                </Button>
              </div>
            )}
          </div>

          {/* Right Column - Content */}
          <div className="p-6 overflow-y-auto h-[40vh] md:h-full">
            <h2 className="text-3xl font-bold mb-4 text-white">{anime.title}</h2>

            {/* Status and Episodes */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(anime.status)}`}>
                {getStatusText(anime.status)}
              </span>
              {anime.episodes && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/10">
                  {anime.episodes} episodes
                </span>
              )}
              {anime.status === 'Currently Airing' && anime.broadcast?.day && anime.broadcast?.time && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400">
                  Next episode: {formatBroadcastTime(anime.broadcast.day, anime.broadcast.time)}
                </span>
              )}
              {anime.status === 'Not yet aired' && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-400">
                  Starts: {formatSeasonStart(anime.season || '', anime.year || 0)}
                </span>
              )}
            </div>

            {/* Synopsis */}
            <div className="space-y-4 max-h-[40vh] overflow-hidden">
              <p className="text-gray-300 leading-relaxed">{anime.synopsis}</p>
            </div>

            {/* Streaming Section */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold mb-2 text-white">Available on</h3>
              {isLoadingCurrent ? (
                <p className="text-gray-400">Loading streaming information...</p>
              ) : currentError ? (
                <p className="text-red-400">{currentError}</p>
              ) : currentStreamingData?.streaming.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {currentStreamingData.streaming.map((service, index) => (
                    <a
                      key={index}
                      href={service.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90 ${getStreamingColor(service.name)}`}
                    >
                      {service.name}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No streaming services available</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>

      {anime.trailer?.youtube_id && (
        <VideoPlayer
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
          youtubeId={anime.trailer.youtube_id}
        />
      )}
    </Dialog>
  )
}
