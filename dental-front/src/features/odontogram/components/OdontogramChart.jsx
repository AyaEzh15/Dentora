import { Box, MenuItem, TextField, Typography } from '@mui/material'
import { ALL_TEETH, LOWER_TEETH, TOOTH_CONDITIONS, UPPER_TEETH, toothMeta } from '@/features/odontogram/constants/teeth'

function ToothButton({ number, condition, onSelect }) {
  const meta = toothMeta(condition)

  return (
    <Box
      onClick={() => onSelect(number)}
      sx={{
        width: 40,
        height: 48,
        borderRadius: 1.5,
        border: '2px solid',
        borderColor: meta.border,
        bgcolor: meta.color,
        display: 'grid',
        placeItems: 'center',
        cursor: 'pointer',
        fontSize: 12,
        fontWeight: 700,
        color: 'text.primary',
        '&:hover': { transform: 'translateY(-2px)' },
      }}
    >
      {number}
    </Box>
  )
}

export default function OdontogramChart({ teeth = [], selected, onSelect, onChangeCondition, readOnly = false }) {
  const map = Object.fromEntries(teeth.map((item) => [item.toothNumber, item]))
  const current = selected ? map[selected] : null

  return (
    <Box>
      <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        Arcade supérieure
      </Typography>
      <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 2 }}>
        {UPPER_TEETH.map((number) => (
          <ToothButton
            key={number}
            number={number}
            condition={map[number]?.condition || 'HEALTHY'}
            onSelect={onSelect}
          />
        ))}
      </Box>
      <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        Arcade inférieure
      </Typography>
      <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 3 }}>
        {LOWER_TEETH.map((number) => (
          <ToothButton
            key={number}
            number={number}
            condition={map[number]?.condition || 'HEALTHY'}
            onSelect={onSelect}
          />
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {TOOTH_CONDITIONS.map((item) => (
          <Box key={item.value} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mr: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: 0.5, bgcolor: item.color, border: '1px solid', borderColor: item.border }} />
            <Typography variant="subtitle2">{item.label}</Typography>
          </Box>
        ))}
      </Box>

      {selected ? (
        <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, maxWidth: 360 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>
            Dent {selected}
          </Typography>
          <TextField
            select
            label="État"
            value={current?.condition || 'HEALTHY'}
            disabled={readOnly || !onChangeCondition}
            onChange={(event) => onChangeCondition?.(selected, event.target.value, current?.notes || '')}
          >
            {TOOTH_CONDITIONS.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Cliquez sur une dent pour {readOnly ? 'consulter' : 'modifier'} son état. {ALL_TEETH.length} dents permanentes.
        </Typography>
      )}
    </Box>
  )
}
