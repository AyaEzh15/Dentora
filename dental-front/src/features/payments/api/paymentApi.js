import api from '@/api/axios'
import { endpoints } from '@/api/endpoints'

export const paymentApi = {
  getAll: (params) => api.get(endpoints.payments.list, { params }),
  create: (payload) => api.post(endpoints.payments.list, payload),
}
