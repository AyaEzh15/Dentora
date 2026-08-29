import { useAuth } from '@/context/AuthContext'

export default function PermissionGuard({ permission, children, fallback = null }) {
  const { hasPermission } = useAuth()

  if (permission && !hasPermission(permission)) {
    return fallback
  }

  return children
}
