import { useEffect, useState } from 'react'

import { Alert } from '../../components/ui/alert'
import { Loading } from '../../components/ui/loading'
import { PageHeader } from '../../components/ui/page'
import { ConfirmDialog } from '../../components/ui/dialog'
import { useNotification } from '../../app/providers/useNotification'
import { getApiErrorMessage } from '../../lib/api/getApiErrorMessage'
import { financialAccountsApi } from '../../features/financial-accounts/api/financialAccountsApi'
import type { FinancialAccountResponse } from '../../features/financial-accounts/model/financialAccountTypes'
import FinancialAccountForm from '../../features/financial-accounts/components/FinancialAccountForm'
import FinancialAccountList from '../../features/financial-accounts/components/FinancialAccountList'

function FinancialAccountsPage() {
  const [financialAccounts, setFinancialAccounts] = useState<FinancialAccountResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [financialAccountToEdit, setFinancialAccountToEdit] =
    useState<FinancialAccountResponse | null>(null)

  const [financialAccountToDelete, setFinancialAccountToDelete] =
    useState<FinancialAccountResponse | null>(null)

  const [isDeleting, setIsDeleting] = useState(false)

  const { notify } = useNotification()

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

        setErrorMessage(
          getApiErrorMessage(error, 'Não foi possível carregar as contas financeiras.'),
        )
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

      notify.success('Conta financeira excluída com sucesso.')
    } catch (error) {
      notify.error(getApiErrorMessage(error, 'Não foi possível excluir a conta financeira.'))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <section>
      <PageHeader
        section="Contas e saldos"
        title="Contas financeiras"
        description="Gerencie suas contas, saldos disponíveis e fontes de pagamento."
      />

      <FinancialAccountForm
        key={financialAccountToEdit?.id ?? 'new'}
        financialAccount={financialAccountToEdit ?? undefined}
        onCreated={handleFinancialAccountCreated}
        onUpdated={handleFinancialAccountUpdated}
        onCancelEdit={() => setFinancialAccountToEdit(null)}
      />

      {isLoading && <Loading className="mt-8" message="Carregando contas financeiras..." />}

      {errorMessage && <Alert className="mt-8">{errorMessage}</Alert>}

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
        onCancel={() => {
          if (!isDeleting) {
            setFinancialAccountToDelete(null)
          }
        }}
        onConfirm={() => void handleDeleteFinancialAccount()}
      />
    </section>
  )
}

export default FinancialAccountsPage
