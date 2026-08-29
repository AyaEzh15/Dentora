import api from '@/api/axios'
import { endpoints } from '@/api/endpoints'

export const appointmentApi = {
  getAll: (params) => api.get(endpoints.appointments.list, { params }),
  calendar: (params) => api.get(endpoints.appointments.calendar, { params }),
  create: (payload) => api.post(endpoints.appointments.list, payload),
  update: (id, payload) => api.put(endpoints.appointments.detail(id), payload),
  cancel: (id, reason) => api.post(endpoints.appointments.cancel(id), { reason }),
}
