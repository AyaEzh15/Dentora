import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'
import PageHeader from '@/components/common/PageHeader'
import StatusChip from '@/components/common/StatusChip'
import ErrorAlert from '@/components/common/ErrorAlert'
import LoadingScreen from '@/components/common/LoadingScreen'
import EmptyState from '@/components/common/EmptyState'
import { useCreateUser, useUpdateUser, useUsers } from '@/features/users/hooks/useUsers'
import { userSchema } from '@/features/users/schemas/userSchema'

const ROLES = [
  { value: 'ADMIN', label: 'Administrateur' },
  { value: 'DENTIST', label: 'Dentiste' },
  { value: 'ASSISTANT', label: 'Assistant' },
  { value: 'SECRETARY', label: 'Secrétaire' },
]

export default function UsersPage() {
  const { data, isLoading, error } = useUsers()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  return (
    <>
      <PageHeader
        title="Personnel"
        subtitle="Gérez les membres du cabinet et leurs rôles."
        actions={
          <Button
            variant="contained"
            startIcon={<PersonAddOutlinedIcon />}
            onClick={() => {
              setEditing(null)
              setOpen(true)
            }}
          >
            Ajouter
          </Button>
        }
      />

      <Card>
        {isLoading ? <LoadingScreen compact /> : null}
        <ErrorAlert message={error?.response?.data?.message} sx={{ m: 2 }} />
        {!isLoading && !data?.items?.length ? (
          <EmptyState title="Aucun membre" />
        ) : null}
        {data?.items?.length ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>E-mail</TableCell>
                <TableCell>Téléphone</TableCell>
                <TableCell>Rôle</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.items.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || '—'}</TableCell>
                  <TableCell>{ROLES.find((role) => role.value === user.role)?.label || user.role}</TableCell>
                  <TableCell>
                    <StatusChip label={user.isActive ? 'Actif' : 'Inactif'} tone={user.isActive ? 'success' : 'muted'} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setEditing(user)
                        setOpen(true)
                      }}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : null}
      </Card>

      <UserDialog open={open} user={editing} onClose={() => setOpen(false)} />
    </>
  )
}

function UserDialog({ open, user, onClose }) {
  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser(user?.id)
  const mutation = user ? updateMutation : createMutation

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    values: {
      first_name: user?.firstName || '',
      last_name: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      password: '',
      role: user?.role || 'SECRETARY',
      is_active: user?.isActive ?? true,
    },
  })

  const onSubmit = async (values) => {
    const payload = { ...values }
    if (user && !payload.password) {
      delete payload.password
    }
    await mutation.mutateAsync(payload)
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{user ? 'Modifier le membre' : 'Nouveau membre'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ display: 'grid', gap: 2 }}>
          <ErrorAlert message={mutation.error?.response?.data?.message} />
          <TextField label="Prénom" {...register('first_name')} error={Boolean(errors.first_name)} helperText={errors.first_name?.message} />
          <TextField label="Nom" {...register('last_name')} error={Boolean(errors.last_name)} helperText={errors.last_name?.message} />
          <TextField label="E-mail" {...register('email')} error={Boolean(errors.email)} helperText={errors.email?.message} />
          <TextField label="Téléphone" {...register('phone')} />
          <TextField
            label={user ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}
            type="password"
            {...register('password')}
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
          />
          <TextField select label="Rôle" defaultValue={user?.role || 'SECRETARY'} {...register('role')}>
            {ROLES.map((role) => (
              <MenuItem key={role.value} value={role.value}>
                {role.label}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <Switch checked={Boolean(field.value)} onChange={(_, value) => field.onChange(value)} />
              )}
            />
            <Typography variant="body2">Compte actif</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained" disabled={mutation.isPending}>
            Enregistrer
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
