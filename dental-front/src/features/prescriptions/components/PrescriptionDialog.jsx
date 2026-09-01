import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import ErrorAlert from '@/components/common/ErrorAlert'
import PatientSelect from '@/features/patients/components/PatientSelect'
import { useAuth } from '@/context/AuthContext'
import { useDentists } from '@/features/users/hooks/useUsers'
import { useSavePrescription } from '@/features/prescriptions/hooks/usePrescriptions'
import { prescriptionApi } from '@/features/prescriptions/api/prescriptionApi'
import { toDateInput } from '@/utils/format'
import { openPdf } from '@/utils/printPdf'

const emptyItem = () => ({ medication: '', dosage: '', frequency: '', duration: '', quantity: 1, instructions: '' })

export default function PrescriptionDialog({ open, onClose, patient: lockedPatient, prescription }) {
  const { user, hasRole, hasPermission } = useAuth()
  const isDentist = hasRole('DENTIST')
  const { data: dentists = [] } = useDentists()
  const mutation = useSavePrescription()
  const [patient, setPatient] = useState(lockedPatient || prescription?.patient || null)
  const [items, setItems] = useState(prescription?.items?.length ? prescription.items : [emptyItem()])
  const defaultDentistId = isDentist && user?.id ? String(user.id) : String(prescription?.dentistId || dentists[0]?.id || '')

  const { register, handleSubmit } = useForm({
    values: {
      dentist_id: defaultDentistId,
      prescribed_at: toDateInput(prescription?.prescribedAt || new Date()),
      status: prescription?.status || 'ISSUED',
      notes: prescription?.notes || '',
    },
  })

  useEffect(() => {
    if (!open) {
      return
    }
    setPatient(lockedPatient || prescription?.patient || null)
    setItems(prescription?.items?.length ? prescription.items.map((item) => ({ ...emptyItem(), ...item })) : [emptyItem()])
  }, [open, lockedPatient, prescription])

  const onSubmit = async (values) => {
    await mutation.mutateAsync({
      id: prescription?.id,
      payload: {
        ...values,
        patient_id: patient.id,
        prescribed_at: new Date(`${values.prescribed_at}T09:00:00`).toISOString(),
        items: items
          .filter((item) => item.medication)
          .map((item) => ({
            medication: item.medication,
            dosage: item.dosage || null,
            frequency: item.frequency || null,
            duration: item.duration || null,
            quantity: Number(item.quantity || 1),
            instructions: item.instructions || null,
          })),
      },
    })
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{prescription ? `Ordonnance ${prescription.number}` : 'Nouvelle ordonnance'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ display: 'grid', gap: 2 }}>
          <ErrorAlert message={mutation.error?.response?.data?.message} />
          {!lockedPatient ? <PatientSelect value={patient} onChange={setPatient} required /> : null}
          {!isDentist ? (
            <TextField select label="Dentiste" {...register('dentist_id')}>
              {dentists.map((dentist) => (
                <MenuItem key={dentist.id} value={String(dentist.id)}>
                  {dentist.name}
                </MenuItem>
              ))}
            </TextField>
          ) : null}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <TextField type="date" label="Date" {...register('prescribed_at')} slotProps={{ inputLabel: { shrink: true } }} />
            <TextField select label="Statut" {...register('status')}>
              <MenuItem value="DRAFT">Brouillon</MenuItem>
              <MenuItem value="ISSUED">Émise</MenuItem>
            </TextField>
          </Box>
          <TextField label="Notes" multiline minRows={2} {...register('notes')} />
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ fontWeight: 700 }}>Médicaments</Typography>
              <Button size="small" startIcon={<AddRoundedIcon />} onClick={() => setItems((rows) => [...rows, emptyItem()])}>
                Ajouter
              </Button>
            </Box>
            {items.map((item, index) => (
              <Box key={index} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.4fr 1fr 1fr 1fr 40px' }, gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  label="Médicament"
                  value={item.medication}
                  onChange={(event) => {
                    const next = [...items]
                    next[index] = { ...next[index], medication: event.target.value }
                    setItems(next)
                  }}
                />
                <TextField
                  size="small"
                  label="Posologie"
                  value={item.dosage || ''}
                  onChange={(event) => {
                    const next = [...items]
                    next[index] = { ...next[index], dosage: event.target.value }
                    setItems(next)
                  }}
                />
                <TextField
                  size="small"
                  label="Fréquence"
                  value={item.frequency || ''}
                  onChange={(event) => {
                    const next = [...items]
                    next[index] = { ...next[index], frequency: event.target.value }
                    setItems(next)
                  }}
                />
                <TextField
                  size="small"
                  label="Durée"
                  value={item.duration || ''}
                  onChange={(event) => {
                    const next = [...items]
                    next[index] = { ...next[index], duration: event.target.value }
                    setItems(next)
                  }}
                />
                <IconButton onClick={() => setItems((rows) => rows.filter((_, i) => i !== index))}>
                  <DeleteOutlineRoundedIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          {prescription?.id ? (
            <Button onClick={() => openPdf(prescriptionApi.pdf(prescription.id))}>Imprimer</Button>
          ) : null}
          <Button type="submit" variant="contained" disabled={mutation.isPending || !patient || !hasPermission('prescriptions.create')}>
            Enregistrer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
