import { MenuItem, TextField } from '@mui/material'
import { APPOINTMENT_STATUSES, appointmentStatusMeta } from '@/features/appointments/constants/appointmentStatuses'
import { useUpdateAppointment } from '@/features/appointments/hooks/useAppointments'

export default function AppointmentStatusSelect({ appointment }) {
  const mutation = useUpdateAppointment()
  const current = appointmentStatusMeta(appointment.status)

  return (
    <TextField
      select
      size="small"
      value={appointment.status}
      disabled={mutation.isPending}
      onChange={(event) => {
        const status = event.target.value
        if (status === appointment.status) {
          return
        }
        mutation.mutate({ id: appointment.id, payload: { status } })
      }}
      sx={{
        minWidth: 180,
        '& .MuiOutlinedInput-root': {
          bgcolor: current.bg,
          color: current.color,
          fontWeight: 600,
          fontSize: 12,
          letterSpacing: '0.04em',
        },
        '& .MuiSelect-select': {
          py: 0.75,
        },
      }}
    >
      {APPOINTMENT_STATUSES.map((status) => (
        <MenuItem key={status.value} value={status.value} sx={{ color: status.color, fontWeight: 600 }}>
          {status.label}
        </MenuItem>
      ))}
    </TextField>
  )
}
