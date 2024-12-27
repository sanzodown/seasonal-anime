import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateRange(min: number, max: number): number[] {
  return Array.from(
    { length: max - min + 1 },
    (_, i) => max - i
  )
}

export function getCurrentSeason(): string {
  const currentMonth = new Date().getMonth()
  const seasons = ["winter", "spring", "summer", "fall"]
  return seasons[Math.floor(currentMonth / 3)]
}

export function formatDay(day: string): string {
  return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()
}

export const STATUS_COLORS = {
  "Currently Airing": "bg-green-500",
  "Finished Airing": "bg-red-500",
  "Not yet aired": "bg-yellow-500",
} as const

export function formatBroadcastTime(broadcastDay: string, broadcastTime: string): string {
  // Convert day to number (0 = Sunday, 1 = Monday, etc.)
  const dayMap: { [key: string]: number } = {
    'Sundays': 0, 'Mondays': 1, 'Tuesdays': 2, 'Wednesdays': 3,
    'Thursdays': 4, 'Fridays': 5, 'Saturdays': 6
  }

  // Get current date
  const now = new Date()
  const currentDay = now.getDay()

  // Calculate days until next broadcast
  let daysUntil = dayMap[broadcastDay] - currentDay
  if (daysUntil <= 0) daysUntil += 7 // If the day has passed this week, get next week's date

  // Create date object for next broadcast (in JST)
  const [hours, minutes] = broadcastTime.split(':').map(Number)
  const broadcastDate = new Date(now)
  broadcastDate.setDate(broadcastDate.getDate() + daysUntil)
  broadcastDate.setHours(hours, minutes)

  // Convert JST to UTC
  const jstOffset = 9 * 60 // JST is UTC+9
  const localOffset = broadcastDate.getTimezoneOffset()
  const totalOffset = jstOffset + localOffset
  broadcastDate.setMinutes(broadcastDate.getMinutes() - totalOffset)

  // Calculate GMT offset
  const gmtOffset = -localOffset / 60 // Convert minutes to hours
  const gmtString = `GMT${gmtOffset >= 0 ? '+' : ''}${gmtOffset}`

  // Format the date for display
  const dateNumber = broadcastDate.getDate()
  const monthName = broadcastDate.toLocaleString('en-us', { month: 'long' }).toLowerCase()
  const formattedTime = broadcastDate.toLocaleString('en-us', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })

  return `${dateNumber} ${monthName} at ${formattedTime} (${gmtString})`
}

export function getSeasonStartDate(season: string, year: number): Date {
  const seasonStartMonths = {
    'winter': 0,  // January
    'spring': 3,  // April
    'summer': 6,  // July
    'fall': 9     // October
  } as const

  return new Date(year, seasonStartMonths[season as keyof typeof seasonStartMonths], 1)
}

export function formatSeasonStart(season: string, year: number): string {
  if (!season) {
    return `No date: ~ ${new Date().toLocaleString('en-us', { month: 'long' }).toLowerCase()}`
  }

  const seasonStartMonths = {
    'winter': 0,  // January
    'spring': 3,  // April
    'summer': 6,  // July
    'fall': 9     // October
  } as const

  // Get the month name for the season
  const monthIndex = seasonStartMonths[season.toLowerCase() as keyof typeof seasonStartMonths]
  const monthName = new Date(2000, monthIndex).toLocaleString('en-us', { month: 'long' }).toLowerCase()

  if (!year) {
    return `No date: ~ ${monthName}`
  }

  // For upcoming seasons, don't show the specific day
  const now = new Date()
  const seasonDate = new Date(year, monthIndex)
  if (seasonDate > now) {
    return `~ ${monthName} ${year}`
  }

  return `1 ${monthName} ${year}`
}
