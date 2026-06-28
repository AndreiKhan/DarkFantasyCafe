import { prisma } from '../../db/prisma.js'

export const authRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  },
  
  create(data: {
    email: string
    passwordHash: string
    firstName: string
    secondName: string
    phone: string
  }) {
    return prisma.user.create({ data })
  }
}