import { Autocomplete, TextField } from '@mui/material'
import { useMemo, useState } from 'react'
import { patientApi } from '@/features/patients/api/patientApi'
import { usePatients } from '@/features/patients/hooks/usePatients'

export default function PatientSelect({ value, onChange, label = 'Patient', required = false, size = 'medium' }) {
  const { data: patientsPage } = usePatients({ per_page: 50, is_active: true })
  const listed = patientsPage?.items ?? []
  const [searchResults, setSearchResults] = useState(null)

  const options = useMemo(() => {
    const base = searchResults ?? listed
    if (value && !base.some((item) => item.id === value.id)) {
      return [value, ...base]
    }
    return base
  }, [searchResults, listed, value])

  const searchPatients = async (term) => {
    if (!term.trim()) {
      setSearchResults(null)
      return
    }

    const { data } = await patientApi.search(term)
    setSearchResults(data.data || [])
  }

  return (
    <Autocomplete
      options={options}
      value={value}
      size={size}
      isOptionEqualToValue={(option, selected) => option.id === selected.id}
      getOptionLabel={(option) => option.name || ''}
      onChange={(_, next) => onChange(next)}
      onInputChange={(_, term) => searchPatients(term)}
      noOptionsText="Aucun patient"
      renderInput={(params) => <TextField {...params} label={label} required={required} />}
    />
  )
}
