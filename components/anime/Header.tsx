import { Moon, Sun } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface HeaderProps {
  isDarkMode: boolean
  onToggleTheme: () => void
}

export function Header({ isDarkMode, onToggleTheme }: HeaderProps) {
  return (
    <header className="flex justify-between items-center mb-8">
      <div className="flex items-center">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          className="mr-4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="24" cy="24" r="20" className="fill-current text-purple-500" />
          <path
            d="M18 28C19.5 31 22 33 24 33C26 33 28.5 31 30 28"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="18" cy="20" r="2" fill="white" />
          <circle cx="30" cy="20" r="2" fill="white" />
        </svg>
        <h1 className="text-3xl font-bold text-white font-geist-mono tracking-tight bg-gradient-to-r from-purple-500/80 to-purple-700/80 bg-clip-text text-transparent">
          Seasonal Anime
        </h1>
      </div>
      <Button variant="ghost" size="icon" onClick={onToggleTheme}>
        {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
      </Button>
    </header>
  )
} 
