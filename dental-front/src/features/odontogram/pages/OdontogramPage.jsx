import { useState } from 'react'
import { Autocomplete, Card, CardContent, TextField, Typography } from '@mui/material'
import PageHeader from '@/components/common/PageHeader'
import OdontogramChart from '@/features/odontogram/components/OdontogramChart'
import { usePatients } from '@/features/patients/hooks/usePatients'
import { useOdontogram, useSaveOdontogram } from '@/features/patients/hooks/useClinical'

export default function OdontogramPage() {
  const [patient, setPatient] = useState(null)
  const [selectedTooth, setSelectedTooth] = useState(null)
  const { data: patientsPage } = usePatients({ per_page: 50, is_active: true })
  const patients = patientsPage?.items || []
  const { data: teeth = [] } = useOdontogram(patient?.id)
  const saveOdontogram = useSaveOdontogram(patient?.id)

  const changeTooth = (number, condition, notes) => {
    const payload = [
      ...teeth
        .filter((item) => item.toothNumber !== number)
        .map((item) => ({
          tooth_number: item.toothNumber,
          condition: item.condition,
          notes: item.notes,
        })),
      { tooth_number: number, condition, notes },
    ]
    saveOdontogram.mutate({ teeth: payload })
  }

  return (
    <>
      <PageHeader title="Odontogramme" subtitle="Sélectionnez un patient pour consulter et mettre à jour son dossier dentaire." />
      <Card sx={{ mb: 2, p: 2, maxWidth: 480 }}>
        <Autocomplete
          options={patients}
          value={patient}
          getOptionLabel={(option) => option.name || ''}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(_, value) => {
            setPatient(value)
            setSelectedTooth(null)
          }}
          renderInput={(params) => <TextField {...params} label="Patient" />}
        />
      </Card>
      <Card>
        <CardContent>
          {patient ? (
            <>
              <Typography variant="h3" sx={{ mb: 2 }}>
                {patient.name}
              </Typography>
              <OdontogramChart
                teeth={teeth}
                selected={selectedTooth}
                onSelect={setSelectedTooth}
                onChangeCondition={changeTooth}
              />
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Choisissez un patient pour afficher l’odontogramme.
            </Typography>
          )}
        </CardContent>
      </Card>
    </>
  )
}
