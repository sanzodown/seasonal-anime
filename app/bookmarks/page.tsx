'use client'

import { useBookmarks } from '@/hooks/useBookmarks'
import { AnimeCard } from '@/components/anime/AnimeCard'
import { Button } from '@/components/ui/button'
import { Bookmark, Home, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function BookmarksPage() {
  const { bookmarks, clearBookmarks } = useBookmarks()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between bg-black/30 p-4 rounded-lg backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back</span>
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent">
              My Bookmarked Anime
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="gap-2">
              <Bookmark className="h-4 w-4 text-yellow-400" />
              <span className="font-medium">
                {bookmarks.length} {bookmarks.length === 1 ? 'Bookmark' : 'Bookmarks'}
              </span>
            </Button>

            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2" disabled={bookmarks.length === 0}>
                  <Trash2 className="h-4 w-4" />
                  <span className="font-medium">Clear All</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will remove all your bookmarked anime.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearBookmarks}>Confirm</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-24 bg-black/20 rounded-lg backdrop-blur-sm">
            <Bookmark className="h-16 w-16 mx-auto text-gray-400 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-300 mb-4">
              No bookmarked anime yet
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Start bookmarking your favorite anime to find them here easily.
            </p>
            <Link href="/">
              <Button className="gap-2" size="lg">
                <Home className="h-5 w-5" />
                <span>Explore Anime</span>
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {bookmarks.map(anime => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
