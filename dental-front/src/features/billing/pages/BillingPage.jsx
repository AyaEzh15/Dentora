import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import PageHeader from '@/components/common/PageHeader'
import EmptyState from '@/components/common/EmptyState'
import ErrorAlert from '@/components/common/ErrorAlert'
import LoadingScreen from '@/components/common/LoadingScreen'
import StatusChip from '@/components/common/StatusChip'
import PermissionGuard from '@/components/common/PermissionGuard'
import InvoiceDialog from '@/features/billing/components/InvoiceDialog'
import PaymentDialog from '@/features/payments/components/PaymentDialog'
import { invoiceStatusTone, useInvoices } from '@/features/billing/hooks/useInvoices'
import { invoiceApi } from '@/features/billing/api/invoiceApi'
import { formatDate, formatMoney } from '@/utils/format'
import { openPdf } from '@/utils/printPdf'

export default function BillingPage() {
  const navigate = useNavigate()
  const { data, isLoading, error } = useInvoices({ per_page: 30 })
  const items = data?.items || []
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [paymentInvoice, setPaymentInvoice] = useState(null)

  return (
    <>
      <PageHeader
        title="Factures"
        subtitle="Facturation des soins et suivi des règlements."
        actions={
          <PermissionGuard permission="billing.create">
            <Button
              variant="contained"
              onClick={() => {
                setEditing(null)
                setOpen(true)
              }}
            >
              Nouvelle facture
            </Button>
          </PermissionGuard>
        }
      />
      <Card>
        {isLoading ? <LoadingScreen compact /> : null}
        <ErrorAlert message={error?.response?.data?.message} sx={{ m: 2 }} />
        {!isLoading && !items.length ? <EmptyState title="Aucune facture" /> : null}
        {items.length ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>N°</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Reste</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.number}</TableCell>
                  <TableCell>{formatDate(item.issuedAt)}</TableCell>
                  <TableCell>{item.patient?.name}</TableCell>
                  <TableCell>{formatMoney(item.total)}</TableCell>
                  <TableCell>{formatMoney(item.remainingAmount)}</TableCell>
                  <TableCell>
                    <StatusChip label={item.statusLabel} tone={invoiceStatusTone(item.status)} />
                  </TableCell>
                  <TableCell align="right">
                    {item.remainingAmount > 0 && item.status !== 'CANCELLED' ? (
                      <PermissionGuard permission="payments.create">
                        <Button size="small" onClick={() => setPaymentInvoice(item)}>
                          Payer
                        </Button>
                      </PermissionGuard>
                    ) : null}
                    <Button
                      size="small"
                      onClick={() => {
                        setEditing(item)
                        setOpen(true)
                      }}
                    >
                      Ouvrir
                    </Button>
                    <Button size="small" onClick={() => openPdf(invoiceApi.pdf(item.id))}>
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
      <InvoiceDialog open={open} invoice={editing} onClose={() => setOpen(false)} />
      <PaymentDialog open={Boolean(paymentInvoice)} invoice={paymentInvoice} onClose={() => setPaymentInvoice(null)} />
    </>
  )
}
