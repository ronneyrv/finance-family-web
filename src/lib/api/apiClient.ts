import axios, { AxiosError, type AxiosRequestConfig } from 'axios'

import { authStorage } from '../../features/auth/storage/authStorage'
import { ApiError, type ApiErrorResponse } from './apiError'
import type { RequestOptions } from './types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const accessToken = authStorage.getAccessToken()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

async function request<TResponse, TBody = unknown>(
  path: string,
  options: RequestOptions<TBody> = {},
): Promise<TResponse> {
  const { body, ...requestOptions } = options

  try {
    const response = await api.request<TResponse>({
      url: path,
      data: body,
      ...(requestOptions as AxiosRequestConfig),
    })

    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      const details = error.response?.data as ApiErrorResponse | undefined

      throw new ApiError(error.response?.status ?? 500, details?.message ?? error.message, details)
    }

    throw error
  }
}

export const apiClient = {
  get<TResponse>(path: string, options?: RequestOptions) {
    return request<TResponse>(path, {
      ...options,
      method: 'GET',
    })
  },

  post<TResponse, TBody = unknown>(path: string, body?: TBody, options?: RequestOptions) {
    return request<TResponse, TBody>(path, {
      ...options,
      method: 'POST',
      body,
    })
  },

  put<TResponse, TBody = unknown>(path: string, body?: TBody, options?: RequestOptions) {
    return request<TResponse, TBody>(path, {
      ...options,
      method: 'PUT',
      body,
    })
  },

  delete<TResponse = void>(path: string, options?: RequestOptions) {
    return request<TResponse>(path, {
      ...options,
      method: 'DELETE',
    })
  },
}
