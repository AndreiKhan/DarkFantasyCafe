export interface ProfileAchievement {
  id: string
  nameRu: string
  nameEn: string
  bonuses: number
  rarity: string[]
}

export interface UserProfile {
  id: string
  firstName: string
  secondName: string
  image: string | null
  bio: string | null
  createdAt: string
  email?: string
  phone?: string | null
  role?: string
  bonuses?: number
  achievements?: ProfileAchievement[]
}

export interface UpdateProfileInput {
  firstName?: string
  secondName?: string
  email?: string
  phone?: string
  image?: string | null
  bio?: string | null
}

export type UserRole = 'USER' | 'ADMIN' | 'MASTER'

export interface RefreshTokenInfo {
  id: string
  createdAt: string
  expiresAt: string
}

export interface CharacterInfo {
  id: string
  name: string
  level: number
  class: string
  race: string
}

export interface AchievementInfo {
  id: string
  nameRu: string
  nameEn: string
  status: string
  bonuses: number
}

export interface UserFull {
  id: string
  email: string
  firstName: string
  secondName: string
  phone: string | null
  image: string | null
  bio: string | null
  role: UserRole
  refreshTokens: RefreshTokenInfo[]
  characters: CharacterInfo[]
  achievements: AchievementInfo[]
  createdAt: string
  updatedAt: string
}

export interface CreateUser {
  email: string
  password: string
  firstName: string
  secondName: string
  phone: string
  image: string
  bio: string
  role: UserRole
}

export type UpdateUser = Partial<Omit<CreateUser, 'password'>> & {
  id: string
  removeRefreshTokenIds?: string[]
}
