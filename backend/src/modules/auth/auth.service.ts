import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { env } from '../../config/env.js'
import { authRepository } from './auth.repository.js'
import type { RegisterInput, LoginInput } from './auth.schema.js'
import { createHash } from 'node:crypto'
import { refreshTokenRepository } from './refreshToken.repository.js'
import { AppError } from '../../shared/AppError.js'

const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

type TokenPayload = { sub: string; role: string }

function signAccess(payload: TokenPayload) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_TTL,
  } as jwt.SignOptions)
}

function signRefresh(payload: TokenPayload) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.REFRESH_TOKEN_TTL,
  } as jwt.SignOptions)
}

export const authService = {
  async register(input: RegisterInput) {
    const existing = await authRepository.findByEmail(input.email)
    if (existing) {
      throw AppError.conflict('Email already registered', 'EMAIL_TAKEN')
    }

    const passwordHash = await argon2.hash(input.password)
    const user = await authRepository.create({
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      secondName: input.secondName,
      phone: input.phone,
    })
    return issueTokens(user.id, user.role)
  },

  async login(input: LoginInput) {
    const user = await authRepository.findByEmail(input.email)
    if (!user) {
      throw AppError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS')
    }

    const ok = await argon2.verify(user.passwordHash, input.password)
    if (!ok) {
      throw AppError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS')
    }

    return issueTokens(user.id, user.role)
  },

  async refresh(refreshToken: string) {
    const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as TokenPayload
    const tokenHash = hashToken(refreshToken)
    const stored = await refreshTokenRepository.findByHash(tokenHash)
    if (!stored) {
      throw AppError.unauthorized('Refresh token revoked', 'INVALID_REFRESH')
    }
    await refreshTokenRepository.deleteByHash(tokenHash)
    return issueTokens(payload.sub, payload.role)
  },

  async logout(refreshToken: string | undefined) {
    if (!refreshToken) {
      return
    }
    await refreshTokenRepository.deleteByHash(hashToken(refreshToken))
  },
}

async function issueTokens(userId: string, role: string) {
  const payload: TokenPayload = { sub: userId, role }
  const accessToken = signAccess(payload)
  const refreshToken = signRefresh(payload)

  await refreshTokenRepository.create(
    userId,
    hashToken(refreshToken),
    new Date(Date.now() + REFRESH_TTL_MS),
  )

  return { accessToken, refreshToken }
}