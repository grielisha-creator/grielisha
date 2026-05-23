import axios from 'axios'

const rawUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/'
// Ensure exactly one trailing slash
const API_BASE_URL = rawUrl.replace(/\/+$/,'') + '/'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If token is stale/malformed, the backend might return 400 instead of 401.
    if (error.response?.status === 400 && originalRequest.headers?.Authorization) {
      // Force it to be handled by the 401 logic below to attempt a refresh
      error.response.status = 401;
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (!refreshToken) throw new Error('No refresh token')
        // Use clean construction without double slashes
        const response = await axios.post(`${API_BASE_URL}auth/refresh/`, {
          refresh: refreshToken
        })
        
        const newAccessToken = response.data.access
        localStorage.setItem('access_token', newAccessToken)
        
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        
        const currentPath = window.location.pathname
        if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
          window.location.href = '/login'
        }
        
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
