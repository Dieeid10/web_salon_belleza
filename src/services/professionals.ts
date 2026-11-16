import { api } from '@services/api'
import { urls } from '@services/urls'
import type { Professional } from '@/types'

export const professionalsService = {
    getProfessionals: () => api.get<Professional[]>(urls.professionals.getProfessionals),
    getProfessionalsById: (serviceId: number) => api.get<Professional>(urls.professionals.getProfessionalById(serviceId))
}