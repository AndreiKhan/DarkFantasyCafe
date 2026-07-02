export interface AuthResponse {
  accessToken: string
}

export interface AuthUser {
  sub: string
  role: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  email: string
  password: string
  firstName: string
  secondName: string
  phone?: string
}
