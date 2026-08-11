export function parseCurrencyInput(value: string): number {
  const normalizedValue = value
    .replace(/\./g, '')
    .replace(',', '.')
    .replace(/[^\d.-]/g, '')

  return Number(normalizedValue)
}
