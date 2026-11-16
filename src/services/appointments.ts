import { api } from '@services/api'
import { urls } from '@services/urls'
import type { AccountBooking, Appointment, Availability, GuestBooking } from '@/types'

export const appointmentsService = {
  getAvailability: (day: string, professionalId: number, serviceIds: number[], signal?: AbortSignal) => {
    const params = new URLSearchParams({ day, professional_id: String(professionalId) })
    for (const serviceId of serviceIds) {
      params.append('service_ids', String(serviceId))
    }

    return api.get<Availability>(urls.appointments.getAvailability, { params, signal })
  },

  createGuestAppointment: (data: GuestBooking) => api.post<Appointment, GuestBooking>(urls.appointments.createGuestAppointment, data),

  createAccountAppointment: (data: AccountBooking, token: string) =>
    api.post<Appointment, AccountBooking>(urls.appointments.createAccountAppointment, data, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  getMyAppointments: (token: string, signal?: AbortSignal) =>
    api.get<Appointment[]>(urls.appointments.getMyAppointments, {
      headers: { Authorization: `Bearer ${token}` },
      signal
    }),
}

