import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import EmptyState from './EmptyState'

type EmptyStateProps = React.ComponentProps<typeof EmptyState>

function renderEmptyState(props: Partial<EmptyStateProps> = {}) {
  render(
    <EmptyState
      title={props.title ?? 'Nenhum resultado encontrado'}
      description={props.description}
      className={props.className}
    />,
  )

  return {
    title: screen.getByText(props.title ?? 'Nenhum resultado encontrado'),
  }
}

describe('EmptyState', () => {
  it('renders title', () => {
    const { title } = renderEmptyState()

    expect(title).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    renderEmptyState({
      description: 'Adicione sua primeira transação.',
    })

    expect(screen.getByText('Adicione sua primeira transação.')).toBeInTheDocument()
  })

  it('does not render description when omitted', () => {
    renderEmptyState()

    expect(screen.queryByText('Adicione sua primeira transação.')).not.toBeInTheDocument()
  })

  it('preserves custom class names', () => {
    const { title } = renderEmptyState({
      className: 'mt-4',
    })

    expect(title.parentElement).toHaveClass('mt-4')
  })
})
