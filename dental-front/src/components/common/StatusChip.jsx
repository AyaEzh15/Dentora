import { Chip } from '@mui/material'

const TONES = {
  success: { bgcolor: 'rgba(0, 107, 95, 0.10)', color: '#006b5f', borderColor: 'rgba(0, 107, 95, 0.20)' },
  info: { bgcolor: 'rgba(0, 94, 151, 0.10)', color: '#005e97', borderColor: 'rgba(0, 119, 190, 0.20)' },
  warning: { bgcolor: '#ffdad6', color: '#93000a', borderColor: '#ffdad6' },
  muted: { bgcolor: '#d5e3fc', color: '#404751', borderColor: '#c0c7d2' },
  error: { bgcolor: '#ffdad6', color: '#ba1a1a', borderColor: '#ffdad6' },
}

export default function StatusChip({ label, tone = 'muted' }) {
  return (
    <Chip
      label={label}
      size="small"
      variant="outlined"
      sx={{
        height: 22,
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'uppercase',
        ...TONES[tone],
      }}
    />
  )
}
