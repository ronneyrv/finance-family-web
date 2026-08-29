import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

import Toast, { type ToastVariant } from '../../components/ui/toast/Toast'
import { NotificationContext } from './NotificationContext'

type Notification = {
  id: number
  variant: ToastVariant
  message: string
}

type NotificationProviderProps = {
  children: ReactNode
}

const TOAST_DURATION = 5000

function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const activeNotifications = useRef<Set<string>>(new Set())
  const timers = useRef<number[]>([])

  const removeNotification = useCallback((id: number) => {
    setNotifications((current) => {
      const notification = current.find((item) => item.id === id)

      if (notification) {
        const notificationKey = `${notification.variant}:${notification.message}`
        activeNotifications.current.delete(notificationKey)
      }

      return current.filter((item) => item.id !== id)
    })
  }, [])

  const addNotification = useCallback(
    (variant: ToastVariant, message: string) => {
      const notificationKey = `${variant}:${message}`

      if (activeNotifications.current.has(notificationKey)) {
        return
      }

      const id = Date.now() + Math.random()

      activeNotifications.current.add(notificationKey)

      setNotifications((current) => [...current, { id, variant, message }])

      const timer = window.setTimeout(() => {
        removeNotification(id)
        activeNotifications.current.delete(notificationKey)
        timers.current = timers.current.filter((currentTimer) => currentTimer !== timer)
      }, TOAST_DURATION)

      timers.current.push(timer)
    },
    [removeNotification],
  )

  const notify = useMemo(
    () => ({
      success: (message: string) => addNotification('success', message),
      error: (message: string) => addNotification('error', message),
      warning: (message: string) => addNotification('warning', message),
      info: (message: string) => addNotification('info', message),
    }),
    [addNotification],
  )

  const value = useMemo(() => ({ notify }), [notify])

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  return (
    <NotificationContext.Provider value={value}>
      {children}

      <div
        aria-label="Notifications"
        className="pointer-events-none fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3"
      >
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <Toast
              variant={notification.variant}
              onClose={() => removeNotification(notification.id)}
            >
              {notification.message}
            </Toast>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export default NotificationProvider
