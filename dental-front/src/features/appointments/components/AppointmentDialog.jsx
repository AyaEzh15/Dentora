import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from '@mui/material'
import ErrorAlert from '@/components/common/ErrorAlert'
import { patientApi } from '@/features/patients/api/patientApi'
import { usePatients } from '@/features/patients/hooks/usePatients'
import { useAuth } from '@/context/AuthContext'
import { useDentists } from '@/features/users/hooks/useUsers'
import CareTypeSelect from '@/features/care-types/components/CareTypeSelect'
import { useCreateAppointment } from '@/features/appointments/hooks/useAppointments'
import { addMinutesToTime, combineDateAndTime, endFromStart, nearestTimeSlot, SLOT_MINUTES, timeSlots } from '@/features/appointments/utils/agenda'
import { toDateInput, toTimeInput } from '@/utils/format'

export default function AppointmentDialog({ open, onClose, defaultPatient, defaultStart }) {
  const { user, hasRole } = useAuth()
  const isDentist = hasRole('DENTIST')
  const { data: dentists = [] } = useDentists()
  const { data: patientsPage } = usePatients({ per_page: 50, is_active: true })
  const mutation = useCreateAppointment()
  const listedPatients = patientsPage?.items ?? []
  const [searchResults, setSearchResults] = useState(null)
  const [patient, setPatient] = useState(defaultPatient || null)
  const [careType, setCareType] = useState(null)
  const start = defaultStart || new Date()
  const end = endFromStart(start)
  const defaultDentistId = isDentist && user?.id ? String(user.id) : dentists[0]?.id ? String(dentists[0].id) : ''

  const { register, handleSubmit, reset, setValue } = useForm({
    values: {
      dentist_id: defaultDentistId,
      date: toDateInput(start),
      start_time: nearestTimeSlot(toTimeInput(start)),
      end_time: nearestTimeSlot(toTimeInput(end)),
      notes: '',
      status: 'PENDING',
    },
  })

  const hours = timeSlots()
  const patientOptions = useMemo(() => {
    const base = searchResults ?? listedPatients

    if (defaultPatient && !base.some((item) => item.id === defaultPatient.id)) {
      return [defaultPatient, ...base]
    }

    return base
  }, [searchResults, listedPatients, defaultPatient])

  useEffect(() => {
    if (open) {
      setPatient(defaultPatient || null)
      setCareType(null)
      setSearchResults(null)
    }
  }, [open, defaultPatient])

  const searchPatients = async (term) => {
    if (!term.trim()) {
      setSearchResults(null)
      return
    }

    const { data } = await patientApi.search(term)
    setSearchResults(data.data || [])
  }

  const onSubmit = async (values) => {
    await mutation.mutateAsync({
      dentist_id: values.dentist_id,
      patient_id: patient?.id,
      start_at: combineDateAndTime(values.date, values.start_time).toISOString(),
      end_at: combineDateAndTime(values.date, values.end_time).toISOString(),
      care_type_id: careType?.id,
      notes: values.notes,
      status: values.status,
    })
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Nouveau rendez-vous</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 1 }}>
          <ErrorAlert
            message={mutation.error?.response?.data?.errors?.start_at?.[0] || mutation.error?.response?.data?.message}
          />
          <Autocomplete
            options={patientOptions}
            value={patient}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name || `${option.firstName || ''} ${option.lastName || ''}`.trim()}
            onChange={(_, value) => setPatient(value)}
            onInputChange={(_, value, reason) => {
              if (reason !== 'reset') {
                searchPatients(value)
              }
            }}
            noOptionsText="Aucun patient"
            renderInput={(params) => <TextField {...params} label="Patient" required placeholder="Choisir un patient" />}
          />
          {!isDentist ? (
            <TextField select label="Dentiste" {...register('dentist_id', { required: true })}>
              {dentists.map((dentist) => (
                <MenuItem key={dentist.id} value={String(dentist.id)}>
                  {dentist.name}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <input type="hidden" {...register('dentist_id')} />
          )}
          <TextField type="date" label="Date" {...register('date')} slotProps={{ inputLabel: { shrink: true } }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              select
              label="Début"
              {...register('start_time')}
              onChange={(event) => {
                const next = event.target.value
                setValue('start_time', next)
                setValue('end_time', addMinutesToTime(next, SLOT_MINUTES))
              }}
            >
              {hours.map((time) => (
                <MenuItem key={`start-${time}`} value={time}>
                  {time}
                </MenuItem>
              ))}
            </TextField>
            <TextField select label="Fin" {...register('end_time')}>
              {hours.map((time) => (
                <MenuItem key={`end-${time}`} value={time}>
                  {time}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <CareTypeSelect value={careType} onChange={setCareType} required />
          <TextField label="Notes" multiline minRows={2} {...register('notes')} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained" disabled={mutation.isPending || !patient || !careType}>
            Planifier
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
