import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import EventOutlinedIcon from '@mui/icons-material/EventOutlined'
import FolderSharedOutlinedIcon from '@mui/icons-material/FolderSharedOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import LocalPharmacyOutlinedIcon from '@mui/icons-material/LocalPharmacyOutlined'
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined'
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined'
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import MedicalInformationOutlinedIcon from '@mui/icons-material/MedicalInformationOutlined'

export const NAV_SECTIONS = [
  {
    title: 'Principal',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: DashboardOutlinedIcon, permission: 'dashboard.view' },
      { label: 'Agenda', path: '/appointments', icon: EventOutlinedIcon, permission: 'appointments.view' },
    ],
  },
  {
    title: 'Patients',
    items: [
      { label: 'Patients', path: '/patients', icon: PeopleOutlinedIcon, permission: 'patients.view' },
      { label: 'Nouveau patient', path: '/patients/new', icon: PersonAddOutlinedIcon, permission: 'patients.create' },
    ],
  },
  {
    title: 'Soins',
    items: [
      { label: 'Consultations', path: '/consultations', icon: MedicalServicesOutlinedIcon, permission: 'consultations.view' },
      { label: 'Odontogramme', path: '/odontogram', icon: FolderSharedOutlinedIcon, permission: 'odontogram.view' },
      { label: 'Plans de traitement', path: '/treatment-plans', icon: AssignmentOutlinedIcon, permission: 'treatments.view' },
      { label: 'Actes', path: '/procedures', icon: LocalPharmacyOutlinedIcon, permission: 'treatments.view' },
      { label: 'Ordonnances', path: '/prescriptions', icon: DescriptionOutlinedIcon, permission: 'prescriptions.view' },
    ],
  },
  {
    title: 'Finances',
    items: [
      { label: 'Factures', path: '/billing', icon: PaymentsOutlinedIcon, permission: 'billing.view' },
      { label: 'Paiements', path: '/payments', icon: PaymentsOutlinedIcon, permission: 'payments.view' },
      { label: 'Dépenses', path: '/expenses', icon: ReceiptLongOutlinedIcon, permission: 'expenses.view' },
    ],
  },
  {
    title: 'Gestion',
    items: [
      { label: 'Stock', path: '/stock', icon: Inventory2OutlinedIcon, permission: 'stock.view' },
      { label: 'Fournisseurs', path: '/suppliers', icon: StorefrontOutlinedIcon, permission: 'stock.view' },
      { label: 'Documents', path: '/documents', icon: DescriptionOutlinedIcon, permission: 'documents.view' },
    ],
  },
  {
    title: 'Analyse',
    items: [
      { label: 'Statistiques', path: '/reports', icon: InsightsOutlinedIcon, permission: 'reports.view' },
      { label: 'Rapports', path: '/reports/list', icon: BarChartOutlinedIcon, permission: 'reports.view' },
    ],
  },
  {
    title: 'Administration',
    items: [
      { label: 'Personnel', path: '/users', icon: GroupOutlinedIcon, permission: 'users.view' },
      { label: 'Types de soins', path: '/care-types', icon: HealthAndSafetyOutlinedIcon, permission: 'care-types.manage' },
      { label: 'Cabinet', path: '/clinics', icon: BusinessOutlinedIcon, permission: 'settings.manage' },
      { label: 'Paramètres', path: '/settings', icon: SettingsOutlinedIcon, permission: 'settings.manage' },
    ],
  },
]

export const ADMIN_NAV_SECTIONS = [
  {
    title: 'Pilotage',
    items: [
      { label: 'Vue d’ensemble', path: '/dashboard', icon: DashboardOutlinedIcon, permission: 'dashboard.view' },
    ],
  },
  {
    title: 'Cabinet',
    items: [
      { label: 'Dentistes', path: '/dentists', icon: MedicalInformationOutlinedIcon, permission: 'users.view' },
      { label: 'Personnel', path: '/users', icon: GroupOutlinedIcon, permission: 'users.view' },
      { label: 'Types de soins', path: '/care-types', icon: HealthAndSafetyOutlinedIcon, permission: 'care-types.manage' },
    ],
  },
  {
    title: 'Configuration',
    items: [
      { label: 'Cabinet', path: '/clinics', icon: BusinessOutlinedIcon, permission: 'settings.manage' },
      { label: 'Paramètres', path: '/settings', icon: SettingsOutlinedIcon, permission: 'settings.manage' },
    ],
  },
]

export const PLACEHOLDER_ROUTES = [
  { path: 'expenses', title: 'Dépenses' },
  { path: 'stock', title: 'Stock' },
  { path: 'suppliers', title: 'Fournisseurs' },
  { path: 'documents', title: 'Documents' },
  { path: 'reports', title: 'Statistiques' },
  { path: 'reports/list', title: 'Rapports' },
  { path: 'clinics', title: 'Cabinet' },
  { path: 'settings', title: 'Paramètres' },
]
