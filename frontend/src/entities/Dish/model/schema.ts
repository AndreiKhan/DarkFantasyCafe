import { z } from 'zod'

export const dishFormSchema = z.object({
  nameRu: z.string().min(1, 'Укажите название'),
  nameEn: z.string().min(1, 'Name is required'),
  descriptionRu: z.string().min(1, 'Укажите описание'),
  descriptionEn: z.string().min(1, 'Description is required'),
  price: z.coerce.number().int('Целое число').min(0, 'Цена не может быть отрицательной'),
  images: z.array(z.string().url('Некорректный URL')),
  categoryId: z.string().min(1, 'Выберите категорию'),
  tagIds: z.array(z.string()),
  allergenIds: z.array(z.string()),
})
