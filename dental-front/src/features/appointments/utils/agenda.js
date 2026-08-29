export const DAY_START_HOUR = 8
export const DAY_END_HOUR = 19
export const SLOT_HEIGHT = 68
export const SLOT_MINUTES = 45

export function startOfDay(date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

export function startOfWeek(date) {
  const next = startOfDay(date)
  const day = next.getDay()
  const diff = day === 0 ? -6 : 1 - day
  next.setDate(next.getDate() + diff)
  return next
}

export function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function addDays(date, amount) {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

export function addMonths(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}

export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function weekDays(anchor) {
  const start = startOfWeek(anchor)
  return Array.from({ length: 7 }, (_, index) => addDays(start, index))
}

export function hoursRange() {
  return Array.from({ length: DAY_END_HOUR - DAY_START_HOUR }, (_, index) => DAY_START_HOUR + index)
}

export function eventTop(start) {
  const date = new Date(start)
  return (date.getHours() + date.getMinutes() / 60 - DAY_START_HOUR) * SLOT_HEIGHT
}

export function eventHeight(start, end) {
  const duration = (new Date(end) - new Date(start)) / 3_600_000
  return Math.max(32, duration * SLOT_HEIGHT - 4)
}

export function slotDate(day, hour, minute = 0) {
  const date = new Date(day)
  date.setHours(hour, minute, 0, 0)
  return date
}

export function endFromStart(start) {
  return new Date(start.getTime() + SLOT_MINUTES * 60_000)
}

export function padTime(value) {
  return String(value).padStart(2, '0')
}

export function timeSlots(step = 15) {
  const slots = []

  for (let minutes = DAY_START_HOUR * 60; minutes <= DAY_END_HOUR * 60; minutes += step) {
    const hour = Math.floor(minutes / 60)
    const minute = minutes % 60
    slots.push(`${padTime(hour)}:${padTime(minute)}`)
  }

  return slots
}

export function addMinutesToTime(time, minutes) {
  const [hour, minute] = time.split(':').map(Number)
  const next = hour * 60 + minute + minutes
  const max = DAY_END_HOUR * 60
  const clamped = Math.min(max, Math.max(DAY_START_HOUR * 60, next))

  return `${padTime(Math.floor(clamped / 60))}:${padTime(clamped % 60)}`
}

export function combineDateAndTime(date, time) {
  return new Date(`${date}T${time}:00`)
}

export function nearestTimeSlot(time, slots = timeSlots()) {
  if (slots.includes(time)) {
    return time
  }

  return slots.find((slot) => slot >= time) || slots[slots.length - 1]
}

export function formatWeekLabel(anchor) {
  const days = weekDays(anchor)
  const first = days[0]
  const last = days[6]
  const firstMonth = first.toLocaleDateString('fr-FR', { month: 'long' })
  const lastMonth = last.toLocaleDateString('fr-FR', { month: 'long' })

  if (first.getMonth() === last.getMonth()) {
    return `${first.getDate()} – ${last.getDate()} ${lastMonth} ${last.getFullYear()}`
  }

  return `${first.getDate()} ${firstMonth} – ${last.getDate()} ${lastMonth} ${last.getFullYear()}`
}

export function durationMinutes(start, end) {
  return Math.max(15, Math.round((new Date(end) - new Date(start)) / 60_000))
}

export function formatDayLabel(date) {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatMonthLabel(date) {
  return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

export function monthCells(anchor) {
  const first = startOfMonth(anchor)
  const start = startOfWeek(first)
  return Array.from({ length: 42 }, (_, index) => addDays(start, index))
}

export function rangeForView(view, anchor) {
  if (view === 'day') {
    const from = startOfDay(anchor)
    return { from: from.toISOString(), to: addDays(from, 1).toISOString() }
  }

  if (view === 'month') {
    const cells = monthCells(anchor)
    return { from: cells[0].toISOString(), to: addDays(cells[41], 1).toISOString() }
  }

  const start = startOfWeek(anchor)
  return { from: start.toISOString(), to: addDays(start, 7).toISOString() }
}
