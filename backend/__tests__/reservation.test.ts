import type { FastifyInstance } from 'fastify'
import {
  api,
  getTestApp,
  registerTestUser,
  cleanupTestUser,
  prisma,
  teardownAll,
} from './helpers.js'

describe('reservation', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await getTestApp()
  })

  afterAll(async () => {
    await teardownAll()
  })

  it('возвращает только подтверждённые брони для GET /reservation/mine', async () => {
    const { user, accessToken } = await registerTestUser(app)
    const table = await prisma.table.findFirst({ where: { isActive: true } })

    if (!table) {
      throw new Error('В базе нет активных столов')
    }

    const startsAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const endsAt = new Date(startsAt.getTime() + 2 * 60 * 60 * 1000)

    await prisma.reservation.createMany({
      data: [
        {
          userId: user.id,
          tableId: table.id,
          startsAt,
          endsAt,
          guests: 2,
          status: 'CONFIRMED',
          totalAmount: 1500,
        },
        {
          userId: user.id,
          tableId: table.id,
          startsAt: new Date(startsAt.getTime() + 4 * 60 * 60 * 1000),
          endsAt: new Date(endsAt.getTime() + 4 * 60 * 60 * 1000),
          guests: 2,
          status: 'DRAFT',
          totalAmount: 500,
        },
      ],
    })

    const response = await api(app)
      .get('/api/reservation/mine?lang=ru')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)

    expect(response.body).toHaveLength(1)
    expect(response.body[0]).toMatchObject({ status: 'CONFIRMED', totalAmount: 1500 })

    await cleanupTestUser(user.id)
  })

  it('отклоняет GET /reservation/tables с временем в прошлом', async () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const date = yesterday.toISOString().slice(0, 10)

    const response = await api(app)
      .get(`/api/reservation/tables?lang=ru&date=${date}&start=18:00&duration=60&guests=2`)
      .expect(400)

    expect(response.body.code).toBe('RESERVATION_IN_PAST')
  })

  it('отклоняет GET /reservation/tables если бронь выходит за рабочий день', async () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const date = tomorrow.toISOString().slice(0, 10)

    const response = await api(app)
      .get(`/api/reservation/tables?lang=ru&date=${date}&start=23:00&duration=120&guests=2`)
      .expect(400)

    expect(response.body.code).toBe('RESERVATION_END_AFTER_HOURS')
  })
})
