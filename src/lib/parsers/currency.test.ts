import { describe, expect, it } from 'vitest'

import { parseCurrencyInput } from './currency'

describe('parseCurrencyInput', () => {
  it('parses Brazilian currency with decimal places', () => {
    expect(parseCurrencyInput('1.299,36')).toBe(1299.36)
  })

  it('parses values without thousands separator', () => {
    expect(parseCurrencyInput('129,90')).toBe(129.9)
  })

  it('parses whole monetary values', () => {
    expect(parseCurrencyInput('12.500,00')).toBe(12500)
  })

  it('parses large monetary values', () => {
    expect(parseCurrencyInput('1.234.567,89')).toBe(1234567.89)
  })

  it('returns zero for an empty value', () => {
    expect(parseCurrencyInput('')).toBe(0)
  })
})
