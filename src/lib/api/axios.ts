import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { authStorage } from '../../features/auth/storage/authStorage'
import { notifyUnauthorized } from '../../features/auth/services/sessionEvents'
import type { RefreshTokenResponse } from './axiosTypes'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
  },
})

export const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
  },
})

let refreshPromise: Promise<string> | null = null

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = authStorage.getAccessToken()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & {
          _retry?: boolean
        })
      | undefined

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    const refreshToken = authStorage.getRefreshToken()

    if (!refreshToken) {
      authStorage.clear()
      notifyUnauthorized()
      return Promise.reject(error)
    }

    try {
      if (!refreshPromise) {
        refreshPromise = refreshApi
          .post<RefreshTokenResponse>('/api/v1/auth/refresh', {
            refreshToken,
          })
          .then((response) => {
            const accessToken = response.data.accessToken as string

            authStorage.setAccessToken(accessToken)

            return accessToken
          })
          .finally(() => {
            refreshPromise = null
          })
      }

      const accessToken = await refreshPromise

      originalRequest.headers.Authorization = `Bearer ${accessToken}`

      return api(originalRequest)
    } catch (refreshError) {
      authStorage.clear()
      notifyUnauthorized()

      return Promise.reject(refreshError)
    }
  },
)
