export type NewsType = 'NEWS' | 'PERFORMANCE' | 'MONSTER'

export type NewsStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export interface NewsCard {
  slug: string
  type: NewsType
  title: string
  shortDescription: string
  image: string | null
  startsAt: string | null
  endsAt: string | null
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

export interface NewsFull {
  id: string
  slug: string
  type: NewsType
  status: NewsStatus
  titleRu: string
  titleEn: string
  shortDescriptionRu: string
  shortDescriptionEn: string
  bodyRu: string
  bodyEn: string
  images: string[]
  startsAt: string | null
  endsAt: string | null
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export type CreateNews = Omit<NewsFull, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'>

export type UpdateNews = Partial<CreateNews> & { id: string }
