import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateRange } from "@/lib/utils"

interface SeasonSelectorProps {
  season: string
  year: number
  onSeasonChange: (value: string) => void
  onYearChange: (value: number) => void
}

export function SeasonSelector({ season, year, onSeasonChange, onYearChange }: SeasonSelectorProps) {
  const seasons = ['winter', 'spring', 'summer', 'fall', 'upcoming']
    const yearRange = generateRange(new Date().getFullYear() - 6, new Date().getFullYear() + 1)

  return (
    <div className="flex justify-center gap-4 mb-8">
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
    </div>
  )
}
