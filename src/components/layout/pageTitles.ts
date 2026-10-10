const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/transactions': 'Transações',
  '/recurring-transactions': 'Transações recorrentes',
  '/financial-accounts': 'Contas Financeiras',
  '/credit-cards': 'Cartões de Crédito',
  '/invoices': 'Faturas',
  '/profile': 'Perfil',
}

export function getPageTitle(pathname: string): string {
  return pageTitles[pathname] ?? 'Finance Family'
}
