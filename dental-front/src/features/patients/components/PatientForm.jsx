import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { patientSchema } from '@/features/patients/schemas/patientSchema'

const emptyValues = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  date_of_birth: '',
  gender: '',
  cin: '',
  address: '',
  city: '',
  medical_alert: '',
  notes: '',
  is_active: true,
}

export default function PatientForm({ defaultValues, onSubmit, submitLabel, loading }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: { ...emptyValues, ...defaultValues },
  })

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
        <Box>
          <Typography variant="overline">Prénom</Typography>
          <TextField {...register('first_name')} error={Boolean(errors.first_name)} helperText={errors.first_name?.message} />
        </Box>
        <Box>
          <Typography variant="overline">Nom</Typography>
          <TextField {...register('last_name')} error={Boolean(errors.last_name)} helperText={errors.last_name?.message} />
        </Box>
        <Box>
          <Typography variant="overline">E-mail</Typography>
          <TextField {...register('email')} error={Boolean(errors.email)} helperText={errors.email?.message} />
        </Box>
        <Box>
          <Typography variant="overline">Téléphone</Typography>
          <TextField {...register('phone')} />
        </Box>
        <Box>
          <Typography variant="overline">Date de naissance</Typography>
          <TextField type="date" {...register('date_of_birth')} InputLabelProps={{ shrink: true }} />
        </Box>
        <FormControl>
          <Typography variant="overline">Genre</Typography>
          <TextField select defaultValue={defaultValues?.gender || ''} {...register('gender')}>
            <MenuItem value="">Non renseigné</MenuItem>
            <MenuItem value="FEMALE">Femme</MenuItem>
            <MenuItem value="MALE">Homme</MenuItem>
            <MenuItem value="OTHER">Autre</MenuItem>
          </TextField>
        </FormControl>
        <Box>
          <Typography variant="overline">CIN</Typography>
          <TextField {...register('cin')} />
        </Box>
        <Box>
          <Typography variant="overline">Ville</Typography>
          <TextField {...register('city')} />
        </Box>
        <Box sx={{ gridColumn: '1 / -1' }}>
          <Typography variant="overline">Adresse</Typography>
          <TextField {...register('address')} />
        </Box>
        <Box sx={{ gridColumn: '1 / -1' }}>
          <Typography variant="overline">Alerte médicale</Typography>
          <TextField {...register('medical_alert')} placeholder="Allergies, contre-indications..." />
        </Box>
        <Box sx={{ gridColumn: '1 / -1' }}>
          <Typography variant="overline">Notes</Typography>
          <TextField {...register('notes')} multiline minRows={3} />
        </Box>
      </Box>

      <FormControlLabel
        sx={{ mt: 2 }}
        control={
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <Switch checked={Boolean(field.value)} onChange={(_, value) => field.onChange(value)} />
            )}
          />
        }
        label="Patient actif"
      />

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="submit" variant="contained" disabled={loading}>
          {submitLabel}
        </Button>
      </Box>
    </Box>
  )
}
