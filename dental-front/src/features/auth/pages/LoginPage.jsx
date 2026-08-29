import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from '@mui/material'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import AppLogo from '@/components/common/AppLogo'
import ErrorAlert from '@/components/common/ErrorAlert'
import { useAuth } from '@/context/AuthContext'
import { loginSchema } from '@/features/auth/schemas/loginSchema'

function getErrorMessage(error) {
  const data = error?.response?.data

  if (data?.errors?.email?.[0]) {
    return data.errors.email[0]
  }

  if (data?.errors?.password?.[0]) {
    return data.errors.password[0]
  }

  return data?.message || 'Impossible de se connecter. Réessayez.'
}

export default function LoginPage() {
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  })

  const onSubmit = async (values) => {
    setSubmitError('')

    try {
      await login(values)
    } catch (error) {
      setSubmitError(getErrorMessage(error))
    }
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', overflow: 'hidden' }}>
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          width: { lg: '41.666%', xl: '50%' },
          position: 'relative',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          p: 4,
          background: 'linear-gradient(165deg, #9acbff 0%, #0077be 42%, #005e97 100%)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(207, 229, 255, 0.92), rgba(0, 94, 151, 0.28) 45%, transparent)',
          }}
        />
        <Box sx={{ position: 'relative', zIndex: 1, color: '#001d34', maxWidth: 520, mb: 4 }}>
          <Typography variant="h2" sx={{ mb: 1 }}>
            L&apos;excellence au service de votre pratique.
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Gérez vos dossiers patients, vos rendez-vous et votre facturation avec une précision
            et une simplicité inégalées.
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          width: { xs: '100%', lg: '58.333%', xl: '50%' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 3, xl: 4 },
          bgcolor: 'background.default',
          overflowY: 'auto',
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
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: 4,
              bgcolor: 'primary.main',
            }}
          />

          <Box sx={{ textAlign: 'center', mb: 4, mt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <AppLogo height={88} />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Accédez à votre espace de gestion
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <ErrorAlert message={submitError} sx={{ mb: 2 }} />

            <Typography variant="overline" sx={{ display: 'block', mb: 0.5 }}>
              Identifiant ou E-mail
            </Typography>
            <TextField
              {...register('email')}
              placeholder="docteur@clinique.fr"
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              autoComplete="email"
              sx={{ mb: 3 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineRoundedIcon sx={{ color: 'outline.main', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Typography variant="overline" sx={{ display: 'block', mb: 0.5 }}>
              Mot de passe
            </Typography>
            <TextField
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              autoComplete="current-password"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: 'outline.main', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                        onClick={() => setShowPassword((value) => !value)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? (
                          <VisibilityOutlinedIcon sx={{ fontSize: 20 }} />
                        ) : (
                          <VisibilityOffOutlinedIcon sx={{ fontSize: 20 }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 1.5,
              }}
            >
              <FormControlLabel
                control={
                  <Controller
                    name="remember"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        size="small"
                        checked={Boolean(field.value)}
                        onChange={(event) => field.onChange(event.target.checked)}
                      />
                    )}
                  />
                }
                label={
                  <Typography variant="subtitle2" color="text.secondary">
                    Se souvenir de moi
                  </Typography>
                }
              />
              <Link
                component={RouterLink}
                to="/forgot-password"
                underline="hover"
                variant="subtitle2"
                sx={{ fontWeight: 600, color: 'primary.main' }}
              >
                Mot de passe oublié ?
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isSubmitting}
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{ mt: 3 }}
            >
              {isSubmitting ? 'Connexion…' : 'Se connecter'}
            </Button>
          </Box>

          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(192, 199, 210, 0.30)', textAlign: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary">
              Besoin d&apos;assistance technique ?
            </Typography>
            <Link
              href="mailto:support@dentora.ma"
              underline="hover"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                mt: 0.5,
                color: 'primary.main',
                fontWeight: 500,
                fontSize: 13,
              }}
            >
              <SupportAgentRoundedIcon sx={{ fontSize: 16 }} />
              Contacter le support
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
