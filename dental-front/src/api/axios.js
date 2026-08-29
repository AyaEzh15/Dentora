import axios from 'axios'
import { setupInterceptors } from './interceptors'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

setupInterceptors(api)

export default api
