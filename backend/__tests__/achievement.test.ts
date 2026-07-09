import type { FastifyInstance } from 'fastify'
import {
  api,
  getTestApp,
  registerTestUser,
  cleanupTestUser,
  prisma,
  teardownAll,
} from './helpers.js'

describe('achievement', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await getTestApp()
  })

  afterAll(async () => {
    await teardownAll()
  })

  it('разблокирует ачивку один раз и игнорирует повторные события', async () => {
    const { user, accessToken } = await registerTestUser(app)
    const code = `integration_${Date.now()}`

    const achievement = await prisma.achievements.create({
      data: {
        code,
        status: 'PUBLISHED',
        nameRu: 'тест',
        nameEn: 'test',
        howToGetRu: 'Тест',
        howToGetEn: 'Test',
        bonuses: 15,
        rarity: ['COMMON'],
      },
    })

    const first = await api(app)
      .post('/achievement/events?lang=ru')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ code })
      .expect(200)

    expect(first.body).toMatchObject({
      unlocked: true,
      achievement: { code, bonuses: 15 },
    })

    const updatedUser = await prisma.user.findUnique({ where: { id: user.id } })
    expect(updatedUser?.bonuses).toBe(15)

    const second = await api(app)
      .post('/achievement/events?lang=ru')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ code })
      .expect(200)

    expect(second.body).toEqual({ unlocked: false, achievement: null })

    await prisma.achievements.delete({ where: { id: achievement.id } })
    await cleanupTestUser(user.id)
  })
})
