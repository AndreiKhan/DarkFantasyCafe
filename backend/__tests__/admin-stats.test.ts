import type { FastifyInstance } from 'fastify'
import {
  api,
  getTestApp,
  registerTestUser,
  loginUser,
  cleanupTestUser,
  TEST_PASSWORD,
  teardownAll,
} from './helpers.js'

describe('admin stats', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await getTestApp()
  })

  afterAll(async () => {
    await teardownAll()
  })

  it('запрещает доступ к статистике обычным пользователям', async () => {
    const { user, accessToken } = await registerTestUser(app)

    await api(app)
      .get('/admin/stats')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(403)

    await cleanupTestUser(user.id)
  })

  it('возвращает статистику для admin из seed', async () => {
    const { accessToken } = await loginUser(app, 'admin@baldgoose.ru', TEST_PASSWORD)

    const response = await api(app)
      .get('/admin/stats?from=2020-01-01&to=2030-12-31')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)

    expect(response.body).toMatchObject({
      reservationsTotal: expect.any(Number),
      reservationsConfirmed: expect.any(Number),
      totalRevenue: expect.any(Number),
      reservationsByDay: expect.any(Array),
      popularDishes: expect.any(Array),
    })
  })
})
