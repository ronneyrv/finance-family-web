import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import FinancialAccountSelector from './FinancialAccountSelector'

type FinancialAccountSelectorProps = React.ComponentProps<typeof FinancialAccountSelector>

function renderFinancialAccountSelector(props: Partial<FinancialAccountSelectorProps> = {}) {
  const onChange = vi.fn()

  render(
    <FinancialAccountSelector
      accounts={
        props.accounts ?? [
          {
            id: '1',
            name: 'Conta Principal',
            accountType: 'CHECKING_ACCOUNT',
            initialBalance: 0,
            currentBalance: 1000,
          },
          {
            id: '2',
            name: 'Conta Reserva',
            accountType: 'SAVINGS_ACCOUNT',
            initialBalance: 500,
            currentBalance: 1500,
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

describe('FinancialAccountSelector', () => {
  it('renders financial account label', () => {
    renderFinancialAccountSelector()

    expect(screen.getByLabelText('Conta financeira')).toBeInTheDocument()
  })

  it('renders default option', () => {
    renderFinancialAccountSelector()

    expect(
      screen.getByRole('option', {
        name: 'Selecione uma conta',
      }),
    ).toBeInTheDocument()
  })

  it('renders available accounts', () => {
    renderFinancialAccountSelector()

    expect(
      screen.getByRole('option', {
        name: 'Conta Principal',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('option', {
        name: 'Conta Reserva',
      }),
    ).toBeInTheDocument()
  })

  it('renders selected account', () => {
    const { select } = renderFinancialAccountSelector({
      value: '2',
    })

    expect(select).toHaveValue('2')
  })

  it('calls onChange when selection changes', async () => {
    const { select, user, onChange } = renderFinancialAccountSelector()

    await user.selectOptions(select, '2')

    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith('2')
  })
})
