import { useEffect, useState } from 'react'

import { financialAccountsApi } from '../../features/financial-accounts/api/financialAccountsApi'
import { ConfirmDialog } from '../../components/ui/dialog'
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

  const [isDeleting, setIsDeleting] = useState(false)

  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null)

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

  async function handleDeleteFinancialAccount() {
    if (!financialAccountToDelete) {
      return
    }

    try {
      setIsDeleting(true)
      setDeleteErrorMessage(null)

      await financialAccountsApi.delete(financialAccountToDelete.id)

      setFinancialAccounts((currentFinancialAccounts) =>
        currentFinancialAccounts.filter(
          (financialAccount) => financialAccount.id !== financialAccountToDelete.id,
        ),
      )

      if (financialAccountToEdit?.id === financialAccountToDelete.id) {
        setFinancialAccountToEdit(null)
      }

      setFinancialAccountToDelete(null)
    } catch (error) {
      if (error instanceof ApiError) {
        setDeleteErrorMessage(error.message)
      } else {
        setDeleteErrorMessage('Não foi possível excluir a conta financeira.')
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <section>
      <div>
        <p className="text-sm font-medium text-emerald-400">Contas e saldos</p>

        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Contas financeiras</h1>

        <p className="mt-2 text-sm text-(--color-text-muted)">
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

      {isLoading && (
        <p className="mt-8 text-(--color-text-muted)">Carregando contas financeiras...</p>
      )}

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

      <ConfirmDialog
        open={financialAccountToDelete !== null}
        title="Excluir conta financeira"
        description={
          <>
            Tem certeza que deseja excluir a conta{' '}
            <strong className="text-(--color-text)">{financialAccountToDelete?.name}</strong>? Esta
            ação não poderá ser desfeita.
          </>
        }
        confirmLabel="Excluir conta"
        confirmLoadingLabel="Excluindo..."
        confirmVariant="danger"
        isLoading={isDeleting}
        errorMessage={deleteErrorMessage}
        onCancel={() => {
          if (!isDeleting) {
            setDeleteErrorMessage(null)
            setFinancialAccountToDelete(null)
          }
        }}
        onConfirm={() => void handleDeleteFinancialAccount()}
      />
    </section>
  )
}

export default FinancialAccountsPage
