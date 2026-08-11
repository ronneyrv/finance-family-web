import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'

import MoneyInput from './MoneyInput'

function TestWrapper({ initialValue = '' }: { initialValue?: string }) {
  const [value, setValue] = useState(initialValue)

  return <MoneyInput value={value} onChange={setValue} />
}

describe('MoneyInput', () => {
  it('renders the current value', () => {
    render(<TestWrapper initialValue="1.299,36" />)

    expect(screen.getByRole('textbox')).toHaveValue('1.299,36')
  })

  it('formats digits as Brazilian currency', async () => {
    const user = userEvent.setup()

    render(<TestWrapper />)

    const input = screen.getByRole('textbox')

    await user.type(input, '123456')

    expect(input).toHaveValue('1.234,56')
  })

  it('ignores non-numeric characters', async () => {
    const user = userEvent.setup()

    render(<TestWrapper />)

    const input = screen.getByRole('textbox')

    await user.type(input, 'abc123')

    expect(input).toHaveValue('1,23')
  })

  it('formats large monetary values with thousands separator', async () => {
    const user = userEvent.setup()

    render(<TestWrapper />)

    const input = screen.getByRole('textbox')

    await user.type(input, '123456789')

    expect(input).toHaveValue('1.234.567,89')
  })
})
