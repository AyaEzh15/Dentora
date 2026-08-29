import api from '@/api/axios'
import { endpoints } from '@/api/endpoints'

export const dashboardApi = {
  get: () => api.get(endpoints.dashboard),
}
