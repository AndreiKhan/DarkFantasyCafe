export interface ContactRequestFull {
  id: string
  contact: string
  message: string
  createdAt: string
}

export type CreateContactRequest = Omit<ContactRequestFull, 'id' | 'createdAt'>
