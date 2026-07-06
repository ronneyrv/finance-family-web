import { ApiError, type ApiErrorResponse } from './apiError'
import type { RequestOptions } from './types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

async function request<TResponse, TBody = unknown>(
  path: string,
  options: RequestOptions<TBody> = {},
): Promise<TResponse> {
  const { body, headers, ...requestInit } = options

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestInit,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined && {
        'Content-Type': 'application/json',
      }),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    let details: ApiErrorResponse | undefined

    try {
      details = (await response.json()) as ApiErrorResponse
    } catch {
      details = undefined
    }

    throw new ApiError(
      response.status,
      details?.message ?? `Request failed with status ${response.status}`,
      details,
    )
  }

  if (response.status === 204) {
    return undefined as TResponse
  }

  return (await response.json()) as TResponse
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
