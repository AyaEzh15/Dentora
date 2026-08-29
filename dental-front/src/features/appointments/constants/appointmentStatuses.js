export const APPOINTMENT_STATUSES = [
  { value: 'PENDING', label: 'À venir', tone: 'muted', color: '#404751', bg: '#d5e3fc' },
  { value: 'CONFIRMED', label: 'Confirmé', tone: 'info', color: '#005e97', bg: 'rgba(0, 94, 151, 0.10)' },
  { value: 'IN_PROGRESS', label: 'En salle d\'attente', tone: 'warning', color: '#93000a', bg: '#ffdad6' },
  { value: 'COMPLETED', label: 'Terminé', tone: 'success', color: '#006b5f', bg: 'rgba(0, 107, 95, 0.10)' },
  { value: 'CANCELLED', label: 'Annulé', tone: 'error', color: '#ba1a1a', bg: '#ffdad6' },
  { value: 'NO_SHOW', label: 'Absent', tone: 'error', color: '#ba1a1a', bg: '#ffdad6' },
]

export function appointmentStatusMeta(value) {
  return APPOINTMENT_STATUSES.find((status) => status.value === value) || APPOINTMENT_STATUSES[0]
}
