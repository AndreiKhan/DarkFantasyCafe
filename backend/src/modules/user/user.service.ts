import argon2 from 'argon2'
import { userRepository, userRepositoryAdmin } from './user.repository.js'
import { refreshTokenRepository } from '../auth/refreshToken.repository.js'
import { AppError } from '../../shared/AppError.js'
import type { UserCreate, UserSelfUpdate, UserUpdate, VerifyPasswordInput, ChangePasswordInput } from './user.schema.js'

export const userService = {
  async getProfile(profileId: string, viewerId: string | null) {
    const isOwn = viewerId === profileId

    const user = isOwn
      ? await userRepository.findById(profileId)
      : await userRepository.findByPublicId(profileId)

    if (!user) {
      throw AppError.notFound('User not found', 'USER_NOT_FOUND')
    }

    return user
  },

  async updateProfile(userId: string, input: UserSelfUpdate) {
    const existing = await userRepository.findById(userId)

    if (!existing) {
      throw AppError.notFound('User not found', 'USER_NOT_FOUND')
    }
    
    return userRepository.updateProfile(userId, {
      firstName: input.firstName,
      secondName: input.secondName,
      email: input.email,
      phone: input.phone === '' ? null : input.phone,
      image: input.image,
      bio: input.bio,
    })
  },

  async verifyPassword(userId: string, input: VerifyPasswordInput) {
    const user = await userRepository.findPasswordHash(userId)
    if (!user) {
      throw AppError.notFound('User not found', 'USER_NOT_FOUND')
    }

    const ok = await argon2.verify(user.passwordHash, input.password)
    if (!ok) {
      throw AppError.unauthorized('Invalid password', 'INVALID_PASSWORD')
    }

    return { ok: true }
  },

  async changePassword(userId: string, input: ChangePasswordInput) {
    await userService.verifyPassword(userId, { password: input.currentPassword })
    const passwordHash = await argon2.hash(input.newPassword)
    await userRepository.updatePassword(userId, passwordHash)
    await refreshTokenRepository.deleteByUser(userId)
    return { ok: true }
  },
}

export const userAdmin = {
  async getAll(keywordSearch?: string) {
    return userRepositoryAdmin.findAll(keywordSearch)
  },

  async create(input: UserCreate) {
    const existing = await userRepositoryAdmin.findByEmail(input.email)

    if (existing) {
      throw AppError.conflict('Email already registered', 'EMAIL_TAKEN')
    }

    const passwordHash = await argon2.hash(input.password)
    return userRepositoryAdmin.create({
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      secondName: input.secondName,
      phone: input.phone || null,
      image: input.image ?? null,
      bio: input.bio ?? null,
      role: input.role,
    })
  },

  async update(id: string, input: UserUpdate) {
    const existing = await userRepositoryAdmin.findById(id)

    if (!existing) {
      throw AppError.notFound('User not found', 'USER_NOT_FOUND')
    }

    if (input.removeRefreshTokenIds?.length) {
      await refreshTokenRepository.deleteByIds(id, input.removeRefreshTokenIds)
    }

    return userRepositoryAdmin.update(id, {
      email: input.email,
      firstName: input.firstName,
      secondName: input.secondName,
      phone: input.phone === '' ? null : input.phone,
      image: input.image,
      bio: input.bio,
      role: input.role,
    })
  },

  async remove(id: string) {
    const existing = await userRepositoryAdmin.findById(id)

    if (!existing) {
      throw AppError.notFound('User not found', 'USER_NOT_FOUND')
    }

    return userRepositoryAdmin.remove(id)
  },
}
