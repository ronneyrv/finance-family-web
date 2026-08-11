import { describe, expect, it } from 'vitest'

import { formatCurrencyInputValue } from './currencyInput'

describe('formatCurrencyInputValue', () => {
  it('formats a decimal value using Brazilian notation', () => {
    expect(formatCurrencyInputValue(1299.36)).toBe('1.299,36')
  })

  it('formats whole monetary values with two decimal places', () => {
    expect(formatCurrencyInputValue(12500)).toBe('12.500,00')
  })

  it('formats large monetary values with thousands separator', () => {
    expect(formatCurrencyInputValue(1234567.89)).toBe('1.234.567,89')
  })

  it('formats zero with two decimal places', () => {
    expect(formatCurrencyInputValue(0)).toBe('0,00')
  })
})
