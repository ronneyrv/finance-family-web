import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import CreditCardSelector from './CreditCardSelector'

type CreditCardSelectorProps = React.ComponentProps<typeof CreditCardSelector>

function renderCreditCardSelector(props: Partial<CreditCardSelectorProps> = {}) {
  const onChange = vi.fn()

  render(
    <CreditCardSelector
      creditCards={
        props.creditCards ?? [
          {
            id: '1',
            name: 'Nubank',
            creditLimit: 5000,
            closingDay: 10,
            dueDay: 20,
          },
          {
            id: '2',
            name: 'Inter Platinum',
            creditLimit: 10000,
            closingDay: 15,
            dueDay: 25,
          },
        ]
      }
      value={props.value ?? ''}
      onChange={onChange}
      {...props}
    />,
  )

  return {
    select: screen.getByRole('combobox'),
    onChange,
    user: userEvent.setup(),
  }
}

describe('CreditCardSelector', () => {
  it('renders credit card label', () => {
    renderCreditCardSelector()

    expect(screen.getByLabelText('Cartão de crédito')).toBeInTheDocument()
  })

  it('renders default option', () => {
    renderCreditCardSelector()

    expect(
      screen.getByRole('option', {
        name: 'Selecione um cartão',
      }),
    ).toBeInTheDocument()
  })

  it('renders available credit cards', () => {
    renderCreditCardSelector()

    expect(
      screen.getByRole('option', {
        name: 'Nubank',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('option', {
        name: 'Inter Platinum',
      }),
    ).toBeInTheDocument()
  })

  it('renders selected credit card', () => {
    const { select } = renderCreditCardSelector({
      value: '2',
    })

    expect(select).toHaveValue('2')
  })

  it('calls onChange when selection changes', async () => {
    const { select, user, onChange } = renderCreditCardSelector()

    await user.selectOptions(select, '2')

    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith('2')
  })
})
