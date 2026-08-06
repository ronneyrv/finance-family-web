import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import PaymentMethodSelector from './PaymentMethodSelector'

type PaymentMethodSelectorProps = React.ComponentProps<typeof PaymentMethodSelector>

function renderPaymentMethodSelector(props: Partial<PaymentMethodSelectorProps> = {}) {
  const onChange = vi.fn()

  render(
    <PaymentMethodSelector
      methods={props.methods ?? ['PIX', 'CASH', 'BANK_TRANSFER']}
      value={props.value ?? 'PIX'}
      onChange={onChange}
      {...props}
    />,
  )

  return {
    onChange,
    user: userEvent.setup(),
  }
}

describe('PaymentMethodSelector', () => {
  it('renders available payment methods', () => {
    renderPaymentMethodSelector()

    expect(screen.getByText('Forma de pagamento')).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'PIX' })).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Dinheiro' })).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Transferência' })).toBeInTheDocument()
  })

  it('marks selected payment method', () => {
    renderPaymentMethodSelector({
      value: 'CASH',
    })

    expect(screen.getByRole('button', { name: 'PIX' })).toHaveAttribute('aria-pressed', 'false')

    expect(screen.getByRole('button', { name: 'Dinheiro' })).toHaveAttribute('aria-pressed', 'true')
  })

  it.each([
    ['PIX', 'PIX'],
    ['Dinheiro', 'CASH'],
    ['Transferência', 'BANK_TRANSFER'],
  ] as const)('calls onChange when %s is selected', async (label, expectedValue) => {
    const { user, onChange } = renderPaymentMethodSelector()

    await user.click(screen.getByRole('button', { name: label }))

    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith(expectedValue)
  })
})
