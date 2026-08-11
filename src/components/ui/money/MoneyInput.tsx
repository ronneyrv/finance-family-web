import type { InputHTMLAttributes } from 'react'

import { fieldClassName } from '../forms/fieldClass'

type MoneyInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'onChange'
> & {
  value: string
  onChange: (value: string) => void
}

function formatMoneyInput(value: string) {
  const digits = value.replace(/\D/g, '')

  if (!digits) {
    return ''
  }

  const integerValue = Number(digits) / 100

  return integerValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function MoneyInput({ value, onChange, className, ...props }: MoneyInputProps) {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    onChange(formatMoneyInput(event.target.value))
  }

  return (
    <input
      {...props}
      type="text"
      inputMode="numeric"
      value={value}
      onChange={handleChange}
      className={`${fieldClassName} ${className ?? ''}`}
    />
  )
}

export default MoneyInput
