import { useMemo, useState } from 'react'
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
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import PageHeader from '@/components/common/PageHeader'
import StatusChip from '@/components/common/StatusChip'
import ErrorAlert from '@/components/common/ErrorAlert'
import LoadingScreen from '@/components/common/LoadingScreen'
import EmptyState from '@/components/common/EmptyState'
import { useAuth } from '@/context/AuthContext'
import {
  useCreateCareType,
  useManageCareTypes,
  useUpdateCareType,
} from '@/features/care-types/hooks/useCareTypes'
import { careTypeSchema } from '@/features/care-types/schemas/careTypeSchema'

export default function CareTypesPage() {
  const { hasPermission } = useAuth()
  const canManage = hasPermission('care-types.manage')
  const { data = [], isLoading, error } = useManageCareTypes(canManage)
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const items = useMemo(() => {
    const term = search.trim().toLowerCase()

    if (!term) {
      return data
    }

    return data.filter((item) => item.name.toLowerCase().includes(term))
  }, [data, search])

  if (!canManage) {
    return <EmptyState title="Accès réservé à l’administrateur" description="Seuls les administrateurs peuvent gérer le catalogue des soins." />
  }

  return (
    <>
      <PageHeader
        title="Types de soins"
        subtitle="Ajoutez et mettez à jour le catalogue des soins du cabinet."
        actions={
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => {
              setEditing(null)
              setOpen(true)
            }}
          >
            Nouveau soin
          </Button>
        }
      />

      <Card sx={{ p: 2, mb: 2 }}>
        <TextField
          size="small"
          label="Rechercher"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{ minWidth: 280 }}
        />
      </Card>

      <Card>
        {isLoading ? <LoadingScreen compact /> : null}
        <ErrorAlert message={error?.response?.data?.message} sx={{ m: 2 }} />
        {!isLoading && !items.length ? <EmptyState title="Aucun type de soin" /> : null}
        {items.length ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Soin</TableCell>
                <TableCell>Ordre</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((careType) => (
                <TableRow key={careType.id} hover>
                  <TableCell>{careType.name}</TableCell>
                  <TableCell>{careType.sortOrder}</TableCell>
                  <TableCell>
                    <StatusChip
                      label={careType.isActive ? 'Actif' : 'Inactif'}
                      tone={careType.isActive ? 'success' : 'muted'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setEditing(careType)
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

      <CareTypeDialog
        open={open}
        careType={editing}
        onClose={() => setOpen(false)}
      />
    </>
  )
}

function CareTypeDialog({ open, careType, onClose }) {
  const createMutation = useCreateCareType()
  const updateMutation = useUpdateCareType(careType?.id)
  const mutation = careType ? updateMutation : createMutation

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(careTypeSchema),
    values: {
      name: careType?.name || '',
      sort_order: careType?.sortOrder || undefined,
      is_active: careType?.isActive ?? true,
    },
  })

  const onSubmit = async (values) => {
    const payload = {
      name: values.name.trim(),
      is_active: values.is_active,
    }

    if (values.sort_order) {
      payload.sort_order = Number(values.sort_order)
    }

    await mutation.mutateAsync(payload)
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{careType ? 'Modifier le soin' : 'Nouveau soin'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ display: 'grid', gap: 2 }}>
          <ErrorAlert
            message={mutation.error?.response?.data?.errors?.name?.[0] || mutation.error?.response?.data?.message}
          />
          <TextField
            label="Nom du soin"
            {...register('name')}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
          />
          <TextField
            type="number"
            label="Ordre d’affichage"
            {...register('sort_order')}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <Switch checked={Boolean(field.value)} onChange={(_, value) => field.onChange(value)} />
              )}
            />
            <Typography variant="body2">Soin actif (visible dans l’agenda)</Typography>
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
