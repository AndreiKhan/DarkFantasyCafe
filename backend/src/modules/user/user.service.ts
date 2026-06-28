import { userRepository } from './user.repository.js'
import { AppError } from '../../shared/AppError.js'

export const userService = {
  async getProfile(userId: string) {
    const user = await userRepository.findById(userId)

    if (!user) {
      throw AppError.notFound('User not found', 'USER_NOT_FOUND')
    }
    
    return user
  },
}