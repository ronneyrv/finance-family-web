import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import InstallmentSelector from './InstallmentSelector'

type InstallmentSelectorProps = React.ComponentProps<typeof InstallmentSelector>

function renderInstallmentSelector(props: Partial<InstallmentSelectorProps> = {}) {
  const onChange = vi.fn()

  render(<InstallmentSelector value={props.value ?? '1'} onChange={onChange} {...props} />)

  return {
    input: screen.getByRole('spinbutton'),
    onChange,
    user: userEvent.setup(),
  }
}

describe('InstallmentSelector', () => {
  it('renders installment label', () => {
    renderInstallmentSelector()

    expect(screen.getByLabelText('Parcelas')).toBeInTheDocument()
  })

  it('renders current value', () => {
    const { input } = renderInstallmentSelector({
      value: '12',
    })

    expect(input).toHaveValue(12)
  })

  it('renders numeric constraints', () => {
    const { input } = renderInstallmentSelector()

    expect(input).toHaveAttribute('min', '1')
    expect(input).toHaveAttribute('max', '36')
  })

  it('renders number input', () => {
    const { input } = renderInstallmentSelector()

    expect(input).toHaveAttribute('type', 'number')
  })

  it('calls onChange when value changes', async () => {
    const { input, user, onChange } = renderInstallmentSelector()

    await user.clear(input)
    await user.type(input, '12')

    expect(onChange).toHaveBeenLastCalledWith('12')
  })
})
