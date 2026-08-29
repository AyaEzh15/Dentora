import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Typography,
} from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import EventOutlinedIcon from '@mui/icons-material/EventOutlined'
import PageHeader from '@/components/common/PageHeader'
import LoadingScreen from '@/components/common/LoadingScreen'
import ErrorAlert from '@/components/common/ErrorAlert'
import StatusChip from '@/components/common/StatusChip'
import EmptyState from '@/components/common/EmptyState'
import AppointmentStatusSelect from '@/features/appointments/components/AppointmentStatusSelect'
import { usePatient } from '@/features/patients/hooks/usePatients'
import { formatDate, formatTime, initials } from '@/utils/format'

export default function PatientDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: patient, isLoading, error } = usePatient(id)

  if (isLoading) {
    return <LoadingScreen />
  }

  if (error || !patient) {
    return <ErrorAlert message={error?.response?.data?.message || 'Patient introuvable.'} />
  }

  return (
    <>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
        <Box component={RouterLink} to="/patients" sx={{ color: 'inherit', textDecoration: 'none' }}>
          Patients
        </Box>
        {' / '}
        {patient.name}
      </Typography>

      <PageHeader
        title={patient.name}
        subtitle={patient.fileNumber}
        actions={
          <>
            <Button startIcon={<EventOutlinedIcon />} onClick={() => navigate(`/appointments?patientId=${patient.id}`)}>
              Nouveau RDV
            </Button>
            <Button variant="contained" startIcon={<EditOutlinedIcon />} onClick={() => navigate(`/patients/${id}/edit`)}>
              Modifier
            </Button>
          </>
        }
      />

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
          <Avatar sx={{ width: 88, height: 88, bgcolor: 'primary.main', fontSize: 28 }}>
            {initials(patient.name)}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 240 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
              <Typography variant="h2">{patient.name}</Typography>
              <Chip label={patient.fileNumber} size="small" />
              <StatusChip label={patient.isActive ? 'Actif' : 'Inactif'} tone={patient.isActive ? 'success' : 'muted'} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {[patient.age ? `${patient.age} ans` : null, patient.genderLabel, patient.dateOfBirth ? `Né(e) le ${formatDate(patient.dateOfBirth)}` : null]
                .filter(Boolean)
                .join(' • ')}
            </Typography>
            <Typography variant="body2">
              {patient.phone || '—'} · {patient.email || 'Pas d’e-mail'}
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
          <Box sx={{ minWidth: 200 }}>
            <Typography variant="overline">Dernière visite</Typography>
            <Typography sx={{ fontWeight: 600, mb: 1 }}>{formatDate(patient.lastVisitAt)}</Typography>
            <Typography variant="overline">Prochain RDV</Typography>
            <Typography sx={{ fontWeight: 600, color: 'primary.main' }}>{formatDate(patient.nextAppointmentAt)}</Typography>
          </Box>
          {patient.medicalAlert ? (
            <Box sx={{ bgcolor: 'error.light', p: 2, borderRadius: 2, minWidth: 220 }}>
              <Typography variant="overline" sx={{ color: 'error.dark' }}>
                Alerte médicale
              </Typography>
              <Typography variant="body2" sx={{ color: 'error.dark', fontWeight: 600 }}>
                {patient.medicalAlert}
              </Typography>
            </Box>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Rendez-vous
          </Typography>
          {!patient.appointments?.length ? (
            <EmptyState title="Aucun rendez-vous" description="Planifiez un premier rendez-vous pour ce patient." />
          ) : (
            patient.appointments.map((appointment) => (
              <Box
                key={appointment.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  py: 1.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>
                    {formatDate(appointment.startAt)} · {formatTime(appointment.startAt)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {appointment.reason || 'Consultation'} · {appointment.dentist?.name}
                  </Typography>
                </Box>
                <AppointmentStatusSelect appointment={appointment} />
              </Box>
            ))
          )}
        </CardContent>
      </Card>
    </>
  )
}
