import { useNavigate } from 'react-router-dom'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined'
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'
import PageHeader from '@/components/common/PageHeader'
import EmptyState from '@/components/common/EmptyState'
import ErrorAlert from '@/components/common/ErrorAlert'
import AppointmentStatusSelect from '@/features/appointments/components/AppointmentStatusSelect'
import AdminDashboard from '@/features/admin/pages/AdminDashboard'
import { useAuth } from '@/context/AuthContext'
import { useDashboard } from '@/features/dashboard/hooks/useDashboard'
import { formatTime, initials } from '@/utils/format'

export default function DashboardPage() {
  const { isAdmin } = useAuth()

  if (isAdmin) {
    return <AdminDashboard />
  }

  return <OperationalDashboard />
}

function OperationalDashboard() {
  const navigate = useNavigate()
  const { user, clinic } = useAuth()
  const { data, isLoading, error } = useDashboard()

  const kpis = [
    {
      label: "Rendez-vous aujourd'hui",
      value: data?.kpis?.appointmentsToday ?? 0,
      icon: <CalendarTodayOutlinedIcon />,
      color: '#cfe5ff',
    },
    {
      label: 'Patients en attente',
      value: data?.kpis?.patientsWaiting ?? 0,
      icon: <HourglassEmptyOutlinedIcon />,
      color: '#ffdad6',
    },
    {
      label: 'Patients du cabinet',
      value: data?.kpis?.patientsTotal ?? 0,
      icon: <GroupsOutlinedIcon />,
      color: '#79f7e3',
    },
    {
      label: 'RDV à venir aujourd’hui',
      value: data?.kpis?.upcomingToday ?? 0,
      icon: <EventAvailableOutlinedIcon />,
      color: '#d5e3fc',
    },
  ]

  return (
    <>
      <PageHeader
        title="Tableau de bord"
        subtitle={`Vue d'ensemble de ${clinic?.name || 'la clinique'}`}
        actions={
          <>
            <Button startIcon={<PersonAddOutlinedIcon />} onClick={() => navigate('/patients/new')}>
              Ajouter un patient
            </Button>
            <Button variant="contained" startIcon={<EventAvailableOutlinedIcon />} onClick={() => navigate('/appointments')}>
              Nouveau rdv
            </Button>
          </>
        }
      />

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Bienvenue, {user?.name}
      </Typography>

      <ErrorAlert message={error?.response?.data?.message} sx={{ mb: 2 }} />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 2 }}>
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {kpi.label}
                </Typography>
                <Typography variant="h2" sx={{ mt: 0.5 }}>
                  {isLoading ? '—' : kpi.value}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: kpi.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'primary.main',
                }}
              >
                {kpi.icon}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Card>
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h3">Rendez-vous du jour</Typography>
          <Button onClick={() => navigate('/appointments')}>Voir l'agenda complet</Button>
        </CardContent>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : null}
        {!isLoading && !data?.todayAppointments?.length ? (
          <EmptyState title="Aucun rendez-vous aujourd’hui" />
        ) : null}
        {data?.todayAppointments?.length ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Heure</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Type de soin</TableCell>
                <TableCell>Statut</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.todayAppointments.map((appointment) => (
                <TableRow key={appointment.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{formatTime(appointment.startAt)}</TableCell>
                  <TableCell>
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        fontSize: 10,
                        bgcolor: 'primary.light',
                        display: 'inline-flex',
                        mr: 1,
                      }}
                    >
                      {initials(appointment.patient?.name)}
                    </Avatar>
                    {appointment.patient?.name}
                  </TableCell>
                  <TableCell>{appointment.careType?.name || appointment.reason || '—'}</TableCell>
                  <TableCell>
                    <AppointmentStatusSelect appointment={appointment} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : null}
      </Card>
    </>
  )
}
