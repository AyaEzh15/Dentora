import { Navigate, Outlet } from 'react-router-dom'
import LoadingScreen from '@/components/common/LoadingScreen'
import { useAuth } from '@/context/AuthContext'

export default function StaffOnlyRoute() {
  const { isAdmin, booting } = useAuth()

  if (booting) {
    return <LoadingScreen />
  }

  if (isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
