import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import Alert from './Alert'

type AlertProps = React.ComponentProps<typeof Alert>

function renderAlert(props: Partial<AlertProps> = {}) {
  render(<Alert {...props}>{props.children ?? 'Mensagem de alerta'}</Alert>)

  return {
    alert: screen.getByRole('alert'),
  }
}

describe('Alert', () => {
  it('renders alert content', () => {
    renderAlert()

    expect(screen.getByText('Mensagem de alerta')).toBeInTheDocument()
  })

  it('renders with alert role', () => {
    const { alert } = renderAlert()

    expect(alert).toHaveAttribute('role', 'alert')
  })

  it('uses error variant by default', () => {
    const { alert } = renderAlert()

    expect(alert).toHaveClass('border-red-500/20')
  })

  it.each([
    ['success', 'border-emerald-500/20'],
    ['warning', 'border-yellow-500/20'],
    ['info', 'border-sky-500/20'],
  ] as const)('applies %s variant', (variant, expectedClass) => {
    const { alert } = renderAlert({ variant })

    expect(alert).toHaveClass(expectedClass)
  })

  it('preserves custom class names', () => {
    const { alert } = renderAlert({
      className: 'mt-4',
    })

    expect(alert).toHaveClass('mt-4')
  })
})
