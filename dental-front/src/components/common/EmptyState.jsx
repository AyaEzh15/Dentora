import { Box, Typography } from '@mui/material'

export default function EmptyState({ title, description }) {
  return (
    <Box sx={{ py: 6, textAlign: 'center' }}>
      <Typography variant="h3" sx={{ mb: 1 }}>
        {title}
      </Typography>
      {description ? (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      ) : null}
    </Box>
  )
}
