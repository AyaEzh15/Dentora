import { NavLink } from 'react-router-dom'
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import AppLogo from '@/components/common/AppLogo'
import { NAV_SECTIONS } from '@/constants/nav'
import { useAuth } from '@/context/AuthContext'

const DRAWER_WIDTH = 256

export default function Sidebar({ mobileOpen, onClose }) {
  const { clinic, hasPermission } = useAuth()

  const content = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', py: 3 }}>
      <Box sx={{ px: 2, mb: 3 }}>
        <AppLogo
          height="auto"
          sx={{
            width: '100%',
            maxHeight: 112,
            mb: 1.5,
          }}
        />
        <Typography variant="subtitle2" color="text.secondary" sx={{ px: 0.5 }}>
          {clinic?.name || 'Management Suite'}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', px: 1 }}>
        {NAV_SECTIONS.map((section) => {
          const items = section.items.filter(
            (item) => !item.permission || hasPermission(item.permission)
          )

          if (!items.length) {
            return null
          }

          return (
            <Box key={section.title} sx={{ mb: 2 }}>
              <Typography
                variant="overline"
                sx={{
                  display: 'block',
                  px: 2,
                  mb: 0.5,
                  color: 'text.secondary',
                  letterSpacing: '0.08em',
                }}
              >
                {section.title}
              </Typography>
              <List disablePadding>
                {items.map((item) => {
                  const Icon = item.icon

                  return (
                    <ListItemButton
                      key={item.path}
                      component={NavLink}
                      to={item.path}
                      onClick={onClose}
                      sx={{
                        px: 2,
                        py: 1,
                        color: 'text.secondary',
                        '&.active': {
                          color: 'primary.main',
                          fontWeight: 700,
                          borderRight: '4px solid',
                          borderColor: 'primary.main',
                          bgcolor: 'surface.containerLow',
                          borderRadius: 0,
                        },
                        '&:hover': {
                          bgcolor: 'surface.containerLow',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                        <Icon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        slotProps={{ primary: { variant: 'body2', fontWeight: 'inherit' } }}
                      />
                    </ListItemButton>
                  )
                })}
              </List>
            </Box>
          )
        })}
      </Box>
    </Box>
  )

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        {content}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
        open
      >
        {content}
      </Drawer>
    </>
  )
}
