import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@mui/material'
import PageHeader from '@/components/common/PageHeader'
import ErrorAlert from '@/components/common/ErrorAlert'
import PatientForm from '@/features/patients/components/PatientForm'
import { useCreatePatient } from '@/features/patients/hooks/usePatients'

export default function CreatePatientPage() {
  const navigate = useNavigate()
  const mutation = useCreatePatient()

  const onSubmit = async (values) => {
    const { data } = await mutation.mutateAsync(values)
    navigate(`/patients/${data.data.id}`)
  }

  return (
    <>
      <PageHeader title="Nouveau patient" subtitle="Créer un dossier dans le cabinet." />
      <Card>
        <CardContent>
          <ErrorAlert message={mutation.error?.response?.data?.message} sx={{ mb: 2 }} />
          <PatientForm onSubmit={onSubmit} submitLabel="Créer le patient" loading={mutation.isPending} />
        </CardContent>
      </Card>
    </>
  )
}
