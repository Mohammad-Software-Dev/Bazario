import axios from 'axios'

import { getAuthToken } from '@/lib/auth/auth-storage'

const DEFAULT_API_BASE_URL = 'https://bazario-back-production.up.railway.app'

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.request.use((config) => {
  const token = getAuthToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
