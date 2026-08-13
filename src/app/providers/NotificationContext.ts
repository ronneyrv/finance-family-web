import { createContext } from 'react'

type NotificationContextValue = {
  notify: {
    success: (message: string) => void
    error: (message: string) => void
    warning: (message: string) => void
    info: (message: string) => void
  }
}

export const NotificationContext = createContext<NotificationContextValue | undefined>(undefined)

export type { NotificationContextValue }
