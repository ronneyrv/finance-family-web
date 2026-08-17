import { useEffect, useState } from 'react'

import { Alert } from '../../components/ui/alert'
import { Button } from '../../components/ui/button'
import { Loading } from '../../components/ui/loading'
import { PageHeader } from '../../components/ui/page'
import { scrollToTop } from '../../lib/utils/scrollToTop'
import { useNotification } from '../../app/providers/useNotification'
import { getApiErrorMessage } from '../../lib/api/getApiErrorMessage'
import { financialAccountsApi } from '../../features/financial-accounts/api/financialAccountsApi'
import { ConfirmDialog, Dialog } from '../../components/ui/dialog'
import type { FinancialAccountResponse } from '../../features/financial-accounts/model/financialAccountTypes'
import FinancialAccountForm from '../../features/financial-accounts/components/FinancialAccountForm'
import FinancialAccountList from '../../features/financial-accounts/components/FinancialAccountList'
import TransferForm from '../../features/transfers/components/TransferForm'

function FinancialAccountsPage() {
  const [financialAccounts, setFinancialAccounts] = useState<FinancialAccountResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [financialAccountToEdit, setFinancialAccountToEdit] =
    useState<FinancialAccountResponse | null>(null)

  const [financialAccountToDelete, setFinancialAccountToDelete] =
    useState<FinancialAccountResponse | null>(null)

  const [isDeleting, setIsDeleting] = useState(false)

  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)

  const { notify } = useNotification()

  async function loadFinancialAccounts() {
    try {
      setErrorMessage(null)

      const response = await financialAccountsApi.findAll()

      setFinancialAccounts(response)
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Não foi possível carregar as contas financeiras.'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadFinancialAccounts()
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
    scrollToTop()
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

      <div className="mt-6">
        <Button type="button" onClick={() => setIsTransferDialogOpen(true)}>
          Transferir entre contas
        </Button>
      </div>

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
          onEdit={(financialAccount) => {
            setFinancialAccountToEdit(financialAccount)
            scrollToTop()
          }}
          onDelete={setFinancialAccountToDelete}
        />
      )}

      <Dialog
        open={isTransferDialogOpen}
        title="Transferir entre contas"
        onClose={() => setIsTransferDialogOpen(false)}
      >
        <TransferForm
          financialAccounts={financialAccounts}
          onSuccess={() => {
            setIsTransferDialogOpen(false)
            void loadFinancialAccounts()
          }}
          onCancel={() => setIsTransferDialogOpen(false)}
        />
      </Dialog>

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
