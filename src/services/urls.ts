export const urls = {
  services: {
    getServices: '/services/',
    getServiceById: (serviceId: number) => `/services/${serviceId}`,
  },
  professionals: {
    getProfessionals: '/professionals/',
    getProfessionalById: (professionalId: number) =>`/professionals/${professionalId}`,
  },
  discounts: {
    getDiscounts: '/discounts/',
  },
  appointments: {
    getAvailability: '/appointments/availability',
    createGuestAppointment: '/appointments/',
    createAccountAppointment: '/appointments/me',
    getMyAppointments: '/appointments/me',
  },
  clients: {
    getMyProfile: '/clients/me',
    updateMyProfile: '/clients/me',
  },
  pages: {
    home: '/',
    googleCallback: '/auth/google/callback',
    staffInviteCallback: '/auth/callback',
  },
} as const;