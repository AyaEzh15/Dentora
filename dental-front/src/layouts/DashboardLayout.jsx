import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Box, Toolbar } from '@mui/material'
import Header from './Header'
import Sidebar from './Sidebar'

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header onMenuClick={() => setMobileOpen((open) => !open)} />
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: 'calc(100% - 256px)' },
          p: 3,
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}
