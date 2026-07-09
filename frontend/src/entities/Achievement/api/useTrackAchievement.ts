import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { trackAchievementEvent } from './trackAchievementEvent'
import { useAchievementNotify } from '../model/AchievementToastContext'

export function useTrackAchievement() {
  const { i18n } = useTranslation()
  const notify = useAchievementNotify()

  return useMutation({
    mutationFn: (code: string) => trackAchievementEvent(code, i18n.language === 'en' ? 'en' : 'ru'),
    onSuccess: (result) => {
      if (result.unlocked && result.achievement) {
        notify(result.achievement)
      }
    },
  })
}
