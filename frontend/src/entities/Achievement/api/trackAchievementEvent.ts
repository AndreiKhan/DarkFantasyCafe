import type { AchievementEventResult } from '../model/types'
import { apiClient } from '@/shared/api'

export function trackAchievementEvent(code: string, lang: 'ru' | 'en'): Promise<AchievementEventResult> {
  return apiClient<AchievementEventResult>(`/achievement/events?lang=${lang}`, {
    method: 'POST',
    body: JSON.stringify({ code }),
  })
}
