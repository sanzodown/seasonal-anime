import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Aired } from "@/types/anime"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1 // getMonth() returns 0-11

  if (month >= 1 && month <= 3) return 'winter'
  if (month >= 4 && month <= 6) return 'spring'
  if (month >= 7 && month <= 9) return 'summer'
  return 'fall'
}

function convertJSTtoLocal(jstTimeStr: string, dayOfWeek: string): { time: string; day: string } {
  // Create a date object for the next occurrence of the broadcast day
  const now = new Date()
  const daysMap: { [key: string]: number } = {
    'sundays': 0, 'mondays': 1, 'tuesdays': 2, 'wednesdays': 3,
    'thursdays': 4, 'fridays': 5, 'saturdays': 6
  }

  const targetDay = daysMap[dayOfWeek.toLowerCase()]
  if (targetDay === undefined) return { time: jstTimeStr, day: dayOfWeek }

  let daysUntilBroadcast = targetDay - now.getDay()
  if (daysUntilBroadcast <= 0) daysUntilBroadcast += 7

  // Parse the JST time
  const [hours, minutes] = jstTimeStr.replace('(JST)', '').trim().split(':').map(Number)
  if (isNaN(hours) || isNaN(minutes)) return { time: jstTimeStr, day: dayOfWeek }

  // Create a date object for the next broadcast in JST
  const jstDate = new Date(now)
  jstDate.setDate(jstDate.getDate() + daysUntilBroadcast)
  jstDate.setHours(hours, minutes)

  // Convert JST to UTC
  const jstOffset = 9 * 60 // JST is UTC+9
  const localOffset = jstDate.getTimezoneOffset()
  const totalOffset = jstOffset + localOffset

  // Create a new date object for local time
  const localDate = new Date(jstDate)
  localDate.setMinutes(localDate.getMinutes() - totalOffset)

  // If the conversion moves the date to the previous/next day, adjust the day name
  const localDay = localDate.getDay()
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  // Format the time in 12-hour format
  const timeString = localDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })

  return {
    time: timeString,
    day: days[localDay]
  }
}

export function formatBroadcastTime(day: string, time: string): string {
  // Convert JST to local time
  const { time: localTime, day: localDay } = convertJSTtoLocal(time, day)

  // Get current date
  const now = new Date()
  const today = now.getDay()

  // Map of days to numbers (0 = Sunday, 1 = Monday, etc.)
  const daysMap: { [key: string]: number } = {
    'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
    'thursday': 4, 'friday': 5, 'saturday': 6
  }

  // Get the target day number
  const targetDay = daysMap[localDay.toLowerCase()]
  if (targetDay === undefined) return 'Unknown'

  // Calculate days until next broadcast
  let daysUntil = targetDay - today
  if (daysUntil <= 0) daysUntil += 7

  // Return appropriate string based on days until
  if (daysUntil === 0) return `Today at ${localTime}`
  if (daysUntil === 1) return `Tomorrow at ${localTime}`
  return `${localDay} at ${localTime}`
}

function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  return months[month - 1] || ''
}

export function formatAiredDate(aired: Aired): string {
  if (!aired.from) return 'Release date unknown'

  const fromDate = new Date(aired.from)
  const now = new Date()

  // For dates in the future
  if (fromDate > now) {
    const day = aired.prop.from.day
    const month = aired.prop.from.month
    const year = aired.prop.from.year

    if (!month || !year) return 'Release date unknown'

    const monthName = getMonthName(month)
    if (!day) return `${monthName} ${year}`

    return `${monthName} ${day}, ${year}`
  }

  // For currently airing or completed shows
  return aired.string || 'Release date unknown'
}

export function formatSeasonStart(season: string, year: number): string {
  const seasonStarts: { [key: string]: number } = {
    'winter': 1,  // January
    'spring': 4,  // April
    'summer': 7,  // July
    'fall': 10    // October
  }

  const monthNumber = seasonStarts[season.toLowerCase()]
  if (!monthNumber) return 'Unknown'

  const monthName = getMonthName(monthNumber)
  return `${monthName} ${year}`
}
