export type NewsType = 'NEWS' | 'PERFORMANCE' | 'MONSTER'

export interface NewsCard {
  slug: string
  type: NewsType
  title: string
  shortDescription: string
  image: string | null
  startsAt: string | null
  publishedAt: string | null
}

export interface NewsDetail {
  slug: string
  type: NewsType
  title: string
  shortDescription: string
  body: string
  images: string[]
  startsAt: string | null
  endsAt: string | null
  publishedAt: string | null
}