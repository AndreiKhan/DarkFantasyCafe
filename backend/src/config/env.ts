import 'dotenv/config'
import { z } from 'zod'

const schema = z.object({
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  ACCESS_TOKEN_TTL: z.string().default('15m'),
  REFRESH_TOKEN_TTL: z.string().default('7d'),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  YOOKASSA_SHOP_ID: z.string(),
  YOOKASSA_SECRET_KEY: z.string(),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
})

export const env = schema.parse(process.env)