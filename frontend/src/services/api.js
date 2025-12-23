import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('daco_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const login = (credentials) => api.post('/auth/login', credentials)
export const register = (credentials) => api.post('/auth/register', credentials)
export const changePassword = (payload) => api.put('/auth/change-password', payload)
export const fetchDashboardSummary = () => api.get('/dashboard/summary')
export const fetchMedicalRecords = () => api.get('/medical')
export const createMedicalRecord = (payload) => api.post('/medical', payload)
export const updateMedicalRecord = (id, payload) => api.put(`/medical/${id}`, payload)
export const deleteMedicalRecord = (id) => api.delete(`/medical/${id}`)

export default api
