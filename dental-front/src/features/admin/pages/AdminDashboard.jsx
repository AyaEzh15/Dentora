import { useNavigate } from 'react-router-dom'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from '@mui/material'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import MedicalInformationOutlinedIcon from '@mui/icons-material/MedicalInformationOutlined'
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import PageHeader from '@/components/common/PageHeader'
import EmptyState from '@/components/common/EmptyState'
import ErrorAlert from '@/components/common/ErrorAlert'
import LoadingScreen from '@/components/common/LoadingScreen'
import StatusChip from '@/components/common/StatusChip'
import { useAuth } from '@/context/AuthContext'
import { useDashboard } from '@/features/dashboard/hooks/useDashboard'
import { formatMoney, initials } from '@/utils/format'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user, clinic } = useAuth()
  const { data, isLoading, error } = useDashboard()
  const dentists = data?.dentists || []

  const kpis = [
    {
      label: 'Dentistes',
      value: data?.kpis?.dentistsTotal ?? 0,
      icon: <MedicalInformationOutlinedIcon />,
      color: '#cfe5ff',
    },
    {
      label: 'Patients du cabinet',
      value: data?.kpis?.patientsTotal ?? 0,
      icon: <GroupsOutlinedIcon />,
      color: '#79f7e3',
    },
    {
      label: 'Personnel',
      value: data?.kpis?.staffTotal ?? 0,
      icon: <BadgeOutlinedIcon />,
      color: '#d5e3fc',
    },
    {
      label: 'CA encaissé (mois)',
      value: formatMoney(data?.kpis?.revenueThisMonth ?? 0),
      icon: <PaymentsOutlinedIcon />,
      color: '#76f4e0',
    },
    {
      label: 'Factures du mois',
      value: data?.kpis?.invoicesThisMonth ?? 0,
      icon: <PaymentsOutlinedIcon />,
      color: '#cfe5ff',
    },
    {
      label: 'Ordonnances du mois',
      value: data?.kpis?.prescriptionsThisMonth ?? 0,
      icon: <DescriptionOutlinedIcon />,
      color: '#d5e3fc',
    },
  ]

  return (
    <>
      <PageHeader
        title="Pilotage du cabinet"
        subtitle={`Vue générale de ${clinic?.name || 'la clinique'} — gestion des dentistes, du personnel et des modèles.`}
        actions={
          <Button variant="contained" onClick={() => navigate('/dentists')}>
            Gérer les dentistes
          </Button>
        }
      />

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Bienvenue, {user?.name}. Cet espace reste distinct de l’activité clinique quotidienne.
      </Typography>

      <ErrorAlert message={error?.response?.data?.message} sx={{ mb: 2 }} />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: 2, mb: 3 }}>
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

      {data?.kpis?.templatesMissing > 0 ? (
        <Card sx={{ mb: 3, bgcolor: 'error.light' }}>
          <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="h3" sx={{ color: 'error.dark' }}>
                Modèles Canva manquants
              </Typography>
              <Typography variant="body2" sx={{ color: 'error.dark' }}>
                {data.kpis.templatesMissing} dentiste(s) n’ont pas encore leurs PDF d’ordonnance et/ou de facture.
              </Typography>
            </Box>
            <Button variant="contained" startIcon={<PictureAsPdfOutlinedIcon />} onClick={() => navigate('/dentists')}>
              Compléter les modèles
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <Typography variant="h3" sx={{ mb: 2 }}>
        Dentistes du cabinet
      </Typography>

      {isLoading ? <LoadingScreen compact /> : null}
      {!isLoading && !dentists.length ? (
        <EmptyState title="Aucun dentiste" description="Ajoutez un dentiste depuis Personnel, puis associez ses modèles PDF." />
      ) : null}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
        {dentists.map((dentist) => (
          <Card key={dentist.id} sx={{ cursor: 'pointer' }} onClick={() => navigate(`/dentists/${dentist.id}`)}>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>{initials(dentist.name)}</Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="h3">{dentist.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {dentist.email}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1.5 }}>
                    <StatusChip label="Ordonnance" tone={dentist.hasPrescriptionTemplate ? 'success' : 'warning'} />
                    <StatusChip label="Facture" tone={dentist.hasInvoiceTemplate ? 'success' : 'warning'} />
                    <StatusChip label={dentist.isActive ? 'Actif' : 'Inactif'} tone={dentist.isActive ? 'info' : 'muted'} />
                  </Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {dentist.patientsCount || 0} patients · {dentist.invoicesCount || 0} factures · {dentist.prescriptionsCount || 0} ordonnances
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </>
  )
}
