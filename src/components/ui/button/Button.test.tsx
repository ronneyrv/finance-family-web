import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import Button from './Button'

type ButtonProps = React.ComponentProps<typeof Button>

function renderButton(props: Partial<ButtonProps> = {}) {
  const onClick = vi.fn()

  render(
    <Button onClick={onClick} {...props}>
      {props.children ?? 'Salvar'}
    </Button>,
  )

  return {
    button: screen.getByRole('button'),
    onClick,
    user: userEvent.setup(),
  }
}

describe('Button', () => {
  it('renders button children', () => {
    const { button } = renderButton()

    expect(button).toHaveTextContent('Salvar')
  })

  it.each([
    ['primary', 'bg-emerald-500'],
    ['secondary', 'bg-transparent'],
    ['danger', 'bg-red-500'],
  ] as const)('applies %s variant', (variant, expectedClass) => {
    const { button } = renderButton({ variant })

    expect(button).toHaveClass(expectedClass)
  })

  it('uses primary variant by default', () => {
    const { button } = renderButton()

    expect(button).toHaveClass('bg-emerald-500')
  })

  it('applies full width class', () => {
    const { button } = renderButton({ fullWidth: true })

    expect(button).toHaveClass('w-full')
  })

  it('preserves custom class names', () => {
    const { button } = renderButton({ className: 'mt-4' })

    expect(button).toHaveClass('mt-4')
  })

  it('calls onClick handler', async () => {
    const { button, user, onClick } = renderButton()

    await user.click(button)

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('renders disabled button', () => {
    const { button } = renderButton({ disabled: true })

    expect(button).toBeDisabled()
  })
})
