import { createContext, useContext, useState, type ReactNode } from 'react'
import AchievementToast from '../ui/AchievementToast'
import type { UnlockedAchievement } from './types'

const AchievementNotifyContext = createContext<(achievement: UnlockedAchievement) => void>(() => {})

export function AchievementToastProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState<UnlockedAchievement | null>(null)

  return (
    <AchievementNotifyContext.Provider value={setUnlocked}>
      {children}
      <AchievementToast achievement={unlocked} onClose={() => setUnlocked(null)} />
    </AchievementNotifyContext.Provider>
  )
}

export function useAchievementNotify() {
  return useContext(AchievementNotifyContext)
}
