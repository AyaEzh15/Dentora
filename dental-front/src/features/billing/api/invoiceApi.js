import api from '@/api/axios'
import { endpoints } from '@/api/endpoints'

export const invoiceApi = {
  getAll: (params) => api.get(endpoints.invoices.list, { params }),
  getById: (id) => api.get(endpoints.invoices.detail(id)),
  create: (payload) => api.post(endpoints.invoices.list, payload),
  update: (id, payload) => api.put(endpoints.invoices.detail(id), payload),
  pdf: (id) => endpoints.invoices.pdf(id),
}
