import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import PageHeader from '@/components/common/PageHeader'
import EmptyState from '@/components/common/EmptyState'
import ErrorAlert from '@/components/common/ErrorAlert'
import LoadingScreen from '@/components/common/LoadingScreen'
import PermissionGuard from '@/components/common/PermissionGuard'
import PaymentDialog from '@/features/payments/components/PaymentDialog'
import { usePayments } from '@/features/payments/hooks/usePayments'
import { formatDate, formatMoney } from '@/utils/format'

export default function PaymentsPage() {
  const navigate = useNavigate()
  const { data, isLoading, error } = usePayments({ per_page: 40 })
  const items = data?.items || []
  const [open, setOpen] = useState(false)

  return (
    <>
      <PageHeader
        title="Paiements"
        subtitle="Règlements enregistrés sur les factures."
        actions={
          <PermissionGuard permission="payments.create">
            <Button variant="contained" onClick={() => setOpen(true)}>
              Nouveau paiement
            </Button>
          </PermissionGuard>
        }
      />
      <Card>
        {isLoading ? <LoadingScreen compact /> : null}
        <ErrorAlert message={error?.response?.data?.message} sx={{ m: 2 }} />
        {!isLoading && !items.length ? <EmptyState title="Aucun paiement" /> : null}
        {items.length ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Facture</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Mode</TableCell>
                <TableCell>Montant</TableCell>
                <TableCell>Référence</TableCell>
                <TableCell align="right">Fiche</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{formatDate(item.paidAt)}</TableCell>
                  <TableCell>{item.invoice?.number}</TableCell>
                  <TableCell>{item.invoice?.patient?.name}</TableCell>
                  <TableCell>{item.methodLabel}</TableCell>
                  <TableCell>{formatMoney(item.amount)}</TableCell>
                  <TableCell>{item.reference || '—'}</TableCell>
                  <TableCell align="right">
                    <Button size="small" onClick={() => navigate(`/patients/${item.invoice?.patientId}`)}>
                      Ouvrir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : null}
      </Card>
      <PaymentDialog open={open} onClose={() => setOpen(false)} />
    </>
  )
}
