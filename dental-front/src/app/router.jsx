import { Navigate, createBrowserRouter } from 'react-router-dom'
import GuestRoute from '@/features/auth/components/GuestRoute'
import ProtectedRoute from '@/features/auth/components/ProtectedRoute'
import AdminOnlyRoute from '@/features/auth/components/AdminOnlyRoute'
import StaffOnlyRoute from '@/features/auth/components/StaffOnlyRoute'
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage'
import LoginPage from '@/features/auth/pages/LoginPage'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import PatientsPage from '@/features/patients/pages/PatientsPage'
import CreatePatientPage from '@/features/patients/pages/CreatePatientPage'
import EditPatientPage from '@/features/patients/pages/EditPatientPage'
import PatientDetailsPage from '@/features/patients/pages/PatientDetailsPage'
import AppointmentsPage from '@/features/appointments/pages/AppointmentsPage'
import UsersPage from '@/features/users/pages/UsersPage'
import CareTypesPage from '@/features/care-types/pages/CareTypesPage'
import ConsultationsPage from '@/features/consultations/pages/ConsultationsPage'
import OdontogramPage from '@/features/odontogram/pages/OdontogramPage'
import TreatmentPlansPage from '@/features/treatment-plans/pages/TreatmentPlansPage'
import ProceduresPage from '@/features/procedures/pages/ProceduresPage'
import PrescriptionsPage from '@/features/prescriptions/pages/PrescriptionsPage'
import BillingPage from '@/features/billing/pages/BillingPage'
import PaymentsPage from '@/features/payments/pages/PaymentsPage'
import DentistsPage from '@/features/admin/pages/DentistsPage'
import DentistWorkspacePage from '@/features/admin/pages/DentistWorkspacePage'
import AuthLayout from '@/layouts/AuthLayout'
import DashboardLayout from '@/layouts/DashboardLayout'
import PlaceholderPage from '@/components/common/PlaceholderPage'
import { PLACEHOLDER_ROUTES } from '@/constants/nav'

const staffPlaceholders = PLACEHOLDER_ROUTES.filter((route) => !['clinics', 'settings'].includes(route.path))
const adminPlaceholders = PLACEHOLDER_ROUTES.filter((route) => ['clinics', 'settings'].includes(route.path))

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/forgot-password', element: <ForgotPasswordPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/', element: <Navigate to="/dashboard" replace /> },
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/patients/:id', element: <PatientDetailsPage /> },
          { path: '/users', element: <UsersPage /> },
          { path: '/care-types', element: <CareTypesPage /> },
          ...adminPlaceholders.map((route) => ({
            path: `/${route.path}`,
            element: <PlaceholderPage title={route.title} />,
          })),
          {
            element: <AdminOnlyRoute />,
            children: [
              { path: '/dentists', element: <DentistsPage /> },
              { path: '/dentists/:id', element: <DentistWorkspacePage /> },
            ],
          },
          {
            element: <StaffOnlyRoute />,
            children: [
              { path: '/patients', element: <PatientsPage /> },
              { path: '/patients/new', element: <CreatePatientPage /> },
              { path: '/patients/:id/edit', element: <EditPatientPage /> },
              { path: '/appointments', element: <AppointmentsPage /> },
              { path: '/consultations', element: <ConsultationsPage /> },
              { path: '/odontogram', element: <OdontogramPage /> },
              { path: '/treatment-plans', element: <TreatmentPlansPage /> },
              { path: '/procedures', element: <ProceduresPage /> },
              { path: '/prescriptions', element: <PrescriptionsPage /> },
              { path: '/billing', element: <BillingPage /> },
              { path: '/payments', element: <PaymentsPage /> },
              ...staffPlaceholders.map((route) => ({
                path: `/${route.path}`,
                element: <PlaceholderPage title={route.title} />,
              })),
            ],
          },
        ],
      },
    ],
  },
])
