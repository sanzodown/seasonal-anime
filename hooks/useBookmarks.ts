import { useState, useEffect } from 'react'
import type { Anime } from '@/types/anime'
import Cookies from 'js-cookie'

const BOOKMARKS_KEY = 'anime-bookmarks-ids'
const BOOKMARK_DATA_PREFIX = 'anime-data-'
const COOKIE_EXPIRY = 365 // Expiration en jours

// Propriétés minimales nécessaires pour l'affichage des cartes
interface MinimalAnime {
  mal_id: number
  title: string
  title_english: string | null
  type: string
  status: string
  images: {
    jpg: {
      image_url: string
      large_image_url?: string
    }
  }
  synopsis: string
  aired: Anime['aired']
  broadcast?: Anime['broadcast']
  streaming?: Anime['streaming']
}

// Fonction pour réduire la taille des données d'anime
function minimizeAnime(anime: Anime): MinimalAnime {
  return {
    mal_id: anime.mal_id,
    title: anime.title,
    title_english: anime.title_english,
    type: anime.type,
    status: anime.status,
    images: anime.images,
    synopsis: anime.synopsis,
    aired: anime.aired,
    broadcast: anime.broadcast,
    streaming: anime.streaming
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<MinimalAnime[]>([])

  // Charge tous les favoris au démarrage
  useEffect(() => {
    // Récupérer la liste d'IDs depuis les cookies
    const idsString = Cookies.get(BOOKMARKS_KEY)
    if (!idsString) return

    try {
      const ids: number[] = JSON.parse(idsString)
      const loadedBookmarks: MinimalAnime[] = []

      // Récupérer les données pour chaque ID
      ids.forEach(id => {
        const animeData = Cookies.get(`${BOOKMARK_DATA_PREFIX}${id}`)
        if (animeData) {
          try {
            loadedBookmarks.push(JSON.parse(animeData))
          } catch (e) {
            console.error(`Failed to parse bookmark data for ID ${id}`, e)
          }
        }
      })

      setBookmarks(loadedBookmarks)
    } catch (e) {
      console.error('Failed to load bookmarks from cookies', e)
    }
  }, [])

  const addBookmark = (anime: Anime) => {
    // Vérifie si l'anime existe déjà
    if (bookmarks.some(a => a.mal_id === anime.mal_id)) {
      return
    }

    const minimalAnime = minimizeAnime(anime)

    // Ajouter l'anime à l'état local
    setBookmarks(prev => [...prev, minimalAnime])

    // Stocker les données individuelles
    Cookies.set(
      `${BOOKMARK_DATA_PREFIX}${anime.mal_id}`,
      JSON.stringify(minimalAnime),
      { expires: COOKIE_EXPIRY, sameSite: 'strict' }
    )

    // Mettre à jour la liste des IDs
    const currentIds = JSON.parse(Cookies.get(BOOKMARKS_KEY) || '[]')
    const newIds = [...currentIds, anime.mal_id]

    Cookies.set(
      BOOKMARKS_KEY,
      JSON.stringify(newIds),
      { expires: COOKIE_EXPIRY, sameSite: 'strict' }
    )
  }

  const removeBookmark = (malId: number) => {
    // Mettre à jour l'état local
    setBookmarks(prev => prev.filter(anime => anime.mal_id !== malId))

    // Supprimer les données individuelles
    Cookies.remove(`${BOOKMARK_DATA_PREFIX}${malId}`)

    // Mettre à jour la liste des IDs
    const currentIds = JSON.parse(Cookies.get(BOOKMARKS_KEY) || '[]')
    const newIds = currentIds.filter((id: number) => id !== malId)

    Cookies.set(
      BOOKMARKS_KEY,
      JSON.stringify(newIds),
      { expires: COOKIE_EXPIRY, sameSite: 'strict' }
    )
  }

  const isBookmarked = (malId: number) => {
    return bookmarks.some(anime => anime.mal_id === malId)
  }

  const clearBookmarks = () => {
    // Supprimer tous les cookies liés aux favoris
    const idsString = Cookies.get(BOOKMARKS_KEY)
    if (idsString) {
      try {
        const ids: number[] = JSON.parse(idsString)
        ids.forEach(id => {
          Cookies.remove(`${BOOKMARK_DATA_PREFIX}${id}`)
        })
      } catch (e) {
        console.error('Failed to parse bookmark IDs for removal', e)
      }
    }

    Cookies.remove(BOOKMARKS_KEY)
    setBookmarks([])
  }

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    clearBookmarks
  }
}
