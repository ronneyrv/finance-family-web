import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PublicOnlyRoute } from '../../components/auth/PublicOnlyRoute'
import { ProtectedRoute } from '../../components/auth/ProtectedRoute'
import LoginPage from '../../pages/Login/LoginPage'
import NotFoundPage from '../../pages/NotFound/NotFoundPage'
import GoalsPage from '../../pages/Goals/GoalsPage'
import PurchasesPage from '../../pages/Purchases/PurchasesPage'
import CreditCardsPage from '../../pages/CreditCards/CreditCardsPage'
import TransactionsPage from '../../pages/Transactions/TransactionsPage'
import DashboardPage from '../../pages/Dashboard/DashboardPage'
import AppLayout from '../../components/layout/AppLayout'
import InvoicesPage from '../../pages/Invoices/InvoicesPage'
import FinancialAccountsPage from '../../pages/FinancialAccounts/FinancialAccountsPage'
import RegisterPage from '../../pages/Register/RegisterPage'

function AppRouter() {
  return (
    <BrowserRouter>
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
            <Route path="/financial-accounts" element={<FinancialAccountsPage />} />
            <Route path="/credit-cards" element={<CreditCardsPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/purchases" element={<PurchasesPage />} />
            <Route path="/goals" element={<GoalsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
