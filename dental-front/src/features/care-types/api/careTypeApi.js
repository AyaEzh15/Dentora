import api from '@/api/axios'
import { endpoints } from '@/api/endpoints'

export const careTypeApi = {
  getAll: (params) => api.get(endpoints.careTypes.list, { params }),
  create: (payload) => api.post(endpoints.careTypes.list, payload),
  update: (id, payload) => api.put(endpoints.careTypes.detail(id), payload),
}
