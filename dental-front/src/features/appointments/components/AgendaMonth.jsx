import { Box, Typography } from '@mui/material'
import { appointmentStatusMeta } from '@/features/appointments/constants/appointmentStatuses'
import { isSameDay, monthCells, startOfMonth } from '@/features/appointments/utils/agenda'
import { formatTime } from '@/utils/format'

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

export default function AgendaMonth({ anchor, appointments, onDayClick, onSelect }) {
  const cells = monthCells(anchor)
  const month = startOfMonth(anchor)
  const today = new Date()

  return (
    <Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid', borderColor: 'divider' }}>
        {WEEKDAYS.map((day) => (
          <Typography key={day} variant="overline" sx={{ p: 1, textAlign: 'center' }} color="text.secondary">
            {day}
          </Typography>
        ))}
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {cells.map((day) => {
          const dayEvents = appointments.filter(
            (item) => isSameDay(new Date(item.startAt), day) && item.status !== 'CANCELLED'
          )
          const outside = day.getMonth() !== month.getMonth()

          return (
            <Box
              key={day.toISOString()}
              onClick={() => onDayClick(day)}
              sx={{
                minHeight: 120,
                p: 1,
                borderRight: '1px solid',
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: isSameDay(day, today) ? 'surface.containerLow' : 'background.paper',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'rgba(0, 94, 151, 0.04)' },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: outside ? 'outline.main' : isSameDay(day, today) ? 'primary.main' : 'text.primary',
                  mb: 0.5,
                }}
              >
                {day.getDate()}
              </Typography>
              {dayEvents.slice(0, 3).map((appointment) => {
                const meta = appointmentStatusMeta(appointment.status)
                return (
                  <Box
                    key={appointment.id}
                    onClick={(event) => {
                      event.stopPropagation()
                      onSelect(appointment)
                    }}
                    sx={{
                      mb: 0.5,
                      px: 0.75,
                      py: 0.25,
                      borderRadius: 1,
                      bgcolor: meta.bg,
                      borderLeft: '3px solid',
                      borderColor: meta.color,
                    }}
                  >
                    <Typography sx={{ fontSize: 11, fontWeight: 600 }} noWrap>
                      {formatTime(appointment.startAt)} {appointment.patient?.name}
                    </Typography>
                  </Box>
                )
              })}
              {dayEvents.length > 3 ? (
                <Typography variant="subtitle2" color="text.secondary">
                  +{dayEvents.length - 3} autres
                </Typography>
              ) : null}
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
