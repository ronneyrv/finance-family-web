import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import TransactionTypeSelector from './TransactionTypeSelector'

type TransactionTypeSelectorProps = React.ComponentProps<typeof TransactionTypeSelector>

function renderTransactionTypeSelector(props: Partial<TransactionTypeSelectorProps> = {}) {
  const onChange = vi.fn()

  render(<TransactionTypeSelector value={props.value ?? 'INCOME'} onChange={onChange} {...props} />)

  return {
    onChange,
    user: userEvent.setup(),
  }
}

describe('TransactionTypeSelector', () => {
  it('renders transaction type options', () => {
    renderTransactionTypeSelector()

    expect(screen.getByText('Tipo')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Receita' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Despesa' })).toBeInTheDocument()
  })

  it('marks selected transaction type', () => {
    renderTransactionTypeSelector({
      value: 'EXPENSE',
    })

    expect(screen.getByRole('button', { name: 'Receita' })).toHaveAttribute('aria-pressed', 'false')

    expect(screen.getByRole('button', { name: 'Despesa' })).toHaveAttribute('aria-pressed', 'true')
  })

  it.each([
    ['Receita', 'INCOME'],
    ['Despesa', 'EXPENSE'],
  ] as const)('calls onChange when %s is selected', async (label, expectedValue) => {
    const { user, onChange } = renderTransactionTypeSelector()

    await user.click(screen.getByRole('button', { name: label }))

    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith(expectedValue)
  })
})
