import { Navigate, createBrowserRouter } from 'react-router-dom'
import GuestRoute from '@/features/auth/components/GuestRoute'
import ProtectedRoute from '@/features/auth/components/ProtectedRoute'
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage'
import LoginPage from '@/features/auth/pages/LoginPage'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import PatientsPage from '@/features/patients/pages/PatientsPage'
import CreatePatientPage from '@/features/patients/pages/CreatePatientPage'
import EditPatientPage from '@/features/patients/pages/EditPatientPage'
import PatientDetailsPage from '@/features/patients/pages/PatientDetailsPage'
import AppointmentsPage from '@/features/appointments/pages/AppointmentsPage'
import UsersPage from '@/features/users/pages/UsersPage'
import AuthLayout from '@/layouts/AuthLayout'
import DashboardLayout from '@/layouts/DashboardLayout'
import PlaceholderPage from '@/components/common/PlaceholderPage'
import { PLACEHOLDER_ROUTES } from '@/constants/nav'

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
          { path: '/patients', element: <PatientsPage /> },
          { path: '/patients/new', element: <CreatePatientPage /> },
          { path: '/patients/:id', element: <PatientDetailsPage /> },
          { path: '/patients/:id/edit', element: <EditPatientPage /> },
          { path: '/appointments', element: <AppointmentsPage /> },
          { path: '/users', element: <UsersPage /> },
          ...PLACEHOLDER_ROUTES.map((route) => ({
            path: `/${route.path}`,
            element: <PlaceholderPage title={route.title} />,
          })),
        ],
      },
    ],
  },
])
