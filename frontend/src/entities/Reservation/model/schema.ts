import { z } from 'zod'
import { isWorkingSlotIso } from '@/shared/lib/time'

const workingSlot = z
  .string()
  .min(1, 'Укажите время')
  .refine(isWorkingSlotIso, 'Только рабочие часы (12:00–23:30), шаг 30 минут')

export const reservationFormSchema = z.object({
  userId: z.string().min(1, 'Выберите пользователя'),
  tableId: z.string().min(1, 'Выберите стол'),
  startsAt: workingSlot,
  endsAt: workingSlot,
  guests: z.coerce.number().int('Целое число').min(1, 'Минимум 1 гость'),
  status: z.enum(['DRAFT', 'PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED']),
  totalAmount: z.coerce.number().int('Целое число').min(0, 'Сумма не может быть отрицательной'),
  dishes: z.array(z.object({
    dishId: z.string().min(1, 'Выберите блюдо'),
    quantity: z.coerce.number().int('Целое число').min(1, 'Минимум 1').max(10, 'Максимум 10'),
  })),
})
