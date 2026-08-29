import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import PageHeader from '@/components/common/PageHeader'
import EmptyState from '@/components/common/EmptyState'
import ErrorAlert from '@/components/common/ErrorAlert'
import LoadingScreen from '@/components/common/LoadingScreen'
import { useConsultations } from '@/features/patients/hooks/useClinical'
import { formatDate } from '@/utils/format'

export default function ProceduresPage() {
  const navigate = useNavigate()
  const { data, isLoading, error } = useConsultations({ per_page: 50 })
  const items = useMemo(
    () =>
      (data?.items || []).flatMap((consultation) =>
        (consultation.procedures || []).map((procedure) => ({
          ...procedure,
          consultedAt: consultation.consultedAt,
          patient: consultation.patient,
          patientId: consultation.patientId,
          dentist: consultation.dentist,
        }))
      ),
    [data]
  )

  return (
    <>
      <PageHeader
        title="Actes"
        subtitle="Actes réalisés lors des consultations. Le catalogue se gère dans Types de soins."
      />
      <Card>
        {isLoading ? <LoadingScreen compact /> : null}
        <ErrorAlert message={error?.response?.data?.message} sx={{ m: 2 }} />
        {!isLoading && !items.length ? <EmptyState title="Aucun acte enregistré" /> : null}
        {items.length ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Acte</TableCell>
                <TableCell>Dent</TableCell>
                <TableCell>Qté</TableCell>
                <TableCell>Dentiste</TableCell>
                <TableCell align="right">Fiche</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={`${item.id}-${item.patientId}`} hover>
                  <TableCell>{formatDate(item.consultedAt)}</TableCell>
                  <TableCell>{item.patient?.name}</TableCell>
                  <TableCell>{item.careType?.name}</TableCell>
                  <TableCell>{item.toothNumber || '—'}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.dentist?.name}</TableCell>
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
