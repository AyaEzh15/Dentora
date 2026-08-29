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
  careTypes: {
    list: '/care-types',
    detail: (id) => `/care-types/${id}`,
  },
  users: {
    list: '/users',
    dentists: '/users/dentists',
    detail: (id) => `/users/${id}`,
  },
  clinical: {
    medicalRecord: (patientId) => `/patients/${patientId}/medical-record`,
    odontogram: (patientId) => `/patients/${patientId}/odontogram`,
    consultations: '/consultations',
    consultation: (id) => `/consultations/${id}`,
    treatmentPlans: '/treatment-plans',
    treatmentPlan: (id) => `/treatment-plans/${id}`,
  },
}
