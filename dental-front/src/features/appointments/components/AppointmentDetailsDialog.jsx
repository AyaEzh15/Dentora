import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import AppointmentStatusSelect from '@/features/appointments/components/AppointmentStatusSelect'
import { careLabel } from '@/features/care-types/utils/careLabel'
import { formatDateTime } from '@/utils/format'

export default function AppointmentDetailsDialog({ appointment, onClose }) {
  if (!appointment) {
    return null
  }

  return (
    <Dialog open={Boolean(appointment)} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{appointment.patient?.name}</DialogTitle>
      <DialogContent sx={{ display: 'grid', gap: 1.5 }}>
        <Typography variant="body2" color="text.secondary">
          {formatDateTime(appointment.startAt)} → {formatDateTime(appointment.endAt)}
        </Typography>
        <Typography variant="body2">
          {careLabel(appointment)} · {appointment.dentist?.name}
        </Typography>
        {appointment.notes ? (
          <Typography variant="body2" color="text.secondary">
            {appointment.notes}
          </Typography>
        ) : null}
        <AppointmentStatusSelect appointment={appointment} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  )
}
