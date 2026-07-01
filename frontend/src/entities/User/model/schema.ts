import { z } from 'zod'

export const userFormSchema = z.object({ 
  email: z.string().email('Некорректный email'),
  password: z.union([z.string().min(8, 'Минимум 8 символов'), z.literal('')]),
  firstName: z.string().min(1, 'Укажите имя'),
  secondName: z.string().min(1, 'Укажите фамилию'),
  phone: z.string().min(5, 'Укажите телефон'),
  image: z.string(),
  role: z.enum(['USER', 'ADMIN']),
})
