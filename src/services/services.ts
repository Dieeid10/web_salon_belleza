import { api } from '@services/api'
import { urls } from '@services/urls'
import type { Service } from '@/types'

export const servicesService = {
    getServices: () => api.get<Service[]>(urls.services.getServices),
    getServiceById: (serviceId: number) => api.get<Service>(urls.services.getServiceById(serviceId))
}