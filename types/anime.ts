export interface Streaming {
  name: string
  url: string
  language?: string
}

export interface Pagination {
  last_visible_page: number
  has_next_page: boolean
  current_page: number
  items: {
    count: number
    total: number
    per_page: number
  }
}

export interface AnimeResponse {
  data: Anime[]
  pagination: Pagination
}

export interface Aired {
  from: string | null
  to: string | null
  prop: {
    from: {
      day: number | null
      month: number | null
      year: number | null
    }
    to: {
      day: number | null
      month: number | null
      year: number | null
    }
  }
  string: string
}

export interface Anime {
  mal_id: number
  title: string
  title_english: string | null
  type: string
  images: {
    jpg: {
      image_url: string
      large_image_url?: string
    }
  }
  synopsis: string
  url: string
  broadcast: {
    day: string
    time: string
  }
  status: string
  episodes?: number
  season?: string
  year?: number
  aired: Aired
  trailer: {
    youtube_id: string
    url: string
    embed_url: string
  }
  studios: {
    name: string
    url: string
  }[]
  streaming?: Streaming[]
}
