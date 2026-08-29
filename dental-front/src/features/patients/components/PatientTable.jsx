import { useNavigate } from 'react-router-dom'
import {
  Avatar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import StatusChip from '@/components/common/StatusChip'
import EmptyState from '@/components/common/EmptyState'
import { formatDate, initials } from '@/utils/format'

export default function PatientTable({ items = [], meta, page, onPageChange }) {
  const navigate = useNavigate()

  if (!items.length) {
    return <EmptyState title="Aucun patient" description="Créez un premier dossier patient." />
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Patient</TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Téléphone</TableCell>
            <TableCell>Âge</TableCell>
            <TableCell>Dernière visite</TableCell>
            <TableCell>Prochain RDV</TableCell>
            <TableCell>Statut</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((patient) => (
            <TableRow key={patient.id} hover>
              <TableCell>
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    fontSize: 10,
                    bgcolor: 'primary.light',
                    display: 'inline-flex',
                    mr: 1,
                  }}
                >
                  {initials(patient.name)}
                </Avatar>
                {patient.name}
              </TableCell>
              <TableCell>{patient.fileNumber}</TableCell>
              <TableCell>{patient.phone || '—'}</TableCell>
              <TableCell>{patient.age ? `${patient.age} ans` : '—'}</TableCell>
              <TableCell>{formatDate(patient.lastVisitAt)}</TableCell>
              <TableCell>{formatDate(patient.nextAppointmentAt)}</TableCell>
              <TableCell>
                <StatusChip label={patient.isActive ? 'Actif' : 'Inactif'} tone={patient.isActive ? 'success' : 'muted'} />
              </TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => navigate(`/patients/${patient.id}`)}>
                  <VisibilityOutlinedIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => navigate(`/patients/${patient.id}/edit`)}>
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {meta ? (
        <TablePagination
          component="div"
          count={meta.total}
          page={(meta.currentPage || 1) - 1}
          rowsPerPage={meta.perPage}
          rowsPerPageOptions={[15]}
          onPageChange={(_, next) => onPageChange(next + 1)}
          labelDisplayedRows={({ from, to, count }) => `Affichage de ${from} à ${to} sur ${count} patients`}
        />
      ) : null}
    </>
  )
}
