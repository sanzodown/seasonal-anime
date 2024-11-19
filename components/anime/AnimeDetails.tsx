import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Anime } from "@/types/anime"
import Image from 'next/image'

interface AnimeDetailsProps {
  anime: Anime
  isOpen: boolean
  onClose: () => void
}

function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    'finished': 'Finished',
    'currently_airing': 'Airing',
    'not_yet_aired': 'Coming Soon'
  }
  return statusMap[status] || status
}

function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    'finished': 'bg-green-500',
    'currently_airing': 'bg-blue-500',
    'not_yet_aired': 'bg-yellow-500'
  }
  return colorMap[status] || 'bg-gray-500'
}

export function AnimeDetails({ anime, isOpen, onClose }: AnimeDetailsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] max-h-[90vh] overflow-y-auto p-0 bg-black/95 border-white/10">
        <DialogTitle className="sr-only">
          Détails de {anime.title}
        </DialogTitle>
        <div className="relative h-[50vh] lg:h-[60vh] overflow-hidden">
          <Image
            src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
            alt={anime.title}
            className="w-full h-full object-cover object-center filter brightness-90 blur-[2px] scale-105 transition-all duration-300"
            width={500}
            height={300}
            style={{ objectFit: 'cover' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(0,0,0,0.95),transparent_70%)]" />
          </div>
          <div className="absolute bottom-8 left-8 right-8 text-white space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              {anime.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(anime.status)}`}>
                {getStatusText(anime.status)}
              </span>
              {anime.episodes && (
                <span className="font-geist-mono text-sm bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                  Episodes : {anime.episodes}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="p-8 space-y-6">
          <div>
            <h3 className="text-2xl font-semibold mb-4">Synopsis</h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              {anime.synopsis}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
