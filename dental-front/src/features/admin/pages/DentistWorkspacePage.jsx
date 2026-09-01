import { useState } from 'react'
import { Link as RouterLink, useParams, useSearchParams } from 'react-router-dom'
import { Box, Button, Card, CardContent, Tab, Tabs, TextField, Typography } from '@mui/material'
import PageHeader from '@/components/common/PageHeader'
import EmptyState from '@/components/common/EmptyState'
import ErrorAlert from '@/components/common/ErrorAlert'
import LoadingScreen from '@/components/common/LoadingScreen'
import StatusChip from '@/components/common/StatusChip'
import PatientTable from '@/features/patients/components/PatientTable'
import { usePatients } from '@/features/patients/hooks/usePatients'
import { useUploadTemplates, useUser } from '@/features/users/hooks/useUsers'

export default function DentistWorkspacePage() {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') === 'templates' ? 'templates' : 'patients'
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data: dentist, isLoading, error } = useUser(id)
  const { data: patientsData, isLoading: patientsLoading, error: patientsError } = usePatients({
    dentist_id: id,
    search,
    page,
  })

  const setTab = (value) => {
    setSearchParams(value === 'templates' ? { tab: 'templates' } : {})
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  if (error || !dentist || dentist.role !== 'DENTIST') {
    return <ErrorAlert message={error?.response?.data?.message || 'Dentiste introuvable.'} />
  }

  return (
    <>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
        <Box component={RouterLink} to="/dentists" sx={{ color: 'inherit', textDecoration: 'none' }}>
          Dentistes
        </Box>
        {' / '}
        {dentist.name}
      </Typography>

      <PageHeader
        title={dentist.name}
        subtitle={`${dentist.email}${dentist.phone ? ` · ${dentist.phone}` : ''} — espace administrateur`}
      />

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        <StatusChip label="Ordonnance" tone={dentist.hasPrescriptionTemplate ? 'success' : 'warning'} />
        <StatusChip label="Facture" tone={dentist.hasInvoiceTemplate ? 'success' : 'warning'} />
        <StatusChip label={`${patientsData?.meta?.total ?? dentist.patientsCount ?? 0} patients`} tone="info" />
      </Box>

      <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ mb: 2 }}>
        <Tab value="patients" label="Patients" />
        <Tab value="templates" label="Modèles Canva" />
      </Tabs>

      {tab === 'patients' ? (
        <>
          <Card sx={{ p: 2, mb: 2 }}>
            <TextField
              placeholder="Rechercher un patient de ce dentiste…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              sx={{ maxWidth: 320 }}
            />
          </Card>
          <Card>
            {patientsLoading ? <LoadingScreen compact /> : null}
            <ErrorAlert message={patientsError?.response?.data?.message} sx={{ m: 2 }} />
            {!patientsLoading ? (
              <PatientTable
                items={patientsData?.items || []}
                meta={patientsData?.meta}
                page={page}
                onPageChange={setPage}
                readOnly
                fromDentist={id}
              />
            ) : null}
          </Card>
        </>
      ) : (
        <DentistTemplatesPanel dentist={dentist} />
      )}
    </>
  )
}

function DentistTemplatesPanel({ dentist }) {
  const mutation = useUploadTemplates()
  const [prescriptionFile, setPrescriptionFile] = useState(null)
  const [invoiceFile, setInvoiceFile] = useState(null)

  const submit = async (event) => {
    event.preventDefault()
    if (!prescriptionFile && !invoiceFile) {
      return
    }

    const formData = new FormData()
    if (prescriptionFile) {
      formData.append('prescription_template', prescriptionFile)
    }
    if (invoiceFile) {
      formData.append('invoice_template', invoiceFile)
    }
    await mutation.mutateAsync({ id: dentist.id, payload: formData })
    setPrescriptionFile(null)
    setInvoiceFile(null)
  }

  return (
    <Box component="form" onSubmit={submit} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
      <Card>
        <CardContent>
          <Typography variant="h3" sx={{ mb: 1 }}>
            Ordonnance
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Importez le PDF Canva propre à ce dentiste. Il sera utilisé uniquement pour ses ordonnances.
          </Typography>
          <Box sx={{ mb: 2 }}>
            <StatusChip
              label={dentist.hasPrescriptionTemplate ? 'Modèle enregistré' : 'Aucun modèle'}
              tone={dentist.hasPrescriptionTemplate ? 'success' : 'warning'}
            />
          </Box>
          <TextField
            type="file"
            label="PDF Canva ordonnance"
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { accept: 'application/pdf' } }}
            onChange={(event) => setPrescriptionFile(event.target.files?.[0] || null)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h3" sx={{ mb: 1 }}>
            Facture
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Importez le PDF Canva de facture de ce dentiste. Chaque praticien conserve son propre en-tête.
          </Typography>
          <Box sx={{ mb: 2 }}>
            <StatusChip
              label={dentist.hasInvoiceTemplate ? 'Modèle enregistré' : 'Aucun modèle'}
              tone={dentist.hasInvoiceTemplate ? 'success' : 'warning'}
            />
          </Box>
          <TextField
            type="file"
            label="PDF Canva facture"
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { accept: 'application/pdf' } }}
            onChange={(event) => setInvoiceFile(event.target.files?.[0] || null)}
          />
        </CardContent>
      </Card>

      <Box sx={{ gridColumn: '1 / -1' }}>
        <ErrorAlert message={mutation.error?.response?.data?.message} sx={{ mb: 2 }} />
        {!prescriptionFile && !invoiceFile && !dentist.hasPrescriptionTemplate && !dentist.hasInvoiceTemplate ? (
          <EmptyState title="Aucun fichier sélectionné" description="Choisissez le PDF d’ordonnance et/ou de facture exporté depuis Canva." />
        ) : null}
        <Button type="submit" variant="contained" disabled={mutation.isPending || (!prescriptionFile && !invoiceFile)}>
          Enregistrer les modèles
        </Button>
      </Box>
    </Box>
  )
}
