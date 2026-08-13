import { describe, expect, it } from 'vitest'

import { ApiError } from './apiError'
import { getApiErrorMessage } from './getApiErrorMessage'

describe('getApiErrorMessage', () => {
  it('returns the API error message for ApiError', () => {
    const error = new ApiError(409, 'Resource cannot be deleted.')

    expect(getApiErrorMessage(error, 'Fallback message')).toBe('Resource cannot be deleted.')
  })

  it('returns fallback for unknown errors', () => {
    const error = new Error('Unexpected error')

    expect(getApiErrorMessage(error, 'Fallback message')).toBe('Fallback message')
  })

  it('returns fallback for null', () => {
    expect(getApiErrorMessage(null, 'Fallback message')).toBe('Fallback message')
  })

  it('returns fallback for undefined', () => {
    expect(getApiErrorMessage(undefined, 'Fallback message')).toBe('Fallback message')
  })

  it('returns fallback when ApiError has an empty message', () => {
    const error = new ApiError(500, '')

    expect(getApiErrorMessage(error, 'Fallback message')).toBe('Fallback message')
  })
})
