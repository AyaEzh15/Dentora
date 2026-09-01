import { useNavigate } from 'react-router-dom'
import { Avatar, Box, Button, Card, CardContent, Typography } from '@mui/material'
import PageHeader from '@/components/common/PageHeader'
import EmptyState from '@/components/common/EmptyState'
import ErrorAlert from '@/components/common/ErrorAlert'
import LoadingScreen from '@/components/common/LoadingScreen'
import StatusChip from '@/components/common/StatusChip'
import { useDentists } from '@/features/users/hooks/useUsers'
import { initials } from '@/utils/format'

export default function DentistsPage() {
  const navigate = useNavigate()
  const { data: dentists = [], isLoading, error } = useDentists()

  return (
    <>
      <PageHeader
        title="Dentistes"
        subtitle="Accédez aux patients de chaque dentiste et gérez ses modèles Canva (factures et ordonnances)."
        actions={
          <Button variant="contained" onClick={() => navigate('/users')}>
            Ajouter un membre
          </Button>
        }
      />

      <ErrorAlert message={error?.response?.data?.message} sx={{ mb: 2 }} />
      {isLoading ? <LoadingScreen compact /> : null}
      {!isLoading && !dentists.length ? (
        <EmptyState
          title="Aucun dentiste"
          description="Créez un compte dentiste dans Personnel, puis importez ses PDF Canva ici."
        />
      ) : null}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
        {dentists.map((dentist) => (
          <Card key={dentist.id}>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>{initials(dentist.name)}</Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h3">{dentist.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dentist.email} {dentist.phone ? `· ${dentist.phone}` : ''}
                  </Typography>
                </Box>
                <StatusChip label={dentist.isActive ? 'Actif' : 'Inactif'} tone={dentist.isActive ? 'success' : 'muted'} />
              </Box>

              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                <StatusChip label="PDF ordonnance" tone={dentist.hasPrescriptionTemplate ? 'success' : 'warning'} />
                <StatusChip label="PDF facture" tone={dentist.hasInvoiceTemplate ? 'success' : 'warning'} />
              </Box>

              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                {dentist.patientsCount || 0} patients · {dentist.invoicesCount || 0} factures · {dentist.prescriptionsCount || 0} ordonnances
              </Typography>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" onClick={() => navigate(`/dentists/${dentist.id}`)}>
                  Voir les patients
                </Button>
                <Button onClick={() => navigate(`/dentists/${dentist.id}?tab=templates`)}>
                  Modèles Canva
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </>
  )
}
