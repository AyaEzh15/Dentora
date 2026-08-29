export function careLabel(appointment) {
  return appointment?.careType?.name || appointment?.reason || 'Consultation'
}
