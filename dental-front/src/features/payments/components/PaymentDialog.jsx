import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material'
import ErrorAlert from '@/components/common/ErrorAlert'
import { useInvoices } from '@/features/billing/hooks/useInvoices'
import { PAYMENT_METHODS, useCreatePayment } from '@/features/payments/hooks/usePayments'
import { formatMoney, toDateInput } from '@/utils/format'

export default function PaymentDialog({ open, onClose, invoice: lockedInvoice, patientId }) {
  const mutation = useCreatePayment()
  const { data } = useInvoices({ per_page: 50, patient_id: patientId })
  const payable = useMemo(
    () => (data?.items || []).filter((item) => item.remainingAmount > 0 && item.status !== 'CANCELLED'),
    [data]
  )
  const [invoice, setInvoice] = useState(lockedInvoice || null)

  const remaining = Number(invoice?.remainingAmount || 0)

  const { register, handleSubmit, setValue } = useForm({
    values: {
      amount: remaining || '',
      method: 'CASH',
      paid_at: toDateInput(new Date()),
      reference: '',
      notes: '',
    },
  })

  useEffect(() => {
    if (!open) {
      return
    }
    const next = lockedInvoice || null
    setInvoice(next)
    setValue('amount', next?.remainingAmount || '')
  }, [open, lockedInvoice, setValue])

  const onSubmit = async (values) => {
    await mutation.mutateAsync({
      invoice_id: invoice.id,
      amount: Number(values.amount),
      method: values.method,
      paid_at: new Date(`${values.paid_at}T10:00:00`).toISOString(),
      reference: values.reference || null,
      notes: values.notes || null,
    })
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Enregistrer un paiement</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ display: 'grid', gap: 2 }}>
          <ErrorAlert message={mutation.error?.response?.data?.message} />
          {!lockedInvoice ? (
            <Autocomplete
              options={payable}
              value={invoice}
              isOptionEqualToValue={(option, selected) => option.id === selected.id}
              getOptionLabel={(option) => `${option.number} · ${option.patient?.name || ''} · reste ${formatMoney(option.remainingAmount)}`}
              onChange={(_, next) => {
                setInvoice(next)
                setValue('amount', next?.remainingAmount || '')
              }}
              renderInput={(params) => <TextField {...params} label="Facture" required />}
            />
          ) : (
            <TextField label="Facture" value={`${invoice?.number || ''} · reste ${formatMoney(remaining)}`} disabled />
          )}
          <TextField type="number" label="Montant (MAD)" required {...register('amount')} />
          <TextField select label="Mode" {...register('method')}>
            {PAYMENT_METHODS.map((method) => (
              <MenuItem key={method.value} value={method.value}>
                {method.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField type="date" label="Date" {...register('paid_at')} slotProps={{ inputLabel: { shrink: true } }} />
          <TextField label="Référence" {...register('reference')} />
          <TextField label="Notes" {...register('notes')} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained" disabled={mutation.isPending || !invoice}>
            Enregistrer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
