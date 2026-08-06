import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import Loading from './Loading'

type LoadingProps = React.ComponentProps<typeof Loading>

function renderLoading(props: Partial<LoadingProps> = {}) {
  render(<Loading {...props} />)

  return {
    loading: screen.getByText(props.message ?? 'Carregando...'),
  }
}

describe('Loading', () => {
  it('renders default message', () => {
    const { loading } = renderLoading()

    expect(loading).toBeInTheDocument()
  })

  it('renders custom message', () => {
    const { loading } = renderLoading({
      message: 'Buscando transações...',
    })

    expect(loading).toBeInTheDocument()
  })

  it('preserves custom class names', () => {
    const { loading } = renderLoading({
      className: 'mt-4',
    })

    expect(loading).toHaveClass('mt-4')
  })
})
