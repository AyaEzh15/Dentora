import { Autocomplete, TextField } from '@mui/material'
import { useCareTypes } from '@/features/care-types/hooks/useCareTypes'

export default function CareTypeSelect({
  value,
  onChange,
  label = 'Type de soin',
  required = false,
  size = 'medium',
  allowAll = false,
  sx,
}) {
  const { data: options = [], isLoading } = useCareTypes()

  return (
    <Autocomplete
      options={options}
      value={value}
      loading={isLoading}
      size={size}
      sx={sx}
      isOptionEqualToValue={(option, selected) => option.id === selected.id}
      getOptionLabel={(option) => option.name || ''}
      onChange={(_, next) => onChange(next)}
      noOptionsText="Aucun soin"
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          placeholder={allowAll ? 'Tous les soins' : 'Rechercher un soin'}
        />
      )}
    />
  )
}
