import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { ProtectedRoute } from '../../components/auth/ProtectedRoute'
import { PublicOnlyRoute } from '../../components/auth/PublicOnlyRoute'
import AppLayout from '../../components/layout/AppLayout'
import Loading from '../../components/ui/loading/Loading'

const LoginPage = lazy(() => import('../../pages/Login/LoginPage'))
const RegisterPage = lazy(() => import('../../pages/Register/RegisterPage'))
const DashboardPage = lazy(() => import('../../pages/Dashboard/DashboardPage'))
const TransactionsPage = lazy(() => import('../../pages/Transactions/TransactionsPage'))
const RecurringTransactionsPage = lazy(
  () => import('../../pages/RecurringTransactions/RecurringTransactionsPage'),
)
const FinancialAccountsPage = lazy(
  () => import('../../pages/FinancialAccounts/FinancialAccountsPage'),
)
const CreditCardsPage = lazy(() => import('../../pages/CreditCards/CreditCardsPage'))
const InvoicesPage = lazy(() => import('../../pages/Invoices/InvoicesPage'))
const ProfilePage = lazy(() => import('../../pages/Profile/ProfilePage'))
const NotFoundPage = lazy(() => import('../../pages/NotFound/NotFoundPage'))

function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading message="Carregando página..." />}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/recurring-transactions" element={<RecurringTransactionsPage />} />
              <Route path="/financial-accounts" element={<FinancialAccountsPage />} />
              <Route path="/credit-cards" element={<CreditCardsPage />} />
              <Route path="/invoices" element={<InvoicesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default AppRouter
