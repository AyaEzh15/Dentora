import { useState } from 'react'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import EventOutlinedIcon from '@mui/icons-material/EventOutlined'
import PageHeader from '@/components/common/PageHeader'
import LoadingScreen from '@/components/common/LoadingScreen'
import ErrorAlert from '@/components/common/ErrorAlert'
import StatusChip from '@/components/common/StatusChip'
import EmptyState from '@/components/common/EmptyState'
import PermissionGuard from '@/components/common/PermissionGuard'
import AppointmentStatusSelect from '@/features/appointments/components/AppointmentStatusSelect'
import ConsultationDialog from '@/features/consultations/components/ConsultationDialog'
import TreatmentPlanDialog from '@/features/treatment-plans/components/TreatmentPlanDialog'
import MedicalRecordPanel from '@/features/patients/components/MedicalRecordPanel'
import OdontogramChart from '@/features/odontogram/components/OdontogramChart'
import { usePatient } from '@/features/patients/hooks/usePatients'
import {
  useConsultations,
  useOdontogram,
  useSaveOdontogram,
  useTreatmentPlans,
} from '@/features/patients/hooks/useClinical'
import { formatDate, formatTime, initials } from '@/utils/format'

const TABS = [
  { value: 'overview', label: 'Vue générale' },
  { value: 'medical', label: 'Informations médicales' },
  { value: 'odontogram', label: 'Dossier dentaire' },
  { value: 'consultations', label: 'Consultations' },
  { value: 'plans', label: 'Plan de traitement' },
]

export default function PatientDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const [consultationOpen, setConsultationOpen] = useState(false)
  const [editingConsultation, setEditingConsultation] = useState(null)
  const [planOpen, setPlanOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)
  const [selectedTooth, setSelectedTooth] = useState(null)

  const { data: patient, isLoading, error } = usePatient(id)
  const { data: consultationsData } = useConsultations({ patient_id: id, per_page: 30 })
  const { data: plansData } = useTreatmentPlans({ patient_id: id, per_page: 10 })
  const { data: teeth = [] } = useOdontogram(id)
  const saveOdontogram = useSaveOdontogram(id)

  const consultations = consultationsData?.items || []
  const plans = plansData?.items || []
  const activePlan = plans.find((item) => item.status === 'IN_PROGRESS') || plans[0]

  if (isLoading) {
    return <LoadingScreen />
  }

  if (error || !patient) {
    return <ErrorAlert message={error?.response?.data?.message || 'Patient introuvable.'} />
  }

  const changeTooth = (number, condition, notes) => {
    const payload = [
      ...teeth
        .filter((item) => item.toothNumber !== number)
        .map((item) => ({
          tooth_number: item.toothNumber,
          condition: item.condition,
          notes: item.notes,
        })),
      { tooth_number: number, condition, notes },
    ]
    saveOdontogram.mutate({ teeth: payload })
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
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1, flexWrap: 'wrap' }}>
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

      <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ mb: 2 }} variant="scrollable">
        {TABS.map((item) => (
          <Tab key={item.value} value={item.value} label={item.label} />
        ))}
      </Tabs>

      {tab === 'overview' ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '2fr 1fr' }, gap: 2 }}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h3">Plan de traitement en cours</Typography>
                  {activePlan ? <Chip label={activePlan.statusLabel} color="primary" size="small" /> : null}
                </Box>
                {activePlan ? (
                  <>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {activePlan.title} — {activePlan.description}
                    </Typography>
                    <Typography variant="overline">Progression {activePlan.progressPercent}%</Typography>
                    <LinearProgress variant="determinate" value={activePlan.progressPercent} sx={{ mb: 2, height: 8, borderRadius: 4 }} />
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: `repeat(${Math.min(activePlan.phases?.length || 1, 3)}, 1fr)` }, gap: 1.5 }}>
                      {(activePlan.phases || []).map((phase) => (
                        <Box key={phase.id} sx={{ p: 2, border: '1px solid', borderColor: phase.status === 'IN_PROGRESS' ? 'primary.main' : 'divider', borderRadius: 2 }}>
                          <Typography variant="overline" color={phase.status === 'COMPLETED' ? 'secondary.main' : 'text.secondary'}>
                            {phase.statusLabel}
                          </Typography>
                          <Typography sx={{ fontWeight: 700 }}>{phase.title}</Typography>
                          <Typography variant="body2" color="text.secondary">{phase.description}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </>
                ) : (
                  <EmptyState title="Aucun plan" description="Créez un plan de traitement depuis l’onglet dédié." />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h3" sx={{ mb: 2 }}>Rendez-vous</Typography>
                {!patient.appointments?.length ? (
                  <EmptyState title="Aucun rendez-vous" />
                ) : (
                  patient.appointments.map((appointment) => (
                    <Box key={appointment.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Box>
                        <Typography sx={{ fontWeight: 600 }}>
                          {formatDate(appointment.startAt)} · {formatTime(appointment.startAt)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {appointment.careType?.name || appointment.reason || 'Consultation'} · {appointment.dentist?.name}
                        </Typography>
                      </Box>
                      <AppointmentStatusSelect appointment={appointment} />
                    </Box>
                  ))
                )}
              </CardContent>
            </Card>
          </Box>

          <Card>
            <CardContent>
              <Typography variant="h3" sx={{ mb: 2 }}>Activité récente</Typography>
              {consultations.length ? (
                consultations.slice(0, 5).map((item) => (
                  <Box key={item.id} sx={{ mb: 2, pl: 2, borderLeft: '2px solid', borderColor: 'primary.main' }}>
                    <Typography variant="overline">{formatDate(item.consultedAt)}</Typography>
                    <Typography sx={{ fontWeight: 700 }}>{item.careType?.name || 'Consultation'}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.diagnosis || item.chiefComplaint || item.dentist?.name}</Typography>
                  </Box>
                ))
              ) : (
                <EmptyState title="Pas encore d’activité clinique" />
              )}
            </CardContent>
          </Card>
        </Box>
      ) : null}

      {tab === 'medical' ? <MedicalRecordPanel patientId={id} medicalAlert={patient.medicalAlert} /> : null}

      {tab === 'odontogram' ? (
        <Card>
          <CardContent>
            <Typography variant="h3" sx={{ mb: 2 }}>Odontogramme</Typography>
            <OdontogramChart
              teeth={teeth}
              selected={selectedTooth}
              onSelect={setSelectedTooth}
              onChangeCondition={changeTooth}
            />
          </CardContent>
        </Card>
      ) : null}

      {tab === 'consultations' ? (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h3">Consultations</Typography>
              <PermissionGuard permission="consultations.create">
                <Button
                  variant="contained"
                  onClick={() => {
                    setEditingConsultation(null)
                    setConsultationOpen(true)
                  }}
                >
                  Nouvelle consultation
                </Button>
              </PermissionGuard>
            </Box>
            {!consultations.length ? <EmptyState title="Aucune consultation" /> : null}
            {consultations.map((item) => (
              <Box
                key={item.id}
                onClick={() => {
                  setEditingConsultation(item)
                  setConsultationOpen(true)
                }}
                sx={{ p: 2, mb: 1, border: '1px solid', borderColor: 'divider', borderRadius: 2, cursor: 'pointer', '&:hover': { bgcolor: 'surface.containerLow' } }}
              >
                <Typography sx={{ fontWeight: 700 }}>
                  {formatDate(item.consultedAt)} · {item.careType?.name || 'Consultation'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.dentist?.name} · {item.statusLabel}
                </Typography>
                {item.diagnosis ? <Typography variant="body2" sx={{ mt: 0.5 }}>{item.diagnosis}</Typography> : null}
              </Box>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {tab === 'plans' ? (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h3">Plans de traitement</Typography>
              <PermissionGuard permission="treatments.create">
                <Button
                  variant="contained"
                  onClick={() => {
                    setEditingPlan(null)
                    setPlanOpen(true)
                  }}
                >
                  Nouveau plan
                </Button>
              </PermissionGuard>
            </Box>
            {!plans.length ? <EmptyState title="Aucun plan de traitement" /> : null}
            {plans.map((item) => (
              <Box
                key={item.id}
                onClick={() => {
                  setEditingPlan(item)
                  setPlanOpen(true)
                }}
                sx={{ p: 2, mb: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, cursor: 'pointer' }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ fontWeight: 700 }}>{item.title}</Typography>
                  <Chip size="small" label={item.statusLabel} />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{item.description}</Typography>
                <LinearProgress variant="determinate" value={item.progressPercent} sx={{ height: 6, borderRadius: 3 }} />
              </Box>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <ConsultationDialog
        open={consultationOpen}
        patient={patient}
        consultation={editingConsultation}
        onClose={() => setConsultationOpen(false)}
      />
      <TreatmentPlanDialog
        open={planOpen}
        patient={patient}
        plan={editingPlan}
        onClose={() => setPlanOpen(false)}
      />
    </>
  )
}
