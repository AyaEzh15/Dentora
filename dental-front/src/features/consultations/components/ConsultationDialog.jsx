import { useState } from 'react'
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
} from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import ErrorAlert from '@/components/common/ErrorAlert'
import CareTypeSelect from '@/features/care-types/components/CareTypeSelect'
import { useSaveConsultation } from '@/features/patients/hooks/useClinical'
import { useAuth } from '@/context/AuthContext'
import { useDentists } from '@/features/users/hooks/useUsers'
import { toDateInput } from '@/utils/format'

export default function ConsultationDialog({ open, onClose, patient, consultation }) {
  const { user, hasRole } = useAuth()
  const isDentist = hasRole('DENTIST')
  const { data: dentists = [] } = useDentists()
  const mutation = useSaveConsultation()
  const [careType, setCareType] = useState(consultation?.careType || null)
  const [procedures, setProcedures] = useState(consultation?.procedures || [])

  const defaultDentistId = isDentist && user?.id ? String(user.id) : String(consultation?.dentistId || dentists[0]?.id || '')

  const { register, handleSubmit } = useForm({
    values: {
      dentist_id: defaultDentistId,
      consulted_at: toDateInput(consultation?.consultedAt || new Date()),
      status: consultation?.status || 'COMPLETED',
      chief_complaint: consultation?.chiefComplaint || '',
      clinical_exam: consultation?.clinicalExam || '',
      diagnosis: consultation?.diagnosis || '',
      treatment_notes: consultation?.treatmentNotes || '',
      recommendations: consultation?.recommendations || '',
    },
  })

  const onSubmit = async (values) => {
    await mutation.mutateAsync({
      id: consultation?.id,
      payload: {
        ...values,
        patient_id: patient.id,
        care_type_id: careType?.id || null,
        consulted_at: new Date(`${values.consulted_at}T09:00:00`).toISOString(),
        procedures: procedures
          .filter((item) => item.careTypeId || item.careType?.id)
          .map((item) => ({
            care_type_id: item.careTypeId || item.careType?.id,
            tooth_number: item.toothNumber || null,
            quantity: Number(item.quantity || 1),
            notes: item.notes || null,
          })),
      },
    })
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{consultation ? 'Modifier la consultation' : 'Nouvelle consultation'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ display: 'grid', gap: 2 }}>
          <ErrorAlert message={mutation.error?.response?.data?.message} />
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
            <TextField type="date" label="Date" {...register('consulted_at')} slotProps={{ inputLabel: { shrink: true } }} />
            <TextField select label="Statut" {...register('status')}>
              <MenuItem value="DRAFT">Brouillon</MenuItem>
              <MenuItem value="COMPLETED">Terminée</MenuItem>
            </TextField>
          </Box>
          <CareTypeSelect value={careType} onChange={setCareType} label="Motif / type de soin" />
          <TextField label="Motif de consultation" multiline minRows={2} {...register('chief_complaint')} />
          <TextField label="Examen clinique" multiline minRows={2} {...register('clinical_exam')} />
          <TextField label="Diagnostic" multiline minRows={2} {...register('diagnosis')} />
          <TextField label="Soins réalisés" multiline minRows={2} {...register('treatment_notes')} />
          <TextField label="Recommandations" multiline minRows={2} {...register('recommendations')} />

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box component="span" sx={{ fontWeight: 700 }}>Actes réalisés</Box>
              <Button
                size="small"
                startIcon={<AddRoundedIcon />}
                onClick={() => setProcedures((items) => [...items, { careType: careType, careTypeId: careType?.id, toothNumber: '', quantity: 1, notes: '' }])}
              >
                Ajouter un acte
              </Button>
            </Box>
            {procedures.map((item, index) => (
              <Box key={index} sx={{ display: 'grid', gridTemplateColumns: '1fr 90px 80px 40px', gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  label="Acte"
                  value={item.careType?.name || ''}
                  placeholder="Choisir un type de soin ci-dessus puis ajouter"
                  disabled
                />
                <TextField
                  size="small"
                  label="Dent"
                  value={item.toothNumber || ''}
                  onChange={(event) => {
                    const next = [...procedures]
                    next[index] = { ...next[index], toothNumber: event.target.value }
                    setProcedures(next)
                  }}
                />
                <TextField
                  size="small"
                  type="number"
                  label="Qté"
                  value={item.quantity || 1}
                  onChange={(event) => {
                    const next = [...procedures]
                    next[index] = { ...next[index], quantity: event.target.value }
                    setProcedures(next)
                  }}
                />
                <IconButton onClick={() => setProcedures((items) => items.filter((_, i) => i !== index))}>
                  <DeleteOutlineRoundedIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained" disabled={mutation.isPending}>
            Enregistrer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
