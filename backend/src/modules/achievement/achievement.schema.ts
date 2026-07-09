import { z } from 'zod'

export const achievementEventSchema = z.object({
  code: z.string().min(1),
})

export type AchievementEvent = z.infer<typeof achievementEventSchema>
