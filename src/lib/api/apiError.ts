export type ApiErrorResponse = {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
}

export class ApiError extends Error {
  readonly status: number
  readonly details?: ApiErrorResponse

  constructor(status: number, message: string, details?: ApiErrorResponse) {
    super(message)

    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}
