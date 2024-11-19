import { cn } from "@/lib/utils"

export function LoadingAnimation() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="relative h-[500px] rounded-xl overflow-hidden bg-gray-800/50 animate-pulse"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/50">
            <div className="absolute bottom-6 left-6 right-6 space-y-3">
              <div className="h-8 bg-gray-700/50 rounded-lg w-3/4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-700/50 rounded w-full" />
                <div className="h-4 bg-gray-700/50 rounded w-5/6" />
                <div className="h-4 bg-gray-700/50 rounded w-4/6" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
