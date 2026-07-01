import argon2 from 'argon2'
import { userRepository, userRepositoryAdmin } from './user.repository.js'
import { refreshTokenRepository } from '../auth/refreshToken.repository.js'
import { AppError } from '../../shared/AppError.js'
import type { UserCreate, UserUpdate } from './user.schema.js'

export const userService = {
  async getProfile(userId: string) {
    const user = await userRepository.findById(userId)

    if (!user) {
      throw AppError.notFound('User not found', 'USER_NOT_FOUND')
    }
    
    return user
  },
}

export const userAdmin = {
  async getAll() {
    return userRepositoryAdmin.findAll()
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
      phone: input.phone,
      image: input.image ?? null,
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
      phone: input.phone,
      image: input.image,
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
