import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Card, MenuItem, TextField } from '@mui/material'
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'
import PageHeader from '@/components/common/PageHeader'
import PermissionGuard from '@/components/common/PermissionGuard'
import LoadingScreen from '@/components/common/LoadingScreen'
import ErrorAlert from '@/components/common/ErrorAlert'
import PatientTable from '@/features/patients/components/PatientTable'
import { usePatients } from '@/features/patients/hooks/usePatients'

export default function PatientsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const { data, isLoading, error } = usePatients({
    search,
    is_active: status,
    page,
  })

  return (
    <>
      <PageHeader
        title="Gestion des Patients"
        subtitle="Gérez vos dossiers patients, rendez-vous et historiques médicaux."
        actions={
          <PermissionGuard permission="patients.create">
            <Button
              variant="contained"
              startIcon={<PersonAddOutlinedIcon />}
              onClick={() => navigate('/patients/new')}
              sx={{ bgcolor: 'secondary.container', color: 'secondary.onContainer', '&:hover': { bgcolor: 'secondary.light' } }}
            >
              Nouveau Patient
            </Button>
          </PermissionGuard>
        }
      />

      <Card sx={{ p: 2, mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Nom, ID, Téléphone..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            setPage(1)
          }}
          sx={{ maxWidth: 280 }}
        />
        <TextField
          select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value)
            setPage(1)
          }}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">Tous les statuts</MenuItem>
          <MenuItem value="true">Actif</MenuItem>
          <MenuItem value="false">Inactif</MenuItem>
        </TextField>
      </Card>

      <Card>
        {isLoading ? <LoadingScreen compact /> : null}
        <ErrorAlert message={error?.response?.data?.message} sx={{ m: 2 }} />
        {!isLoading ? (
          <PatientTable items={data?.items || []} meta={data?.meta} page={page} onPageChange={setPage} />
        ) : null}
      </Card>
    </>
  )
}
