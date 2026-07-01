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

export interface CreateReservation {
  tableId: string
  date: string
  start: string
  duration: number
  guests: number
  dishes: { dishId: string; quantity: number }[]
}

export interface ReservationUserRef {
  id: string
  email: string
  firstName: string
  secondName: string
}

export interface ReservationTableRef {
  id: string
  number: number
}

export interface ReservationItemFull {
  type: 'TIME' | 'DISH' | 'EXTRA'
  dishId: string | null
  titleRu: string
  titleEn: string
  unitPrice: number
  quantity: number
}

export interface ReservationFull {
  id: string
  userId: string
  tableId: string
  startsAt: string
  endsAt: string
  guests: number
  status: ReservationStatus
  totalAmount: number
  user: ReservationUserRef
  table: ReservationTableRef
  items: ReservationItemFull[]
  createdAt: string
  updatedAt: string
}

export interface ReservationDishLine {
  dishId: string
  quantity: number
}

export interface CreateReservationAdmin {
  userId: string
  tableId: string
  startsAt: string
  endsAt: string
  guests: number
  status: ReservationStatus
  totalAmount: number
  dishes: ReservationDishLine[]
}

export type UpdateReservationAdmin = Partial<CreateReservationAdmin> & { id: string }

export interface ReservationDishOption {
  id: string
  nameRu: string
  nameEn: string
  price: number
}

export interface ReservationAdminOptions {
  users: ReservationUserRef[]
  tables: { id: string; number: number; zoneNameRu: string }[]
  dishes: ReservationDishOption[]
}