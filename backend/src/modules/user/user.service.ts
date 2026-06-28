import { userRepository } from './user.repository.js'

export const userService = {
  async getProfile(userId: string) {
    const user = await userRepository.findById(userId)

    if (!user) {
      throw new Error('USER_NOT_FOUND')
    }
    
    return user
  },
}