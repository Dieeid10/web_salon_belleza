import { api } from '@services/api'
import { urls } from '@services/urls'
import type { Professional } from '@/types'

export const professionalsService = {
    getServices: () => api.get<Professional[]>(urls.professionals.getProfessionals),
    getServiceById: (serviceId: number) => api.get<Professional>(urls.professionals.getProfessionalById(serviceId))
}