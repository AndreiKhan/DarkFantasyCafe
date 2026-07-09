import './AchievementToast.scss'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { UnlockedAchievement } from '../model/types'

function AchievementToast({ achievement, onClose }: {
  achievement: UnlockedAchievement | null
  onClose: () => void
}) {
  const { t } = useTranslation('achievement')

  useEffect(() => {
    if (!achievement) {
      return
    }
    const timer = setTimeout(onClose, 6000)
    return () => clearTimeout(timer)
  }, [achievement, onClose])

  if (!achievement) {
    return null
  }

  const rarity = achievement.rarity[0] ?? 'COMMON'

  return (
    <div className='achievement-toast' role='status'>
      <button className='achievement-toast__close' type='button' onClick={onClose} aria-label={t('close')}>
        ×
      </button>
      <span className={`achievement-toast__rarity achievement-toast__rarity--${rarity.toLowerCase()}`}>
        {t(`rarity.${rarity}`, { defaultValue: rarity })}
      </span>
      <p className='achievement-toast__title'>
        {t('unlocked')}
      </p>
      <p className='achievement-toast__name'>
        {achievement.name}
      </p>
      <p className='achievement-toast__how'>
        {achievement.howToGet}
      </p>
      <p className='achievement-toast__bonuses'>
        +{achievement.bonuses} {t('bonuses')}
      </p>
    </div>
  )
}

export default AchievementToast
