import { ApiError } from './apiError'

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError && error.message) {
    return error.message
  }

  return fallback
}
