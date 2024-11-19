export interface Anime {
  mal_id: number
  title: string
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
  trailer: {
    youtube_id: string
    url: string
    embed_url: string
  }
  studios: {
    name: string
    url: string
  }[]
} 
