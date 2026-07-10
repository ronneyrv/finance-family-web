import {
  CreditCard,
  FileText,
  Goal,
  LayoutDashboard,
  ReceiptText,
  Landmark,
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
    label: 'Contas',
    path: '/financial-accounts',
    icon: Landmark,
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
    label: 'Metas',
    path: '/goals',
    icon: Goal,
  },
]
