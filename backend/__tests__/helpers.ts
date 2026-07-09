import { randomUUID } from 'node:crypto'
import request from 'supertest'
import type { FastifyInstance } from 'fastify'
import { buildApp } from '../src/app.js'
import { prisma } from '../src/db/prisma.js'

let app: FastifyInstance | null = null

export async function getTestApp() {
  if (!app) {
    app = buildApp({ logger: false })
    await app.ready()
  }
  return app
}

export async function destroyTestApp() {
  if (app) {
    await app.close()
    app = null
  }
}

let prismaDisconnected = false

export async function teardownAll() {
  await destroyTestApp()
  if (!prismaDisconnected) {
    prismaDisconnected = true
    await prisma.$disconnect()
  }
}

export function api(app: FastifyInstance) {
  return request(app.server)
}

export const TEST_PASSWORD = 'password123'

export async function registerTestUser(app: FastifyInstance) {
  const suffix = randomUUID()
  const payload = {
    email: `integration-${suffix}@test.local`,
    password: TEST_PASSWORD,
    firstName: 'Test',
    secondName: 'User',
  }

  const response = await api(app).post('/auth/register').send(payload).expect(200)
  const user = await prisma.user.findUnique({ where: { email: payload.email } })

  if (!user) {
    throw new Error('Пользователь не найден в бд')
  }

  return { user, accessToken: response.body.accessToken as string, password: TEST_PASSWORD }
}

export async function loginUser(app: FastifyInstance, email: string, password: string) {
  const response = await api(app).post('/auth/login').send({ email, password }).expect(200)
  return { accessToken: response.body.accessToken as string }
}

export async function cleanupTestUser(userId: string) {
  await prisma.reservation.deleteMany({ where: { userId } })
  await prisma.refreshToken.deleteMany({ where: { userId } })
  await prisma.user.delete({ where: { id: userId } }).catch(() => undefined)
}

export { prisma }
