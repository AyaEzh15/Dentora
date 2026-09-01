import api from '@/api/axios'
import { endpoints } from '@/api/endpoints'

export const prescriptionApi = {
  getAll: (params) => api.get(endpoints.prescriptions.list, { params }),
  getById: (id) => api.get(endpoints.prescriptions.detail(id)),
  create: (payload) => api.post(endpoints.prescriptions.list, payload),
  update: (id, payload) => api.put(endpoints.prescriptions.detail(id), payload),
  pdf: (id) => endpoints.prescriptions.pdf(id),
}
