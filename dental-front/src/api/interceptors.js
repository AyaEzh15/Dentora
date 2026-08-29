const TOKEN_KEY = 'dentora_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
    return
  }

  localStorage.removeItem(TOKEN_KEY)
}

export function setupInterceptors(api) {
  api.interceptors.request.use((config) => {
    const token = getToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        setToken(null)

        if (window.location.pathname !== '/login') {
          window.location.assign('/login')
        }
      }

      return Promise.reject(error)
    }
  )
}
