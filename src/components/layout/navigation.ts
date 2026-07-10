import {
  CreditCard,
  FileText,
  Goal,
  LayoutDashboard,
  ReceiptText,
  ShoppingCart,
  type LucideIcon,
} from 'lucide-react'

type NavigationItem = {
  label: string
  path: string
  icon: LucideIcon
}

export const navigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Transações',
    path: '/transactions',
    icon: ReceiptText,
  },
  {
    label: 'Cartões',
    path: '/credit-cards',
    icon: CreditCard,
  },
  {
    label: 'Faturas',
    path: '/invoices',
    icon: FileText,
  },
  {
    label: 'Compras',
    path: '/purchases',
    icon: ShoppingCart,
  },
  {
    label: 'Metas',
    path: '/goals',
    icon: Goal,
  },
]
