import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useEffect, useMemo, useCallback, useState } from "react"
import { getCurrentSeason } from "@/lib/utils"

interface SeasonSelectorProps {
  season: string
  year: number
  onSeasonChange: (value: string) => void
  onYearChange: (value: number) => void
}

export function SeasonSelector({ season, year, onSeasonChange, onYearChange }: SeasonSelectorProps) {
  const seasons = useMemo(() => ['winter', 'spring', 'summer', 'fall'], [])
  const currentYear = new Date().getFullYear()
  const currentSeason = getCurrentSeason()
  const [message, setMessage] = useState<string>('')

  const getMaxYear = useCallback(() => {
    const currentSeasonIndex = seasons.indexOf(currentSeason)
    if (currentSeasonIndex >= seasons.length - 2) {
      return currentYear
    }
    return currentYear + 1
  }, [currentYear, currentSeason, seasons])

  const allYears = useMemo(() => {
    return Array.from(
      { length: currentYear - 2010 + 1 },
      (_, i) => 2010 + i
    )
  }, [currentYear])

  const currentSeasonIndex = seasons.indexOf(season)
  const currentYearIndex = allYears.indexOf(year)

  const getFutureSeasons = useCallback((targetSeason: string, targetYear: number) => {
    let count = 0
    let tempYear = currentYear
    let tempSeason = currentSeason

    while (tempYear < targetYear || (tempYear === targetYear && seasons.indexOf(tempSeason) < seasons.indexOf(targetSeason))) {
      count++
      if (seasons.indexOf(tempSeason) === seasons.length - 1) {
        tempYear++
        tempSeason = seasons[0]
      } else {
        tempSeason = seasons[seasons.indexOf(tempSeason) + 1]
      }
    }

    return count
  }, [currentYear, currentSeason, seasons])

  const handleNavigate = useCallback((direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentSeasonIndex === 0) {
        if (currentYearIndex > 0) {
          onSeasonChange(seasons[seasons.length - 1])
          onYearChange(year - 1)
        }
      } else {
        onSeasonChange(seasons[currentSeasonIndex - 1])
      }
      setMessage('')
    } else {
      const nextSeason = currentSeasonIndex === seasons.length - 1 ? seasons[0] : seasons[currentSeasonIndex + 1]
      const nextYear = currentSeasonIndex === seasons.length - 1 ? year + 1 : year
      const maxYear = getMaxYear()

      if (nextYear > maxYear || (nextYear === maxYear && nextSeason !== seasons[0])) {
        setMessage('Cannot view more than 2 seasons in the future')
        return
      }

      const futureSeasons = getFutureSeasons(nextSeason, nextYear)
      if (futureSeasons > 2) {
        setMessage('Cannot view more than 2 seasons in the future')
        return
      }

      if (currentSeasonIndex === seasons.length - 1) {
        onSeasonChange(seasons[0])
        onYearChange(nextYear)
      } else {
        onSeasonChange(seasons[currentSeasonIndex + 1])
      }
      setMessage('')
    }
  }, [currentSeasonIndex, currentYearIndex, year, onSeasonChange, onYearChange, seasons, getFutureSeasons, getMaxYear])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') handleNavigate('prev')
      else if (event.key === 'ArrowRight') handleNavigate('next')
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [season, year, handleNavigate])

  useEffect(() => {
    const futureSeasons = getFutureSeasons(season, year)
    if (futureSeasons > 2) {
      const maxYear = getMaxYear()
      if (year > maxYear) {
        onYearChange(maxYear)
        onSeasonChange(seasons[0])
      }
    }
  }, [season, year, getFutureSeasons, getMaxYear, seasons, onYearChange, onSeasonChange])

  const visibleYears = useMemo(() => {
    const maxYear = getMaxYear()
    const validYears = allYears.filter(y => y <= maxYear)
    const yearIndex = validYears.indexOf(year)
    const start = Math.max(0, Math.min(yearIndex - 2, validYears.length - 5))
    return validYears.slice(start, Math.min(start + 5, validYears.length))
  }, [allYears, year, getMaxYear])

  return (
    <div className="flex flex-col items-center gap-6 mb-8">
      <div className="flex items-center gap-2 sm:gap-4 w-full max-w-[600px]">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleNavigate('prev')}
          disabled={currentSeasonIndex === 0 && currentYearIndex === 0}
          className={cn(
            "h-10 w-10 sm:h-14 sm:w-14 text-white shrink-0",
            currentSeasonIndex === 0 && currentYearIndex === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-white/5"
          )}
        >
          <ArrowLeft className="h-6 w-6 sm:h-10 sm:w-10 transition-transform duration-300 hover:scale-110" />
          <span className="sr-only">Previous Season</span>
        </Button>

        <div className="flex gap-1 sm:gap-2 bg-black/20 p-1 rounded-lg backdrop-blur-sm grow justify-center">
          {seasons.map((s) => (
            <Button
              key={s}
              onClick={() => {
                const futureSeasons = getFutureSeasons(s, year)
                if (futureSeasons > 2) {
                  setMessage('Cannot view more than 2 seasons in the future')
                  return
                }
                onSeasonChange(s)
                setMessage('')
              }}
              variant="ghost"
              className={cn(
                "px-2 sm:px-6 py-2 capitalize transition-all duration-300 relative text-sm sm:text-base grow sm:grow-0 group",
                season === s
                  ? "bg-white text-black hover:bg-white/90 hover:text-black/90 shadow-lg shadow-white/25"
                  : "text-white hover:bg-white/10",
                s === currentSeason && year === currentYear && "ring-2 ring-yellow-400/50 ring-offset-1 ring-offset-black/20"
              )}
            >
              {s}
              {s === currentSeason && year === currentYear && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2
                  bg-black/80 text-white text-xs px-2 py-1 rounded
                  opacity-0 group-hover:opacity-100 transition-opacity
                  pointer-events-none whitespace-nowrap backdrop-blur-sm">
                  Current Season
                </div>
              )}
            </Button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleNavigate('next')}
          disabled={currentSeasonIndex === seasons.length - 1 && currentYearIndex === allYears.length - 1}
          className={cn(
            "h-10 w-10 sm:h-14 sm:w-14 text-white shrink-0",
            currentSeasonIndex === seasons.length - 1 && currentYearIndex === allYears.length - 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-white/5"
          )}
        >
          <ArrowRight className="h-6 w-6 sm:h-10 sm:w-10 transition-transform duration-300 hover:scale-110" />
          <span className="sr-only">Next Season</span>
        </Button>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2 items-center bg-black/20 p-1 rounded-lg backdrop-blur-sm overflow-hidden max-w-full w-full sm:w-auto">
          {visibleYears.map((yearValue) => (
            <Button
              key={yearValue}
              onClick={() => {
                const futureSeasons = getFutureSeasons(season, yearValue)
                if (futureSeasons > 2) {
                  setMessage('Cannot view more than 2 seasons in the future')
                  return
                }
                onYearChange(yearValue)
                setMessage('')
              }}
              variant="ghost"
              className={cn(
                "px-4 py-2 transition-all duration-300 relative whitespace-nowrap text-sm sm:text-base group",
                year === yearValue
                  ? "bg-white text-black hover:bg-white/90 hover:text-black/90 shadow-lg shadow-white/25"
                  : "text-white hover:bg-white/10",
                yearValue === currentYear && "ring-2 ring-yellow-400/50 ring-offset-1 ring-offset-black/20"
              )}
            >
              {yearValue}
              {yearValue === currentYear && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2
                  bg-black/80 text-white text-xs px-2 py-1 rounded
                  opacity-0 group-hover:opacity-100 transition-opacity
                  pointer-events-none whitespace-nowrap backdrop-blur-sm">
                  Current Year
                </div>
              )}
            </Button>
          ))}
        </div>
        {message && (
          <div className="text-yellow-400 text-sm bg-yellow-400/10 px-4 py-2 rounded-lg">
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
