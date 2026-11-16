

import { api } from '@services/api'
import { urls } from '@services/urls'
import type { AccountProfile, ProfileChanges } from '@/types'

export const clientsService = {
  getMyProfile: (token: string, signal?: AbortSignal) =>
    api.get<AccountProfile>(urls.clients.getMyProfile, {
      headers: { Authorization: `Bearer ${token}` },
      signal,
    }),

  updateMyProfile: (data: ProfileChanges, token: string) =>
    api.patch<AccountProfile, ProfileChanges>(urls.clients.updateMyProfile, data, {
      headers: { Authorization: `Bearer ${token}` },
    }),
}

