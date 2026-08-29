import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import PageHeader from '@/components/common/PageHeader'
import EmptyState from '@/components/common/EmptyState'
import ErrorAlert from '@/components/common/ErrorAlert'
import LoadingScreen from '@/components/common/LoadingScreen'
import AgendaDay from '@/features/appointments/components/AgendaDay'
import AgendaMonth from '@/features/appointments/components/AgendaMonth'
import AgendaWeek from '@/features/appointments/components/AgendaWeek'
import AppointmentDetailsDialog from '@/features/appointments/components/AppointmentDetailsDialog'
import AppointmentDialog from '@/features/appointments/components/AppointmentDialog'
import AppointmentStatusSelect from '@/features/appointments/components/AppointmentStatusSelect'
import MiniCalendar from '@/features/appointments/components/MiniCalendar'
import WaitingRoom from '@/features/appointments/components/WaitingRoom'
import { APPOINTMENT_STATUSES } from '@/features/appointments/constants/appointmentStatuses'
import { useAppointmentCalendar, useAppointments } from '@/features/appointments/hooks/useAppointments'
import { useAuth } from '@/context/AuthContext'
import {
  addDays,
  addMonths,
  formatDayLabel,
  formatMonthLabel,
  formatWeekLabel,
  rangeForView,
  startOfDay,
} from '@/features/appointments/utils/agenda'
import CareTypeSelect from '@/features/care-types/components/CareTypeSelect'
import { careLabel } from '@/features/care-types/utils/careLabel'
import { usePatient } from '@/features/patients/hooks/usePatients'
import { useDentists } from '@/features/users/hooks/useUsers'
import { formatDate, formatTime } from '@/utils/format'

const VIEWS = [
  { value: 'day', label: 'Jour' },
  { value: 'week', label: 'Semaine' },
  { value: 'month', label: 'Mois' },
  { value: 'list', label: 'Liste' },
]

export default function AppointmentsPage() {
  const [params] = useSearchParams()
  const { hasRole } = useAuth()
  const isDentist = hasRole('DENTIST')
  const { data: prefilledPatient } = usePatient(params.get('patientId'))
  const [view, setView] = useState('day')
  const [anchor, setAnchor] = useState(startOfDay(new Date()))
  const [status, setStatus] = useState('all')
  const [dentistId, setDentistId] = useState('all')
  const [careType, setCareType] = useState(null)
  const [createOpen, setCreateOpen] = useState(Boolean(params.get('patientId')))
  const [slotStart, setSlotStart] = useState(null)
  const [selected, setSelected] = useState(null)
  const { data: dentists = [] } = useDentists()

  const selectedDentistId = isDentist || dentistId === 'all' ? undefined : dentistId
  const selectedStatus = status === 'all' ? undefined : status

  const range = rangeForView(view === 'list' ? 'week' : view, anchor)
  const calendarQuery = useAppointmentCalendar({
    ...range,
    dentist_id: selectedDentistId,
    care_type_id: careType?.id,
  })
  const listQuery = useAppointments({
    status: selectedStatus,
    dentist_id: selectedDentistId,
    care_type_id: careType?.id,
    per_page: 40,
  })

  const appointments = useMemo(() => {
    const items = calendarQuery.data || []
    return selectedStatus ? items.filter((item) => item.status === selectedStatus) : items
  }, [calendarQuery.data, selectedStatus])

  const title =
    view === 'day' ? formatDayLabel(anchor) : view === 'month' ? formatMonthLabel(anchor) : formatWeekLabel(anchor)

  const goToday = () => setAnchor(startOfDay(new Date()))
  const goPrev = () => {
    if (view === 'month') {
      setAnchor(addMonths(anchor, -1))
      return
    }
    setAnchor(addDays(anchor, view === 'day' ? -1 : -7))
  }
  const goNext = () => {
    if (view === 'month') {
      setAnchor(addMonths(anchor, 1))
      return
    }
    setAnchor(addDays(anchor, view === 'day' ? 1 : 7))
  }

  const openCreate = (date) => {
    setSlotStart(date || new Date())
    setCreateOpen(true)
  }

  return (
    <>
      <PageHeader
        title="Agenda"
        subtitle="Planifiez et suivez les rendez-vous du cabinet."
        actions={
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => openCreate(new Date())}>
            Nouveau rendez-vous
          </Button>
        }
      />

      <Card sx={{ p: 2, mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
          <Button onClick={goToday} sx={{ borderRadius: 0 }}>
            Aujourd&apos;hui
          </Button>
          <Button onClick={goPrev} sx={{ minWidth: 40, borderRadius: 0, borderLeft: '1px solid', borderColor: 'divider' }}>
            <ChevronLeftRoundedIcon />
          </Button>
          <Button onClick={goNext} sx={{ minWidth: 40, borderRadius: 0, borderLeft: '1px solid', borderColor: 'divider' }}>
            <ChevronRightRoundedIcon />
          </Button>
        </Box>
        <Typography variant="h3" sx={{ flex: 1, minWidth: 200, textTransform: 'capitalize' }}>
          {title}
        </Typography>
        {!isDentist ? (
          <TextField
            select
            size="small"
            label="Praticien"
            value={dentistId}
            onChange={(event) => setDentistId(event.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="all">Tous les praticiens</MenuItem>
            {dentists.map((dentist) => (
              <MenuItem key={dentist.id} value={String(dentist.id)}>
                {dentist.name}
              </MenuItem>
            ))}
          </TextField>
        ) : null}
        <CareTypeSelect
          size="small"
          label="Type de soin"
          value={careType}
          onChange={setCareType}
          allowAll
          sx={{ minWidth: 240 }}
        />
        <TextField
          select
          size="small"
          label="Statut"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">Tous les statuts</MenuItem>
          {APPOINTMENT_STATUSES.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </TextField>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={view}
          onChange={(_, value) => value && setView(value)}
        >
          {VIEWS.map((item) => (
            <ToggleButton key={item.value} value={item.value}>
              {item.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Card>

      <ErrorAlert message={calendarQuery.error?.response?.data?.message} sx={{ mb: 2 }} />

      {view === 'list' ? (
        <Card>
          {listQuery.isLoading ? <LoadingScreen compact /> : null}
          {!listQuery.isLoading && !listQuery.data?.items?.length ? (
            <EmptyState title="Aucun rendez-vous" description="Cliquez sur un créneau du calendrier pour en créer un." />
          ) : null}
          {listQuery.data?.items?.length ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Heure</TableCell>
                  <TableCell>Patient</TableCell>
                  <TableCell>Soin</TableCell>
                  {!isDentist ? <TableCell>Dentiste</TableCell> : null}
                  <TableCell>Statut</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listQuery.data.items.map((appointment) => (
                  <TableRow key={appointment.id} hover onClick={() => setSelected(appointment)} sx={{ cursor: 'pointer' }}>
                    <TableCell>{formatDate(appointment.startAt)}</TableCell>
                    <TableCell>
                      {formatTime(appointment.startAt)} – {formatTime(appointment.endAt)}
                    </TableCell>
                    <TableCell>{appointment.patient?.name}</TableCell>
                    <TableCell>{careLabel(appointment)}</TableCell>
                    {!isDentist ? <TableCell>{appointment.dentist?.name}</TableCell> : null}
                    <TableCell onClick={(event) => event.stopPropagation()}>
                      <AppointmentStatusSelect appointment={appointment} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
        </Card>
      ) : (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch', flexDirection: { xs: 'column', lg: 'row' } }}>
          <Box sx={{ width: { xs: '100%', lg: 280 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <MiniCalendar
              value={anchor}
              onChange={(day) => {
                setAnchor(startOfDay(day))
                setView('day')
              }}
            />
            <WaitingRoom appointments={appointments} onSelect={setSelected} />
          </Box>
          <Card sx={{ flex: 1, overflow: 'hidden', minHeight: 640 }}>
            {calendarQuery.isLoading ? <LoadingScreen compact /> : null}
            {!calendarQuery.isLoading && view === 'month' ? (
              <AgendaMonth
                anchor={anchor}
                appointments={appointments}
                onDayClick={(day) => {
                  setAnchor(startOfDay(day))
                  setView('day')
                }}
                onSelect={setSelected}
              />
            ) : null}
            {!calendarQuery.isLoading && view === 'week' ? (
              <AgendaWeek
                anchor={anchor}
                appointments={appointments}
                onSlotClick={openCreate}
                onSelect={setSelected}
              />
            ) : null}
            {!calendarQuery.isLoading && view === 'day' ? (
              <AgendaDay
                date={anchor}
                appointments={appointments}
                onSlotClick={openCreate}
                onSelect={setSelected}
              />
            ) : null}
          </Card>
        </Box>
      )}

      <AppointmentDialog
        open={createOpen}
        defaultStart={slotStart}
        defaultPatient={prefilledPatient}
        onClose={() => {
          setCreateOpen(false)
          setSlotStart(null)
        }}
      />
      <AppointmentDetailsDialog appointment={selected} onClose={() => setSelected(null)} />
    </>
  )
}
