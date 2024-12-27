import Link from 'next/link'

export function Header() {
  return (
    <header className="flex justify-between items-center mb-8">
      <Link href="/" className="flex items-center group">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          className="mr-4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="24" cy="24" r="20" className="fill-current text-purple-500 transition-colors group-hover:text-purple-600" />
          <path
            d="M18 28C19.5 31 22 33 24 33C26 33 28.5 31 30 28"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="18" cy="20" r="2" fill="white" />
          <circle cx="30" cy="20" r="2" fill="white" />
        </svg>
        <h1 className="text-3xl font-bold text-white font-geist-mono tracking-tight bg-gradient-to-r from-purple-500/80 to-purple-700/80 bg-clip-text text-transparent transition-all group-hover:from-purple-600/80 group-hover:to-purple-800/80">
          Pewpewlazer&apos;s seasonal anime
        </h1>
      </Link>
    </header>
  )
}
