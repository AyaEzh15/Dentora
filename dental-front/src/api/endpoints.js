export const endpoints = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  dashboard: '/dashboard',
  patients: {
    list: '/patients',
    search: '/patients/search',
    detail: (id) => `/patients/${id}`,
  },
  appointments: {
    list: '/appointments',
    calendar: '/appointments/calendar',
    detail: (id) => `/appointments/${id}`,
    cancel: (id) => `/appointments/${id}/cancel`,
  },
  users: {
    list: '/users',
    dentists: '/users/dentists',
    detail: (id) => `/users/${id}`,
  },
}
