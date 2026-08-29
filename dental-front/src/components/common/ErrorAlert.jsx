import { Alert } from '@mui/material'

export default function ErrorAlert({ message, sx }) {
  if (!message) {
    return null
  }

  return (
    <Alert severity="error" sx={{ borderRadius: 2, ...sx }}>
      {message}
    </Alert>
  )
}
