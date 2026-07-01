export interface UserProfile {
  id: string
  email: string
  firstName: string
  secondName: string
  phone: string
  image: string | null
  role: string
  createdAt: string
}

export type UserRole = 'USER' | 'ADMIN'

export interface RefreshTokenInfo {
  id: string
  createdAt: string
  expiresAt: string
}

export interface UserFull {
  id: string
  email: string
  firstName: string
  secondName: string
  phone: string
  image: string | null
  role: UserRole
  refreshTokens: RefreshTokenInfo[]
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
  role: UserRole
}

export type UpdateUser = Partial<Omit<CreateUser, 'password'>> & {
  id: string
  removeRefreshTokenIds?: string[]
}
