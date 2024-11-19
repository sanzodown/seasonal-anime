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
