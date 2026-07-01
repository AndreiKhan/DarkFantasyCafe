import { tokenStore } from './tokenStore'

const BASE_URL = import.meta.env.VITE_API_URL ?? ''

let refreshPromise: Promise<boolean> | null = null

async function tryRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(async (res) => {
        if (!res.ok) {
          tokenStore.set(null)
          return false
        }
        const data = (await res.json()) as { accessToken: string }
        tokenStore.set(data.accessToken)
        return true
      })
      .catch(() => {
        tokenStore.set(null)
        return false
      })
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const token = tokenStore.get()

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (response.status === 401 && retry && endpoint !== '/auth/refresh') {
    const ok = await tryRefresh()
    if (ok) {
      return apiClient<T>(endpoint, options, false)
    }
  }

  if (!response.ok) {
    // throw new Error(`API error ${response.status}`)
    let message = `API error ${response.status}`
    let code: string | undefined
    try {
      const body = (await response.json()) as { message?: string; code?: string }
      if (body?.message) {
        message = body.message
      }
      code = body?.code
    } catch {
      //
    }
    const error = new Error(message) as Error & { status?: number; code?: string }
    error.status = response.status
    error.code = code
    throw error
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}