import api from '@/api/axios'
import { endpoints } from '@/api/endpoints'

export const patientApi = {
  getAll: (params) => api.get(endpoints.patients.list, { params }),
  search: (q) => api.get(endpoints.patients.search, { params: { q } }),
  getById: (id) => api.get(endpoints.patients.detail(id)),
  create: (payload) => api.post(endpoints.patients.list, payload),
  update: (id, payload) => api.put(endpoints.patients.detail(id), payload),
}
