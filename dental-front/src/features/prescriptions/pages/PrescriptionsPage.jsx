import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import PageHeader from '@/components/common/PageHeader'
import EmptyState from '@/components/common/EmptyState'
import ErrorAlert from '@/components/common/ErrorAlert'
import LoadingScreen from '@/components/common/LoadingScreen'
import StatusChip from '@/components/common/StatusChip'
import PermissionGuard from '@/components/common/PermissionGuard'
import PrescriptionDialog from '@/features/prescriptions/components/PrescriptionDialog'
import { usePrescriptions } from '@/features/prescriptions/hooks/usePrescriptions'
import { prescriptionApi } from '@/features/prescriptions/api/prescriptionApi'
import { formatDate } from '@/utils/format'
import { openPdf } from '@/utils/printPdf'

export default function PrescriptionsPage() {
  const navigate = useNavigate()
  const { data, isLoading, error } = usePrescriptions({ per_page: 30 })
  const items = data?.items || []
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  return (
    <>
      <PageHeader
        title="Ordonnances"
        subtitle="Prescriptions délivrées aux patients."
        actions={
          <PermissionGuard permission="prescriptions.create">
            <Button
              variant="contained"
              onClick={() => {
                setEditing(null)
                setOpen(true)
              }}
            >
              Nouvelle ordonnance
            </Button>
          </PermissionGuard>
        }
      />
      <Card>
        {isLoading ? <LoadingScreen compact /> : null}
        <ErrorAlert message={error?.response?.data?.message} sx={{ m: 2 }} />
        {!isLoading && !items.length ? <EmptyState title="Aucune ordonnance" /> : null}
        {items.length ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>N°</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Dentiste</TableCell>
                <TableCell>Médicaments</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.number}</TableCell>
                  <TableCell>{formatDate(item.prescribedAt)}</TableCell>
                  <TableCell>{item.patient?.name}</TableCell>
                  <TableCell>{item.dentist?.name}</TableCell>
                  <TableCell>{(item.items || []).map((line) => line.medication).join(', ') || '—'}</TableCell>
                  <TableCell>
                    <StatusChip label={item.statusLabel} tone={item.status === 'ISSUED' ? 'success' : 'muted'} />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      onClick={() => {
                        setEditing(item)
                        setOpen(true)
                      }}
                    >
                      Ouvrir
                    </Button>
                    <Button size="small" onClick={() => openPdf(prescriptionApi.pdf(item.id))}>
                      Imprimer
                    </Button>
                    <Button size="small" onClick={() => navigate(`/patients/${item.patientId}`)}>
                      Fiche
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : null}
      </Card>
      <PrescriptionDialog open={open} prescription={editing} onClose={() => setOpen(false)} />
    </>
  )
}
