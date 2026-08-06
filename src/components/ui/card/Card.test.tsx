import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import Card from './Card'

function renderCard(props: Partial<React.ComponentProps<typeof Card>> = {}) {
  render(<Card {...props}>{props.children ?? 'Card content'}</Card>)

  return {
    card: screen.getByText('Card content'),
  }
}

describe('Card', () => {
  it('renders children', () => {
    renderCard()

    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('renders as div by default', () => {
    renderCard()

    expect(screen.getByText('Card content').tagName).toBe('DIV')
  })

  it('renders custom element', () => {
    render(<Card as="section">Card content</Card>)

    expect(screen.getByText('Card content').tagName).toBe('SECTION')
  })

  it('preserves custom class names', () => {
    render(<Card className="mt-4">Card content</Card>)

    expect(screen.getByText('Card content')).toHaveClass('mt-4')
  })

  it('forwards additional props', () => {
    render(<Card data-testid="card">Card content</Card>)

    expect(screen.getByTestId('card')).toBeInTheDocument()
  })

  it('applies base card styles', () => {
    renderCard()

    expect(screen.getByText('Card content')).toHaveClass('rounded-xl')
  })
})
