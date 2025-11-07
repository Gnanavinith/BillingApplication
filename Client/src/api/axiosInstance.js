// Axios base instance with token handling
import axios from 'axios'
import { API_ROUTES } from './apiRoutes'

const axiosInstance = axios.create({
  baseURL: API_ROUTES.BASE_URL,
  withCredentials: false,
})

axiosInstance.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('sb_token')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch {}
  return config
})

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('sb_token')
      localStorage.removeItem('sb_user')
    }
    return Promise.reject(error)
  }
)

export default axiosInstance

