import type { FastifyInstance } from 'fastify'
import {
  api,
  getTestApp,
  registerTestUser,
  loginUser,
  cleanupTestUser,
  teardownAll,
  TEST_PASSWORD,
} from './helpers.js'

describe('auth', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await getTestApp()
  })

  afterAll(async () => {
    await teardownAll()
  })

  it('регистрирует пользователя и возвращает access token', async () => {
    const { user, accessToken } = await registerTestUser(app)
    expect(accessToken).toEqual(expect.any(String))
    await cleanupTestUser(user.id)
  })

  it('выполняет вход с корректными учётными данными', async () => {
    const { accessToken } = await loginUser(app, 'guest@baldgoose.ru', TEST_PASSWORD)
    expect(accessToken).toEqual(expect.any(String))
  })

  it('возвращает текущего пользователя для GET /auth/me', async () => {
    const { user, accessToken } = await registerTestUser(app)

    const response = await api(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)

    expect(response.body.user).toEqual(expect.objectContaining({
      sub: user.id,
      role: 'USER',
    }))

    await cleanupTestUser(user.id)
  })

  it('возвращает 401 для GET /auth/me без токена', async () => {
    await api(app).get('/api/auth/me').expect(401)
  })
})
