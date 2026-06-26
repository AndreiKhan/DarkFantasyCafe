import { randomUUID } from 'node:crypto'
import { env } from '../config/env.js'

const API = 'https://api.yookassa.ru/v3'

function authHeader() {
  if (!env.YOOKASSA_SHOP_ID || !env.YOOKASSA_SECRET_KEY) {
    throw new Error('PAYMENTS_NOT_CONFIGURED')
  }

  const creds = Buffer.from(`${env.YOOKASSA_SHOP_ID}:${env.YOOKASSA_SECRET_KEY}`).toString('base64')

  return `Basic ${creds}`
}

export interface YooKassaPayment {
  id: string
  status: 'pending' | 'waiting_for_capture' | 'succeeded' | 'canceled'
  paid: boolean
  confirmation?: { confirmation_url?: string }
  metadata?: Record<string, string>
}

export async function createYooKassaPayment(input: {
  amount: number
  description: string
  returnUrl: string
  metadata: Record<string, string>
}): Promise<YooKassaPayment> {
  const response = await fetch(`${API}/payments`, {
    method: 'POST',
    headers: {
      Authorization: authHeader(),
      'Idempotence-Key': randomUUID(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: { value: `${input.amount}.00`, currency: 'RUB' },
      capture: true,
      confirmation: { type: 'redirect', return_url: input.returnUrl },
      description: input.description,
      metadata: input.metadata,
    }),
  })
  if (!response.ok) {
    throw new Error('YOOKASSA_ERROR')
  }
  return response.json() as Promise<YooKassaPayment>
}

export async function getYooKassaPayment(id: string): Promise<YooKassaPayment> {
  const response = await fetch(`${API}/payments/${id}`, {
    headers: { Authorization: authHeader() },
  })
  if (!response.ok) {
    throw new Error('YOOKASSA_ERROR')
  }
  return response.json() as Promise<YooKassaPayment>
}