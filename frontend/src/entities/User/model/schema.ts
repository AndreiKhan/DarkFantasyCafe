import { z } from 'zod'

export const userFormSchema = z.object({ 
  email: z.string().email('Некорректный email'),
  password: z.union([z.string().min(8, 'Минимум 8 символов'), z.literal('')]),
  firstName: z.string().min(1, 'Укажите имя'),
  secondName: z.string().min(1, 'Укажите фамилию'),
  phone: z.union([z.string().regex(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, 'Формат: +7 (999) 123-45-67'), z.literal('')]),
  image: z.string(),
  bio: z.string(),
  role: z.enum(['USER', 'ADMIN', 'MASTER']),
})
