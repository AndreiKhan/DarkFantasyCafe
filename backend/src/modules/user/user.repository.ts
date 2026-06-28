import { prisma } from '../../db/prisma.js'

export const userRepository = {
  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        secondName: true,
        phone: true,
        image: true,
        role: true,
        createdAt: true,
      },
    })
  },
}