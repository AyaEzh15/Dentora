export function formatDate(value) {
  if (!value) {
    return '—'
  }

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function formatTime(value) {
  if (!value) {
    return '—'
  }

  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function formatDateTime(value) {
  if (!value) {
    return '—'
  }

  return `${formatDate(value)} · ${formatTime(value)}`
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function toDateTimeLocal(value) {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  const pad = (n) => String(n).padStart(2, '0')

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function toDateInput(value) {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  const pad = (n) => String(n).padStart(2, '0')

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function toTimeInput(value) {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  const pad = (n) => String(n).padStart(2, '0')

  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}
