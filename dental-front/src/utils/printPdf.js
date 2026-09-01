import api from '@/api/axios'
import { getToken } from '@/api/interceptors'

export async function openPdf(path) {
  const { data } = await api.get(path, {
    responseType: 'blob',
    headers: { Authorization: `Bearer ${getToken()}` },
  })

  if (data.type && data.type.includes('json')) {
    const payload = JSON.parse(await data.text())
    throw new Error(payload.message || 'Impossible d’ouvrir le PDF.')
  }

  const href = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }))
  window.open(href, '_blank', 'noopener,noreferrer')
}
