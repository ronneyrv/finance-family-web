import { useEffect, useState } from 'react'

import { financialAccountsApi } from '../../features/financial-accounts/api/financialAccountsApi'
import DeleteFinancialAccountDialog from '../../features/financial-accounts/components/DeleteFinancialAccountDialog'
import FinancialAccountForm from '../../features/financial-accounts/components/FinancialAccountForm'
import FinancialAccountList from '../../features/financial-accounts/components/FinancialAccountList'
import type { FinancialAccountResponse } from '../../features/financial-accounts/model/financialAccountTypes'
import { ApiError } from '../../lib/api/apiError'

function FinancialAccountsPage() {
  const [financialAccounts, setFinancialAccounts] = useState<FinancialAccountResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [financialAccountToEdit, setFinancialAccountToEdit] =
    useState<FinancialAccountResponse | null>(null)

  const [financialAccountToDelete, setFinancialAccountToDelete] =
    useState<FinancialAccountResponse | null>(null)

  useEffect(() => {
    let isCancelled = false

    async function loadFinancialAccounts() {
      try {
        setErrorMessage(null)

        const response = await financialAccountsApi.findAll()

        if (!isCancelled) {
          setFinancialAccounts(response)
        }
      } catch (error) {
        if (isCancelled) {
          return
        }

        if (error instanceof ApiError) {
          setErrorMessage(error.message)
        } else {
          setErrorMessage('Não foi possível carregar as contas financeiras.')
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadFinancialAccounts()

    return () => {
      isCancelled = true
    }
  }, [])

  function handleFinancialAccountCreated(createdFinancialAccount: FinancialAccountResponse) {
    setFinancialAccounts((currentFinancialAccounts) => [
      ...currentFinancialAccounts,
      createdFinancialAccount,
    ])
  }

  function handleFinancialAccountUpdated(updatedFinancialAccount: FinancialAccountResponse) {
    setFinancialAccounts((currentFinancialAccounts) =>
      currentFinancialAccounts.map((financialAccount) =>
        financialAccount.id === updatedFinancialAccount.id
          ? updatedFinancialAccount
          : financialAccount,
      ),
    )

    setFinancialAccountToEdit(null)
  }

  function handleFinancialAccountDeleted(financialAccountId: string) {
    setFinancialAccounts((currentFinancialAccounts) =>
      currentFinancialAccounts.filter(
        (financialAccount) => financialAccount.id !== financialAccountId,
      ),
    )

    setFinancialAccountToDelete(null)

    if (financialAccountToEdit?.id === financialAccountId) {
      setFinancialAccountToEdit(null)
    }
  }

  return (
    <section>
      <div>
        <p className="text-sm font-medium text-emerald-400">Contas e saldos</p>

        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Contas financeiras</h1>

        <p className="mt-2 text-sm text-slate-400">
          Gerencie suas contas, saldos disponíveis e fontes de pagamento.
        </p>
      </div>

      <FinancialAccountForm
        key={financialAccountToEdit?.id ?? 'new'}
        financialAccount={financialAccountToEdit ?? undefined}
        onCreated={handleFinancialAccountCreated}
        onUpdated={handleFinancialAccountUpdated}
        onCancelEdit={() => setFinancialAccountToEdit(null)}
      />

      {isLoading && <p className="mt-8 text-slate-400">Carregando contas financeiras...</p>}

      {errorMessage && (
        <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
          {errorMessage}
        </div>
      )}

      {!isLoading && !errorMessage && (
        <FinancialAccountList
          financialAccounts={financialAccounts}
          onEdit={setFinancialAccountToEdit}
          onDelete={setFinancialAccountToDelete}
        />
      )}

      {financialAccountToDelete && (
        <DeleteFinancialAccountDialog
          financialAccount={financialAccountToDelete}
          onDeleted={handleFinancialAccountDeleted}
          onCancel={() => setFinancialAccountToDelete(null)}
        />
      )}
    </section>
  )
}

export default FinancialAccountsPage
