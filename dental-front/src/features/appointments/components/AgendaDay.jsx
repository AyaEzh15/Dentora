import { Box, Button, Typography } from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import EmptyState from '@/components/common/EmptyState'
import { appointmentStatusMeta } from '@/features/appointments/constants/appointmentStatuses'
import { durationMinutes, formatDayLabel, hoursRange, isSameDay, slotDate } from '@/features/appointments/utils/agenda'
import { careLabel } from '@/features/care-types/utils/careLabel'
import { formatTime, initials } from '@/utils/format'

function DayCard({ appointment, onSelect }) {
  const meta = appointmentStatusMeta(appointment.status)

  return (
    <Box
      onClick={() => onSelect(appointment)}
      sx={{
        display: 'flex',
        gap: 2,
        p: 2,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderLeft: '4px solid',
        borderLeftColor: meta.color,
        borderRadius: 2,
        cursor: 'pointer',
        boxShadow: '0 2px 10px rgba(13, 28, 46, 0.04)',
        '&:hover': { bgcolor: 'surface.containerLow' },
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          bgcolor: meta.bg,
          color: meta.color,
          display: 'grid',
          placeItems: 'center',
          fontSize: 13,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {initials(appointment.patient?.name)}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="overline" sx={{ display: 'block' }} noWrap>
          {appointment.patient?.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {careLabel(appointment)} · {durationMinutes(appointment.startAt, appointment.endAt)} min
        </Typography>
      </Box>
      <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: meta.color }}>
          {formatTime(appointment.startAt)}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {meta.label}
        </Typography>
      </Box>
    </Box>
  )
}

export default function AgendaDay({ date, appointments, onSlotClick, onSelect }) {
  const dayAppointments = appointments
    .filter((item) => isSameDay(new Date(item.startAt), date) && item.status !== 'CANCELLED')
    .sort((a, b) => new Date(a.startAt) - new Date(b.startAt))

  const occupiedHours = new Set(dayAppointments.map((item) => new Date(item.startAt).getHours()))
  const freeSlots = hoursRange().filter((hour) => !occupiedHours.has(hour))

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: 'surface.containerLow', minHeight: 640 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h3" sx={{ textTransform: 'capitalize' }}>
            {formatDayLabel(date)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {dayAppointments.length
              ? `${dayAppointments.length} rendez-vous planifié${dayAppointments.length > 1 ? 's' : ''}`
              : 'Aucun rendez-vous pour cette journée'}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => onSlotClick(slotDate(date, 9))}>
          Ajouter
        </Button>
      </Box>

      {!dayAppointments.length ? (
        <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <EmptyState
            title="Journée libre"
            description="Sélectionnez un créneau ci-dessous ou ajoutez un rendez-vous."
          />
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gap: 1.5, mb: 3 }}>
          {dayAppointments.map((appointment) => (
            <Box key={appointment.id} sx={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: 2, alignItems: 'stretch' }}>
              <Box sx={{ pt: 2, textAlign: 'right' }}>
                <Typography variant="overline" color="text.secondary">
                  {formatTime(appointment.startAt)}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {formatTime(appointment.endAt)}
                </Typography>
              </Box>
              <DayCard appointment={appointment} onSelect={onSelect} />
            </Box>
          ))}
        </Box>
      )}

      <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
        Créneaux disponibles
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {freeSlots.map((hour) => (
          <Box
            key={hour}
            onClick={() => onSlotClick(slotDate(date, hour))}
            sx={{
              px: 1.5,
              py: 1,
              borderRadius: 2,
              border: '1px dashed',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              color: 'text.secondary',
              '&:hover': { borderColor: 'primary.main', color: 'primary.main', bgcolor: 'rgba(0, 94, 151, 0.04)' },
            }}
          >
            {`${String(hour).padStart(2, '0')}:00`}
          </Box>
        ))}
      </Box>
    </Box>
  )
}
