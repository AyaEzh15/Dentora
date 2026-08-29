import { Navigate, Outlet } from 'react-router-dom'
import LoadingScreen from '@/components/common/LoadingScreen'
import { useAuth } from '@/context/AuthContext'

export default function ProtectedRoute() {
  const { isAuthenticated, booting } = useAuth()

  if (booting) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
