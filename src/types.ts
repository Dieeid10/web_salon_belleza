export type Booking = { 
    professional_id: number
    service_ids: number[] 
    starts_at: string 
    first_name?: string 
    last_name?: string 
    phone?: string 
}

export interface Service {
  id: number
  name: string
  description: string | null
  price: string
  duration_minutes: number
  visible_online: boolean
  is_active: boolean
}

export interface Professional {
  id: number
  name: string
  profile_id: string | null
  is_active: boolean
}

export interface Discount {
  id: number
  name: string
  type: "service" | "gossip"
  percentage: string
  service_id: number | null
  start_date: string | null
  end_date: string | null
  is_active: boolean
}

export interface AvailabilityQuery {
  day: string // YYYY-MM-DD
  professional_id: number
  service_ids: number[]
}

export interface Availability {
  professional_id: number
  date: string // YYYY-MM-DD
  duration_minutes: number
  available_starts: string[] // Fecha y hora con zona horaria
}

export interface BookingSelection {
  professional_id: number
  service_ids: number[]
  starts_at: string
}

export interface GuestBooking extends BookingSelection {
  first_name: string
  last_name: string
  phone: string
}

export interface AccountBooking extends BookingSelection {
  phone?: string | null
}

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "absent"

export interface AppointmentDetail {
  service_id: number
  name: string
  duration_minutes: number
  price: string
}

export interface Appointment {
  id: number
  professional_id: number
  starts_at: string
  ends_at: string
  status: AppointmentStatus
  total: string
  details: AppointmentDetail[]
}

// PATCH /clients/me
export interface ProfileChanges {
  first_name: string
  last_name: string
  phone: string | null
}

// Respuesta de GET /clients/me y PATCH /clients/me
export interface AccountProfile extends ProfileChanges {
  id: number
  email: string | null
  is_active: boolean
  created_at: string
}