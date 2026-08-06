import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Circle } from 'lucide-react'
import { describe, expect, it, vi } from 'vitest'

import SegmentedButton from './SegmentedButton'

type SegmentedButtonProps = React.ComponentProps<typeof SegmentedButton>

function renderSegmentedButton(props: Partial<SegmentedButtonProps> = {}) {
  const onClick = vi.fn()

  render(
    <SegmentedButton selected={props.selected ?? false} onClick={onClick} {...props}>
      {props.children ?? 'Receitas'}
    </SegmentedButton>,
  )

  return {
    button: screen.getByRole('button'),
    onClick,
    user: userEvent.setup(),
  }
}

describe('SegmentedButton', () => {
  it('renders button content', () => {
    const { button } = renderSegmentedButton()

    expect(button).toHaveTextContent('Receitas')
  })

  it('renders icon when provided', () => {
    renderSegmentedButton({
      icon: <Circle data-testid="segmented-button-icon" />,
    })

    expect(screen.getByTestId('segmented-button-icon')).toBeInTheDocument()
  })

  it('calls onClick handler', async () => {
    const { button, user, onClick } = renderSegmentedButton()

    await user.click(button)

    expect(onClick).toHaveBeenCalledOnce()
  })

  it.each([
    [true, 'border-(--color-primary)'],
    [false, 'border-(--color-border)'],
  ] as const)('renders selected=%s state', (selected, expectedClass) => {
    const { button } = renderSegmentedButton({
      selected,
    })

    expect(button).toHaveAttribute('aria-pressed', String(selected))

    expect(button).toHaveClass(expectedClass)
  })
})
