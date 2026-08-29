import { Box } from '@mui/material'
import logo from '@/assets/logo.png'

export default function AppLogo({ height = 56, alt = 'Dentora', sx }) {
  return (
    <Box
      component="img"
      src={logo}
      alt={alt}
      sx={{
        height,
        width: 'auto',
        display: 'block',
        objectFit: 'contain',
        borderRadius: 1.5,
        ...sx,
      }}
    />
  )
}
