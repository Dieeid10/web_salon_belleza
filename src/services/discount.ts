import { api } from '@services/api'
import { urls } from '@services/urls'
import type { Discount } from '@/types'

export const discountsService = {
    getDiscounts: () => api.get<Discount[]>(urls.discounts.getDiscounts)
}