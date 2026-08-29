import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Link, TextField, Typography } from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import AppLogo from '@/components/common/AppLogo'

export default function ForgotPasswordPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 448,
          bgcolor: 'background.paper',
          borderRadius: '12px',
          boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(192, 199, 210, 0.30)',
          p: 4,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 4, bgcolor: 'primary.main' }} />

        <Box sx={{ textAlign: 'center', mb: 3, mt: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <AppLogo height={72} />
          </Box>
          <Typography variant="h2" sx={{ mb: 1 }}>
            Mot de passe oublié
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cette étape sera branchée à l&apos;e-mail dans une prochaine phase.
          </Typography>
        </Box>

        <Typography variant="overline" sx={{ display: 'block', mb: 0.5 }}>
          E-mail
        </Typography>
        <TextField placeholder="docteur@clinique.fr" disabled sx={{ mb: 3 }} />

        <Button variant="contained" fullWidth size="large" disabled>
          Envoyer le lien
        </Button>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Link
            component={RouterLink}
            to="/login"
            underline="hover"
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}
          >
            <ArrowBackRoundedIcon sx={{ fontSize: 18 }} />
            Retour à la connexion
          </Link>
        </Box>
      </Box>
    </Box>
  )
}
