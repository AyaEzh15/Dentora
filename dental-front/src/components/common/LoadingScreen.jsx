import { Box, CircularProgress } from '@mui/material'

export default function LoadingScreen({ compact = false }) {
  return (
    <Box
      sx={{
        minHeight: compact ? 180 : '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: compact ? 'transparent' : 'background.default',
      }}
    >
      <CircularProgress />
    </Box>
  )
}
