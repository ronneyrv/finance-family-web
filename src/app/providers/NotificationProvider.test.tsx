import { act, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import NotificationProvider from './NotificationProvider'
import { useNotification } from './useNotification'

function TestConsumer() {
  const { notify } = useNotification()

  return (
    <div>
      <button type="button" onClick={() => notify.success('Success message')}>
        Success
      </button>

      <button type="button" onClick={() => notify.error('Error message')}>
        Error
      </button>

      <button type="button" onClick={() => notify.warning('Warning message')}>
        Warning
      </button>

      <button type="button" onClick={() => notify.info('Info message')}>
        Info
      </button>
    </div>
  )
}

describe('NotificationProvider', () => {
  it('renders children', () => {
    render(
      <NotificationProvider>
        <div>Application content</div>
      </NotificationProvider>,
    )

    expect(screen.getByText('Application content')).toBeInTheDocument()
  })

  it.each([
    ['success', 'Success', 'Success message', 'status'],
    ['error', 'Error', 'Error message', 'alert'],
    ['warning', 'Warning', 'Warning message', 'alert'],
    ['info', 'Info', 'Info message', 'status'],
  ] as const)('renders %s notification', (_, buttonText, message, role) => {
    render(
      <NotificationProvider>
        <TestConsumer />
      </NotificationProvider>,
    )

    act(() => {
      screen.getByRole('button', { name: buttonText }).click()
    })

    expect(screen.getByRole(role)).toHaveTextContent(message)
  })

  it('renders multiple notifications', () => {
    render(
      <NotificationProvider>
        <TestConsumer />
      </NotificationProvider>,
    )

    act(() => {
      screen.getByRole('button', { name: 'Success' }).click()
      screen.getByRole('button', { name: 'Info' }).click()
    })

    expect(screen.getByText('Success message')).toBeInTheDocument()
    expect(screen.getByText('Info message')).toBeInTheDocument()
  })

  it('removes a notification when it is closed', () => {
    render(
      <NotificationProvider>
        <TestConsumer />
      </NotificationProvider>,
    )

    act(() => {
      screen.getByRole('button', { name: 'Success' }).click()
    })

    expect(screen.getByText('Success message')).toBeInTheDocument()

    act(() => {
      screen.getByRole('button', { name: 'Close notification' }).click()
    })

    expect(screen.queryByText('Success message')).not.toBeInTheDocument()
  })

  it('automatically removes a notification after the configured duration', () => {
    vi.useFakeTimers()

    render(
      <NotificationProvider>
        <TestConsumer />
      </NotificationProvider>,
    )

    act(() => {
      screen.getByRole('button', { name: 'Success' }).click()
    })

    expect(screen.getByText('Success message')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(screen.queryByText('Success message')).not.toBeInTheDocument()

    vi.useRealTimers()
  })

  it('throws when useNotification is used outside the provider', () => {
    expect(() => render(<TestConsumer />)).toThrow(
      'useNotification must be used within a NotificationProvider',
    )
  })
})
