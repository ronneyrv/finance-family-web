import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import Toast from './Toast'

describe('Toast', () => {
  it('renders notification content', () => {
    render(<Toast>Operation completed successfully.</Toast>)

    expect(screen.getByText('Operation completed successfully.')).toBeInTheDocument()
  })

  it('uses status role for success and info variants', () => {
    const { rerender } = render(<Toast variant="success">Success</Toast>)

    expect(screen.getByRole('status')).toBeInTheDocument()

    rerender(<Toast variant="info">Info</Toast>)

    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('uses alert role for error and warning variants', () => {
    const { rerender } = render(<Toast variant="error">Error</Toast>)

    expect(screen.getByRole('alert')).toBeInTheDocument()

    rerender(<Toast variant="warning">Warning</Toast>)

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it.each([
    ['success', 'border-emerald-500/20'],
    ['error', 'border-red-500/20'],
    ['warning', 'border-yellow-500/20'],
    ['info', 'border-sky-500/20'],
  ] as const)('applies %s variant', (variant, expectedClass) => {
    render(<Toast variant={variant}>Message</Toast>)

    expect(
      screen.getByRole(variant === 'error' || variant === 'warning' ? 'alert' : 'status'),
    ).toHaveClass(expectedClass)
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()

    render(<Toast onClose={onClose}>Message</Toast>)

    screen.getByRole('button', { name: 'Close notification' }).click()

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('does not render close button when onClose is not provided', () => {
    render(<Toast>Message</Toast>)

    expect(screen.queryByRole('button', { name: 'Close notification' })).not.toBeInTheDocument()
  })
})
