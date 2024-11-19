import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateRange } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect } from "react"

interface SeasonSelectorProps {
  season: string
  year: number
  onSeasonChange: (value: string) => void
  onYearChange: (value: number) => void
}

export function SeasonSelector({ season, year, onSeasonChange, onYearChange }: SeasonSelectorProps) {
  const seasons = ['winter', 'spring', 'summer', 'fall', 'upcoming']
  const yearRange = generateRange(new Date().getFullYear() - 6, new Date().getFullYear() + 1)

  const handlePreviousSeason = () => {
    const currentIndex = seasons.indexOf(season)
    if (currentIndex === 0) {
      onSeasonChange(seasons[seasons.length - 2]) // Skip 'upcoming'
      onYearChange(year - 1)
    } else {
      onSeasonChange(seasons[currentIndex - 1])
    }
  }

  const handleNextSeason = () => {
    const currentIndex = seasons.indexOf(season)
    if (currentIndex === seasons.length - 2) { // Before 'upcoming'
      onSeasonChange(seasons[0])
      onYearChange(year + 1)
    } else if (currentIndex === seasons.length - 1) { // 'upcoming'
      onSeasonChange(seasons[0])
      onYearChange(year)
    } else {
      onSeasonChange(seasons[currentIndex + 1])
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handlePreviousSeason()
      } else if (event.key === 'ArrowRight') {
        handleNextSeason()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [season, year])

  return (
    <div className="flex justify-center items-center gap-4 mb-8">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePreviousSeason}
        className="hover:bg-white/10 h-12 w-12 text-white"
      >
        <ChevronLeft className="h-10 w-10" />
      </Button>

      <Select value={season} onValueChange={onSeasonChange}>
        <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800">
          <SelectValue placeholder="Select season" />
        </SelectTrigger>
        <SelectContent>
          {seasons.map((s) => (
            <SelectItem key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {season !== 'upcoming' && (
        <Select
          value={year.toString()}
          onValueChange={(value) => onYearChange(parseInt(value))}
        >
          <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {yearRange.map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={handleNextSeason}
        className="hover:bg-white/10 h-12 w-12 text-white"
      >
        <ChevronRight className="h-10 w-10" />
      </Button>
    </div>
  )
}
