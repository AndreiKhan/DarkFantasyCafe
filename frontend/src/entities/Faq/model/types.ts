export interface FaqCard {
  id: string
  title: string
  description: string
}

export interface FaqFull {
  id: string
  titleRu: string
  titleEn: string
  descriptionRu: string
  descriptionEn: string
  createdAt: string
  updatedAt: string
}

export type CreateFaq = Omit<FaqFull, 'id' | 'createdAt' | 'updatedAt'>

export type UpdateFaq = Partial<CreateFaq> & { id: string }
