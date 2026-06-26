export interface AvailabilityTable {
  id: string
  number: number
  capacity: number
  x: number
  y: number
  available: boolean
  fitsGuests: boolean
}

export interface AvailabilityZone {
  id: string
  slug: string
  name: string
  pricePerHour: number
  price: number
  tables: AvailabilityTable[]
}

export interface AvailabilityResponse {
  window: {
    startsAt: string
    endsAt: string
    duration: number
    guests: number
  }
  zones: AvailabilityZone[]
}

export interface AvailabilityParams {
  date: string
  start: string
  duration: number
  guests: number
}

export type ReservationStatus = 'DRAFT' | 'PENDING_PAYMENT' | 'CONFIRMED' | 'CANCELLED'

export interface ReservationItem {
  type: 'TIME' | 'DISH' | 'EXTRA'
  title: string
  unitPrice: number
  quantity: number
}

export interface ReservationSummary {
  id: string
  status: ReservationStatus
  startsAt: string
  endsAt: string
  guests: number
  totalAmount: number
  table: { number: number; zone: string }
  items: ReservationItem[]
}

export interface CreateReservationInput {
  tableId: string
  date: string
  start: string
  duration: number
  guests: number
  dishes: { dishId: string; quantity: number }[]
}