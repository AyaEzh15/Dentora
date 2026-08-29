import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent } from '@mui/material'
import PageHeader from '@/components/common/PageHeader'
import ErrorAlert from '@/components/common/ErrorAlert'
import LoadingScreen from '@/components/common/LoadingScreen'
import PatientForm from '@/features/patients/components/PatientForm'
import { usePatient, useUpdatePatient } from '@/features/patients/hooks/usePatients'

export default function EditPatientPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: patient, isLoading } = usePatient(id)
  const mutation = useUpdatePatient(id)

  if (isLoading || !patient) {
    return <LoadingScreen />
  }

  const onSubmit = async (values) => {
    await mutation.mutateAsync(values)
    navigate(`/patients/${id}`)
  }

  return (
    <>
      <PageHeader title={`Modifier ${patient.name}`} subtitle={patient.fileNumber} />
      <Card>
        <CardContent>
          <ErrorAlert message={mutation.error?.response?.data?.message} sx={{ mb: 2 }} />
          <PatientForm
            defaultValues={{
              first_name: patient.firstName,
              last_name: patient.lastName,
              email: patient.email || '',
              phone: patient.phone || '',
              date_of_birth: patient.dateOfBirth || '',
              gender: patient.gender || '',
              cin: patient.cin || '',
              address: patient.address || '',
              city: patient.city || '',
              medical_alert: patient.medicalAlert || '',
              notes: patient.notes || '',
              is_active: patient.isActive,
            }}
            onSubmit={onSubmit}
            submitLabel="Enregistrer"
            loading={mutation.isPending}
          />
        </CardContent>
      </Card>
    </>
  )
}
