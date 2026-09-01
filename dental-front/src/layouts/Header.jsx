import { useState } from 'react'
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { useAuth } from '@/context/AuthContext'

export default function Header({ onMenuClick }) {
  const { user, logout, isAdmin } = useAuth()
  const [anchorEl, setAnchorEl] = useState(null)

  const initials = (user?.name || 'U')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: 'calc(100% - 256px)' },
        ml: { md: '256px' },
      }}
    >
      <Toolbar sx={{ minHeight: 64, px: 3, gap: 2 }}>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ display: { md: 'none' } }}
          aria-label="Ouvrir le menu"
        >
          <MenuRoundedIcon />
        </IconButton>

        <Box sx={{ flex: 1, maxWidth: 384 }}>
          <TextField
            placeholder={isAdmin ? 'Rechercher un dentiste, un patient…' : 'Rechercher un patient, un rdv...'}
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
          <IconButton aria-label="Notifications" sx={{ color: 'text.secondary' }}>
            <NotificationsNoneRoundedIcon />
          </IconButton>
          <IconButton aria-label="Aide" sx={{ color: 'text.secondary' }}>
            <HelpOutlineRoundedIcon />
          </IconButton>
          <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1.5 }} />
          <Box
            onClick={(event) => setAnchorEl(event.currentTarget)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              borderRadius: 8,
              px: 1,
              py: 0.5,
              '&:hover': { bgcolor: 'surface.containerHighest' },
            }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 13 }}>
              {initials}
            </Avatar>
            <Typography variant="overline" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {user?.name}
            </Typography>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem
              onClick={() => {
                setAnchorEl(null)
                logout()
              }}
            >
              <LogoutRoundedIcon fontSize="small" sx={{ mr: 1 }} />
              Se déconnecter
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
