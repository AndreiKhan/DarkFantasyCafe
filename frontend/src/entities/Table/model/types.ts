export interface ZoneRef {
  id: string
  slug: string
  nameRu: string
  nameEn: string
  pricePerHour: number
}

export interface TableFull {
  id: string
  number: number
  zoneId: string
  zone: ZoneRef
  capacity: number
  x: number
  y: number
  isActive: boolean
}

export interface CreateTable {
  number: number
  zoneId: string
  capacity: number
  x: number
  y: number
  isActive: boolean
}

export type UpdateTable = Partial<CreateTable> & { id: string }

export interface TableAdminZones {
  zones: ZoneRef[]
}
