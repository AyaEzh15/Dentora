import api from '@/api/axios'
import { endpoints } from '@/api/endpoints'

export const authApi = {
  login: (payload) => api.post(endpoints.auth.login, payload),
  logout: () => api.post(endpoints.auth.logout),
  me: () => api.get(endpoints.auth.me),
}
