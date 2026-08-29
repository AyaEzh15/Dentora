import { Box, Chip, Typography } from '@mui/material'
import { formatTime } from '@/utils/format'

export default function WaitingRoom({ appointments = [], onSelect }) {
  const waiting = appointments.filter((item) => item.status === 'IN_PROGRESS')

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2, flex: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h3">Salle d&apos;attente</Typography>
        <Chip label={waiting.length} size="small" sx={{ bgcolor: 'secondary.container', color: 'secondary.onContainer' }} />
      </Box>
      {waiting.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Aucun patient en salle d&apos;attente.
        </Typography>
      ) : (
        <Box sx={{ display: 'grid', gap: 1 }}>
          {waiting.map((appointment) => (
            <Box
              key={appointment.id}
              onClick={() => onSelect(appointment)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                cursor: 'pointer',
                '&:hover': { bgcolor: 'surface.containerLow' },
              }}
            >
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'secondary.light' }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="overline" sx={{ display: 'block' }}>
                  {appointment.patient?.name}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {formatTime(appointment.startAt)} · {appointment.dentist?.name}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}
