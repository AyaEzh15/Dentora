import { createTheme } from '@mui/material/styles'
import { components } from './components'
import { palette } from './palette'
import shadows from './shadows'
import { typography } from './typography'

const theme = createTheme({
  palette,
  typography,
  shadows,
  components,
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
})

export default theme
