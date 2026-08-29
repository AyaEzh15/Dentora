import { Box, Typography } from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { appointmentStatusMeta } from '@/features/appointments/constants/appointmentStatuses'
import { durationMinutes, isSameDay, slotDate, weekDays } from '@/features/appointments/utils/agenda'
import { formatTime } from '@/utils/format'

export default function AgendaWeek({ anchor, appointments, onSlotClick, onSelect }) {
  const days = weekDays(anchor)
  const today = new Date()

  return (
    <Box sx={{ overflow: 'auto', bgcolor: 'surface.containerLow', minHeight: 640 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(160px, 1fr))',
          minWidth: 1120,
          gap: 1,
          p: 1.5,
        }}
      >
        {days.map((day) => {
          const selected = isSameDay(day, today)
          const dayEvents = appointments
            .filter((item) => isSameDay(new Date(item.startAt), day) && item.status !== 'CANCELLED')
            .sort((a, b) => new Date(a.startAt) - new Date(b.startAt))

          return (
            <Box
              key={day.toISOString()}
              sx={{
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: selected ? 'primary.main' : 'divider',
                borderRadius: 2,
                minHeight: 600,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ p: 1.5, textAlign: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="overline" color={selected ? 'primary.main' : 'text.secondary'}>
                  {day.toLocaleDateString('fr-FR', { weekday: 'short' })}
                </Typography>
                <Typography variant="h3" sx={{ color: selected ? 'primary.main' : 'text.primary' }}>
                  {day.getDate()}
                </Typography>
              </Box>
              <Box sx={{ p: 1, display: 'grid', gap: 1, flex: 1 }}>
                {dayEvents.map((appointment) => {
                  const meta = appointmentStatusMeta(appointment.status)
                  return (
                    <Box
                      key={appointment.id}
                      onClick={() => onSelect(appointment)}
                      sx={{
                        p: 1.25,
                        borderRadius: 1.5,
                        bgcolor: meta.bg,
                        borderLeft: '3px solid',
                        borderColor: meta.color,
                        cursor: 'pointer',
                        '&:hover': { filter: 'brightness(0.97)' },
                      }}
                    >
                      <Typography sx={{ fontSize: 12, fontWeight: 700 }} noWrap>
                        {formatTime(appointment.startAt)} · {durationMinutes(appointment.startAt, appointment.endAt)} min
                      </Typography>
                      <Typography sx={{ fontSize: 13, fontWeight: 600 }} noWrap>
                        {appointment.patient?.name}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: 'text.secondary' }} noWrap>
                        {appointment.reason || 'Consultation'}
                      </Typography>
                    </Box>
                  )
                })}
                <Box
                  onClick={() => onSlotClick(slotDate(day, 9))}
                  sx={{
                    mt: 'auto',
                    py: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.5,
                    border: '1px dashed',
                    borderColor: 'divider',
                    borderRadius: 1.5,
                    color: 'text.secondary',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                    '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
                  }}
                >
                  <AddRoundedIcon sx={{ fontSize: 16 }} />
                  Ajouter
                </Box>
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
