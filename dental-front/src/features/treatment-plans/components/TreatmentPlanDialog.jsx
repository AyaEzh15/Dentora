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
  Typography,
} from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import ErrorAlert from '@/components/common/ErrorAlert'
import CareTypeSelect from '@/features/care-types/components/CareTypeSelect'
import { useSaveTreatmentPlan } from '@/features/patients/hooks/useClinical'
import { useAuth } from '@/context/AuthContext'
import { useDentists } from '@/features/users/hooks/useUsers'

const emptyPhase = () => ({
  title: '',
  description: '',
  status: 'PENDING',
  items: [],
})

export default function TreatmentPlanDialog({ open, onClose, patient, plan }) {
  const { user, hasRole } = useAuth()
  const isDentist = hasRole('DENTIST')
  const { data: dentists = [] } = useDentists()
  const mutation = useSaveTreatmentPlan()
  const [phases, setPhases] = useState(
    plan?.phases?.length
      ? plan.phases.map((phase) => ({
          title: phase.title,
          description: phase.description || '',
          status: phase.status,
          items: (phase.items || []).map((item) => ({
            careType: item.careType || null,
            careTypeId: item.careTypeId,
            toothNumber: item.toothNumber || '',
            notes: item.notes || '',
            status: item.status || 'PLANNED',
          })),
        }))
      : [emptyPhase()]
  )

  const defaultDentistId = isDentist && user?.id ? String(user.id) : String(plan?.dentistId || dentists[0]?.id || '')

  const { register, handleSubmit } = useForm({
    values: {
      dentist_id: defaultDentistId,
      title: plan?.title || '',
      description: plan?.description || '',
      status: plan?.status || 'DRAFT',
    },
  })

  const onSubmit = async (values) => {
    await mutation.mutateAsync({
      id: plan?.id,
      payload: {
        ...values,
        patient_id: patient.id,
        phases: phases.map((phase, index) => ({
          title: phase.title,
          description: phase.description,
          sort_order: index + 1,
          status: phase.status,
          items: phase.items
            .filter((item) => item.careTypeId || item.careType?.id)
            .map((item) => ({
              care_type_id: item.careTypeId || item.careType?.id,
              tooth_number: item.toothNumber || null,
              notes: item.notes || null,
              status: item.status || 'PLANNED',
            })),
        })),
      },
    })
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{plan ? 'Modifier le plan' : 'Nouveau plan de traitement'}</DialogTitle>
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
          <TextField label="Titre" {...register('title', { required: true })} />
          <TextField label="Description" multiline minRows={2} {...register('description')} />
          <TextField select label="Statut" {...register('status')}>
            <MenuItem value="DRAFT">Brouillon</MenuItem>
            <MenuItem value="ACCEPTED">Accepté</MenuItem>
            <MenuItem value="IN_PROGRESS">En cours</MenuItem>
            <MenuItem value="COMPLETED">Terminé</MenuItem>
            <MenuItem value="CANCELLED">Annulé</MenuItem>
          </TextField>

          {phases.map((phase, phaseIndex) => (
            <Box key={phaseIndex} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="h3">Phase {phaseIndex + 1}</Typography>
                <IconButton onClick={() => setPhases((items) => items.filter((_, i) => i !== phaseIndex))}>
                  <DeleteOutlineRoundedIcon />
                </IconButton>
              </Box>
              <Box sx={{ display: 'grid', gap: 1.5 }}>
                <TextField
                  label="Titre de phase"
                  value={phase.title}
                  onChange={(event) => {
                    const next = [...phases]
                    next[phaseIndex] = { ...phase, title: event.target.value }
                    setPhases(next)
                  }}
                />
                <TextField
                  label="Description"
                  value={phase.description}
                  onChange={(event) => {
                    const next = [...phases]
                    next[phaseIndex] = { ...phase, description: event.target.value }
                    setPhases(next)
                  }}
                />
                <TextField
                  select
                  label="Statut"
                  value={phase.status}
                  onChange={(event) => {
                    const next = [...phases]
                    next[phaseIndex] = { ...phase, status: event.target.value }
                    setPhases(next)
                  }}
                >
                  <MenuItem value="PENDING">À venir</MenuItem>
                  <MenuItem value="IN_PROGRESS">En cours</MenuItem>
                  <MenuItem value="COMPLETED">Terminé</MenuItem>
                </TextField>
                {phase.items.map((item, itemIndex) => (
                  <Box key={itemIndex} sx={{ display: 'grid', gridTemplateColumns: '1fr 90px 40px', gap: 1 }}>
                    <CareTypeSelect
                      size="small"
                      value={item.careType}
                      onChange={(value) => {
                        const next = [...phases]
                        const items = [...phase.items]
                        items[itemIndex] = { ...item, careType: value, careTypeId: value?.id }
                        next[phaseIndex] = { ...phase, items }
                        setPhases(next)
                      }}
                    />
                    <TextField
                      size="small"
                      label="Dent"
                      value={item.toothNumber}
                      onChange={(event) => {
                        const next = [...phases]
                        const items = [...phase.items]
                        items[itemIndex] = { ...item, toothNumber: event.target.value }
                        next[phaseIndex] = { ...phase, items }
                        setPhases(next)
                      }}
                    />
                    <IconButton
                      onClick={() => {
                        const next = [...phases]
                        next[phaseIndex] = { ...phase, items: phase.items.filter((_, i) => i !== itemIndex) }
                        setPhases(next)
                      }}
                    >
                      <DeleteOutlineRoundedIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  size="small"
                  startIcon={<AddRoundedIcon />}
                  onClick={() => {
                    const next = [...phases]
                    next[phaseIndex] = { ...phase, items: [...phase.items, { careType: null, toothNumber: '', notes: '', status: 'PLANNED' }] }
                    setPhases(next)
                  }}
                >
                  Ajouter un acte
                </Button>
              </Box>
            </Box>
          ))}
          <Button startIcon={<AddRoundedIcon />} onClick={() => setPhases((items) => [...items, emptyPhase()])}>
            Ajouter une phase
          </Button>
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
