import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import ErrorAlert from '@/components/common/ErrorAlert'
import CareTypeSelect from '@/features/care-types/components/CareTypeSelect'
import PatientSelect from '@/features/patients/components/PatientSelect'
import { useAuth } from '@/context/AuthContext'
import { useConsultations } from '@/features/patients/hooks/useClinical'
import { useSaveInvoice } from '@/features/billing/hooks/useInvoices'
import { invoiceApi } from '@/features/billing/api/invoiceApi'
import { formatMoney, toDateInput } from '@/utils/format'
import { openPdf } from '@/utils/printPdf'

const emptyItem = () => ({ careType: null, description: '', toothNumber: '', quantity: 1, unitPrice: '' })

export default function InvoiceDialog({ open, onClose, patient: lockedPatient, invoice }) {
  const { hasPermission } = useAuth()
  const canSave = hasPermission('billing.create')
  const mutation = useSaveInvoice()
  const [patient, setPatient] = useState(lockedPatient || invoice?.patient || null)
  const [consultationId, setConsultationId] = useState(invoice?.consultationId ? String(invoice.consultationId) : '')
  const [items, setItems] = useState(invoice?.items?.length ? mapItems(invoice.items) : [emptyItem()])
  const { data: consultationsData } = useConsultations(
    { patient_id: patient?.id, per_page: 30 },
    { enabled: Boolean(patient?.id) && hasPermission('consultations.view') }
  )
  const consultations = patient?.id ? consultationsData?.items || [] : []

  const { register, handleSubmit } = useForm({
    values: {
      issued_at: toDateInput(invoice?.issuedAt || new Date()),
      status: invoice?.status || 'ISSUED',
      notes: invoice?.notes || '',
    },
  })

  useEffect(() => {
    if (!open) {
      return
    }
    setPatient(lockedPatient || invoice?.patient || null)
    setConsultationId(invoice?.consultationId ? String(invoice.consultationId) : '')
    setItems(invoice?.items?.length ? mapItems(invoice.items) : [emptyItem()])
  }, [open, lockedPatient, invoice])

  const applyConsultation = (id) => {
    setConsultationId(id)
    const consultation = consultations.find((item) => String(item.id) === String(id))
    if (!consultation?.procedures?.length) {
      return
    }
    setItems(
      consultation.procedures.map((procedure) => ({
        careType: procedure.careType || null,
        description: procedure.careType?.name || 'Acte',
        toothNumber: procedure.toothNumber || '',
        quantity: procedure.quantity || 1,
        unitPrice: '',
      }))
    )
  }

  const total = items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0), 0)

  const onSubmit = async (values) => {
    const payloadItems = items
      .filter((item) => item.description || item.careType?.id)
      .map((item) => ({
        care_type_id: item.careType?.id || null,
        description: item.description || item.careType?.name,
        tooth_number: item.toothNumber || null,
        quantity: Number(item.quantity || 1),
        unit_price: Number(item.unitPrice || 0),
      }))

    await mutation.mutateAsync({
      id: invoice?.id,
      payload: {
        ...values,
        patient_id: patient.id,
        consultation_id: consultationId || null,
        issued_at: new Date(`${values.issued_at}T09:00:00`).toISOString(),
        items: payloadItems,
      },
    })
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{invoice ? `Facture ${invoice.number}` : 'Nouvelle facture'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ display: 'grid', gap: 2 }}>
          <ErrorAlert message={mutation.error?.response?.data?.message} />
          {!lockedPatient ? <PatientSelect value={patient} onChange={setPatient} required /> : null}
          {consultations.length ? (
            <TextField
              select
              label="Consultation (optionnel)"
              value={consultationId}
              onChange={(event) => applyConsultation(event.target.value)}
            >
              <MenuItem value="">Sans consultation</MenuItem>
              {consultations.map((item) => (
                <MenuItem key={item.id} value={String(item.id)}>
                  {item.careType?.name || 'Consultation'} — {item.statusLabel}
                </MenuItem>
              ))}
            </TextField>
          ) : null}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <TextField type="date" label="Date" {...register('issued_at')} slotProps={{ inputLabel: { shrink: true } }} />
            <TextField select label="Statut" {...register('status')}>
              <MenuItem value="DRAFT">Brouillon</MenuItem>
              <MenuItem value="ISSUED">Émise</MenuItem>
              <MenuItem value="CANCELLED">Annulée</MenuItem>
            </TextField>
          </Box>
          <TextField label="Notes" multiline minRows={2} {...register('notes')} />

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ fontWeight: 700 }}>Lignes</Typography>
              <Button size="small" startIcon={<AddRoundedIcon />} onClick={() => setItems((rows) => [...rows, emptyItem()])}>
                Ajouter
              </Button>
            </Box>
            {items.map((item, index) => (
              <Box key={index} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.4fr 70px 110px 40px' }, gap: 1, mb: 1 }}>
                <CareTypeSelect
                  size="small"
                  label="Acte"
                  value={item.careType}
                  onChange={(careType) => {
                    const next = [...items]
                    next[index] = {
                      ...next[index],
                      careType,
                      description: careType?.name || next[index].description,
                    }
                    setItems(next)
                  }}
                />
                <TextField
                  size="small"
                  type="number"
                  label="Qté"
                  value={item.quantity}
                  onChange={(event) => {
                    const next = [...items]
                    next[index] = { ...next[index], quantity: event.target.value }
                    setItems(next)
                  }}
                />
                <TextField
                  size="small"
                  type="number"
                  label="Prix"
                  value={item.unitPrice}
                  onChange={(event) => {
                    const next = [...items]
                    next[index] = { ...next[index], unitPrice: event.target.value }
                    setItems(next)
                  }}
                />
                <IconButton onClick={() => setItems((rows) => rows.filter((_, i) => i !== index))}>
                  <DeleteOutlineRoundedIcon />
                </IconButton>
              </Box>
            ))}
            <Typography sx={{ fontWeight: 700, textAlign: 'right' }}>Total {formatMoney(total)}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          {invoice?.id ? (
            <Button onClick={() => openPdf(invoiceApi.pdf(invoice.id))}>Imprimer</Button>
          ) : null}
          <Button type="submit" variant="contained" disabled={mutation.isPending || !patient || !canSave}>
            Enregistrer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

function mapItems(items) {
  return items.map((item) => ({
    careType: item.careType || null,
    description: item.description || item.careType?.name || '',
    toothNumber: item.toothNumber || '',
    quantity: item.quantity || 1,
    unitPrice: item.unitPrice ?? '',
  }))
}
