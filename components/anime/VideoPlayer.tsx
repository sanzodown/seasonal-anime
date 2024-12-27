import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

interface VideoPlayerProps {
  isOpen: boolean
  onClose: () => void
  youtubeId: string
}

export function VideoPlayer({ isOpen, onClose, youtubeId }: VideoPlayerProps) {
  if (!youtubeId) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[80vw] p-0 bg-black/90">
        <DialogTitle className="sr-only">
          Bande annonce
        </DialogTitle>
        <div className="aspect-video w-full">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
