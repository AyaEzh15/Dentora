import api from '@/api/axios'
import { endpoints } from '@/api/endpoints'

export const userApi = {
  getAll: (params) => api.get(endpoints.users.list, { params }),
  dentists: () => api.get(endpoints.users.dentists),
  getById: (id) => api.get(endpoints.users.detail(id)),
  create: (payload) => api.post(endpoints.users.list, payload),
  update: (id, payload) => api.put(endpoints.users.detail(id), payload),
  uploadTemplates: (id, payload) =>
    api.post(endpoints.users.templates(id), payload, {
      headers: { 'Content-Type': undefined },
    }),
}
