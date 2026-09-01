import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { setToken as persistToken, getToken } from '@/api/interceptors'
import { queryClient } from '@/app/queryClient'
import { authApi } from '@/features/auth/api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken())
  const [user, setUser] = useState(null)
  const [clinic, setClinic] = useState(null)
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [booting, setBooting] = useState(Boolean(getToken()))

  const applySession = useCallback((payload, nextToken) => {
    if (nextToken) {
      persistToken(nextToken)
      setTokenState(nextToken)
    }

    setUser(payload.user ?? null)
    setClinic(payload.clinic ?? null)
    setRoles(payload.roles ?? [])
    setPermissions(payload.permissions ?? [])
  }, [])

  const clearSession = useCallback(() => {
    persistToken(null)
    setTokenState(null)
    setUser(null)
    setClinic(null)
    setRoles([])
    setPermissions([])
    queryClient.clear()
  }, [])

  const login = useCallback(
    async (credentials) => {
      const { data } = await authApi.login(credentials)
      applySession(data.data, data.data.token)
      return data
    },
    [applySession]
  )

  const logout = useCallback(async () => {
    try {
      if (getToken()) {
        await authApi.logout()
      }
    } catch {
      // session locale nettoyée même si l'API échoue
    } finally {
      clearSession()
    }
  }, [clearSession])

  useEffect(() => {
    const existingToken = getToken()

    if (!existingToken) {
      setBooting(false)
      return undefined
    }

    let cancelled = false

    authApi
      .me()
      .then(({ data }) => {
        if (!cancelled) {
          applySession(data.data)
        }
      })
      .catch(() => {
        if (!cancelled) {
          clearSession()
        }
      })
      .finally(() => {
        if (!cancelled) {
          setBooting(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [applySession, clearSession])

  const value = useMemo(
    () => ({
      token,
      user,
      clinic,
      roles,
      permissions,
      booting,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
      hasPermission: (permission) => permissions.includes(permission),
      hasRole: (role) => roles.includes(role),
      isAdmin: roles.includes('ADMIN'),
    }),
    [token, user, clinic, roles, permissions, booting, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth doit être utilisé dans AuthProvider')
  }

  return context
}
