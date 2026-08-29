import { useNavigate } from 'react-router-dom'
import { Button, Card, LinearProgress, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import PageHeader from '@/components/common/PageHeader'
import EmptyState from '@/components/common/EmptyState'
import ErrorAlert from '@/components/common/ErrorAlert'
import LoadingScreen from '@/components/common/LoadingScreen'
import StatusChip from '@/components/common/StatusChip'
import { useTreatmentPlans } from '@/features/patients/hooks/useClinical'

export default function TreatmentPlansPage() {
  const navigate = useNavigate()
  const { data, isLoading, error } = useTreatmentPlans({ per_page: 30 })
  const items = data?.items || []

  return (
    <>
      <PageHeader title="Plans de traitement" subtitle="Suivi des plans en cours et terminés." />
      <Card>
        {isLoading ? <LoadingScreen compact /> : null}
        <ErrorAlert message={error?.response?.data?.message} sx={{ m: 2 }} />
        {!isLoading && !items.length ? <EmptyState title="Aucun plan" /> : null}
        {items.length ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Plan</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Dentiste</TableCell>
                <TableCell>Progression</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="right">Fiche</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.patient?.name}</TableCell>
                  <TableCell>{item.dentist?.name}</TableCell>
                  <TableCell sx={{ minWidth: 140 }}>
                    <LinearProgress variant="determinate" value={item.progressPercent} sx={{ height: 6, borderRadius: 3 }} />
                  </TableCell>
                  <TableCell>
                    <StatusChip label={item.statusLabel} tone={item.status === 'COMPLETED' ? 'success' : 'info'} />
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" onClick={() => navigate(`/patients/${item.patientId}`)}>
                      Ouvrir
                    </Button>
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
