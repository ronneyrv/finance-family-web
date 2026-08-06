import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import Dialog from './Dialog'

type DialogProps = React.ComponentProps<typeof Dialog>

function renderDialog(props: Partial<DialogProps> = {}) {
  const onClose = vi.fn()

  render(
    <Dialog
      open={props.open ?? true}
      title={props.title ?? 'Excluir transação'}
      onClose={onClose}
      {...props}
    >
      {props.children ?? <p>Tem certeza?</p>}
    </Dialog>,
  )

  return {
    onClose,
    user: userEvent.setup(),
  }
}

describe('Dialog', () => {
  it('should not render when closed', () => {
    renderDialog({ open: false })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should render dialog when open', () => {
    renderDialog()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Excluir transação' })).toBeInTheDocument()
    expect(screen.getByText('Tem certeza?')).toBeInTheDocument()
  })

  it('should call onClose when Escape is pressed', async () => {
    const { onClose, user } = renderDialog()

    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('should call onClose when backdrop is clicked', () => {
    const { onClose } = renderDialog()

    fireEvent.mouseDown(screen.getByRole('presentation'))

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('should not call onClose when dialog content is clicked', () => {
    const { onClose } = renderDialog()

    fireEvent.mouseDown(screen.getByRole('dialog'))

    expect(onClose).not.toHaveBeenCalled()
  })

  it('should focus dialog when opened', () => {
    renderDialog()

    expect(screen.getByRole('dialog')).toHaveFocus()
  })
})
