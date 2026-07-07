import { apiClient } from './client'

export function uploadImage(file: File): Promise<{ url: string }> {
  const formData = new FormData()
  formData.append('file', file)

  return apiClient<{ url: string }>('/upload', {
    method: 'POST',
    body: formData,
  })
}
