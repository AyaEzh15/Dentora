import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import PageHeader from '@/components/common/PageHeader'
import EmptyState from '@/components/common/EmptyState'
import ErrorAlert from '@/components/common/ErrorAlert'
import LoadingScreen from '@/components/common/LoadingScreen'
import StatusChip from '@/components/common/StatusChip'
import { useConsultations } from '@/features/patients/hooks/useClinical'
import { formatDate } from '@/utils/format'

export default function ConsultationsPage() {
  const navigate = useNavigate()
  const [page] = useState(1)
  const { data, isLoading, error } = useConsultations({ page, per_page: 30 })
  const items = data?.items || []

  return (
    <>
      <PageHeader title="Consultations" subtitle="Historique clinique du cabinet." />
      <Card>
        {isLoading ? <LoadingScreen compact /> : null}
        <ErrorAlert message={error?.response?.data?.message} sx={{ m: 2 }} />
        {!isLoading && !items.length ? <EmptyState title="Aucune consultation" /> : null}
        {items.length ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Soin</TableCell>
                <TableCell>Dentiste</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="right">Fiche</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{formatDate(item.consultedAt)}</TableCell>
                  <TableCell>{item.patient?.name}</TableCell>
                  <TableCell>{item.careType?.name || '—'}</TableCell>
                  <TableCell>{item.dentist?.name}</TableCell>
                  <TableCell>
                    <StatusChip label={item.statusLabel} tone={item.status === 'COMPLETED' ? 'success' : 'muted'} />
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
