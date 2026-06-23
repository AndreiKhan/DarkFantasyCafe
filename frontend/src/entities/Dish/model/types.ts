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
