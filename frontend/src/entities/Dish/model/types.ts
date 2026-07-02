export interface Dish {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: DishRef
  tags: DishRef[]
  allergens: DishRef[]
}

export interface DishFilters {
  keywordSearch?: string
  category?: string
  tags: string[]
  allergens: string[]
  sort?: 'price_asc' | 'price_desc'
}

export interface DishRef {
  slug: string
  name: string
}

export interface DishFilterOptions {
  categories: DishRef[]
  tags: DishRef[]
  allergens: DishRef[]
}

export interface DishOptionRef {
  id: string
  slug: string
  nameRu: string
  nameEn: string
}

export interface DishFull {
  id: string
  nameRu: string
  nameEn: string
  descriptionRu: string
  descriptionEn: string
  price: number
  images: string[]
  categoryId: string
  category: DishOptionRef
  tags: DishOptionRef[]
  allergens: DishOptionRef[]
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface CreateDish {
  nameRu: string
  nameEn: string
  descriptionRu: string
  descriptionEn: string
  price: number
  images: string[]
  categoryId: string
  tagIds: string[]
  allergenIds: string[]
}

export type UpdateDish = Partial<CreateDish> & { id: string }

export interface DishAdminOptions {
  categories: DishOptionRef[]
  tags: DishOptionRef[]
  allergens: DishOptionRef[]
}
