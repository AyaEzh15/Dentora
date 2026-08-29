import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material'
import ErrorAlert from '@/components/common/ErrorAlert'
import PermissionGuard from '@/components/common/PermissionGuard'
import { useMedicalRecord, useSaveMedicalRecord } from '@/features/patients/hooks/useClinical'

export default function MedicalRecordPanel({ patientId, medicalAlert }) {
  const { data } = useMedicalRecord(patientId)
  const mutation = useSaveMedicalRecord(patientId)
  const { register, handleSubmit, reset } = useForm({
    values: {
      blood_type: data?.bloodType || '',
      allergies: data?.allergies || medicalAlert || '',
      chronic_diseases: data?.chronicDiseases || '',
      current_medications: data?.currentMedications || '',
      surgical_history: data?.surgicalHistory || '',
      dental_history: data?.dentalHistory || '',
      notes: data?.notes || '',
    },
  })

  useEffect(() => {
    if (data) {
      reset({
        blood_type: data.bloodType || '',
        allergies: data.allergies || medicalAlert || '',
        chronic_diseases: data.chronicDiseases || '',
        current_medications: data.currentMedications || '',
        surgical_history: data.surgicalHistory || '',
        dental_history: data.dentalHistory || '',
        notes: data.notes || '',
      })
    }
  }, [data, medicalAlert, reset])

  return (
    <Card>
      <CardContent>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Informations médicales
        </Typography>
        <ErrorAlert message={mutation.error?.response?.data?.message} sx={{ mb: 2 }} />
        <Box component="form" onSubmit={handleSubmit((values) => mutation.mutateAsync(values))} sx={{ display: 'grid', gap: 2 }}>
          <TextField label="Groupe sanguin" {...register('blood_type')} />
          <TextField label="Allergies" multiline minRows={2} {...register('allergies')} />
          <TextField label="Maladies chroniques" multiline minRows={2} {...register('chronic_diseases')} />
          <TextField label="Traitements en cours" multiline minRows={2} {...register('current_medications')} />
          <TextField label="Antécédents chirurgicaux" multiline minRows={2} {...register('surgical_history')} />
          <TextField label="Antécédents dentaires" multiline minRows={2} {...register('dental_history')} />
          <TextField label="Notes cliniques" multiline minRows={3} {...register('notes')} />
          <PermissionGuard permission="patients.update">
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" variant="contained" disabled={mutation.isPending}>
                Enregistrer le dossier
              </Button>
            </Box>
          </PermissionGuard>
        </Box>
      </CardContent>
    </Card>
  )
}
