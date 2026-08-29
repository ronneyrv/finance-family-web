import { useEffect, useState } from 'react'

import { Alert } from '../../components/ui/alert'
import { Loading } from '../../components/ui/loading'
import { PageHeader } from '../../components/ui/page'
import { scrollToTop } from '../../lib/utils/scrollToTop'
import { ConfirmDialog } from '../../components/ui/dialog'
import { useNotification } from '../../app/providers/useNotification'
import { getApiErrorMessage } from '../../lib/api/getApiErrorMessage'
import { recurringTransactionsApi } from '../../features/recurring-transactions/api/recurringTransactionsApi'
import type { RecurringTransactionResponse } from '../../features/recurring-transactions/model/recurringTransactionTypes'
import RecurringTransactionForm from '../../features/recurring-transactions/components/RecurringTransactionForm'
import RecurringTransactionList from '../../features/recurring-transactions/components/RecurringTransactionList'

function RecurringTransactionsPage() {
  const [recurringTransactions, setRecurringTransactions] = useState<
    RecurringTransactionResponse[]
  >([])

  const [editingRecurringTransaction, setEditingRecurringTransaction] =
    useState<RecurringTransactionResponse | null>(null)

  const [transactionToDelete, setTransactionToDelete] =
    useState<RecurringTransactionResponse | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { notify } = useNotification()

  useEffect(() => {
    let isCancelled = false

    async function loadRecurringTransactions() {
      try {
        setErrorMessage(null)

        const response = await recurringTransactionsApi.findAll()

        if (!isCancelled) {
          setRecurringTransactions(response)
        }
      } catch (error) {
        if (isCancelled) {
          return
        }

        setErrorMessage(getApiErrorMessage(error, 'Não foi possível carregar as recorrências.'))
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadRecurringTransactions()

    return () => {
      isCancelled = true
    }
  }, [])

  async function handleToggleStatus(id: string, active: boolean) {
    try {
      const updated = await recurringTransactionsApi.updateStatus(id, active)

      setRecurringTransactions((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      )

      if (editingRecurringTransaction?.id === updated.id) {
        setEditingRecurringTransaction(updated)
      }

      notify.success(
        active ? 'Recorrência ativada com sucesso.' : 'Recorrência desativada com sucesso.',
      )
    } catch (error) {
      notify.error(getApiErrorMessage(error, 'Não foi possível atualizar a recorrência.'))
    }
  }

  async function confirmDelete() {
    if (!transactionToDelete) {
      return
    }

    try {
      setIsDeleting(true)

      await recurringTransactionsApi.delete(transactionToDelete.id)

      notify.success('Recorrência excluída com sucesso.')

      setRecurringTransactions((current) =>
        current.filter((item) => item.id !== transactionToDelete.id),
      )

      if (editingRecurringTransaction?.id === transactionToDelete.id) {
        setEditingRecurringTransaction(null)
      }

      setTransactionToDelete(null)
    } catch (error) {
      notify.error(getApiErrorMessage(error, 'Não foi possível excluir a recorrência.'))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <section>
      <PageHeader
        section="Planejamento financeiro"
        title="Transações recorrentes"
        description="Gerencie receitas e despesas recorrentes."
      />

      <RecurringTransactionForm
        key={editingRecurringTransaction?.id ?? 'new'}
        recurringTransaction={editingRecurringTransaction ?? undefined}
        onCreated={(created) => {
          setRecurringTransactions((current) => [...current, created])
          scrollToTop()
        }}
        onUpdated={(updated) => {
          setRecurringTransactions((current) =>
            current.map((item) => (item.id === updated.id ? updated : item)),
          )

          setEditingRecurringTransaction(null)
          scrollToTop()
        }}
        onCancelEdit={() => setEditingRecurringTransaction(null)}
      />

      {isLoading && <Loading className="mt-8" message="Carregando recorrências..." />}

      {errorMessage && <Alert className="mt-8">{errorMessage}</Alert>}

      {!isLoading && !errorMessage && (
        <RecurringTransactionList
          recurringTransactions={recurringTransactions}
          onEdit={(transaction) => {
            setEditingRecurringTransaction(transaction)
            scrollToTop()
          }}
          onToggleStatus={handleToggleStatus}
          onDelete={(id) => {
            const transaction = recurringTransactions.find((item) => item.id === id)

            if (transaction) {
              setTransactionToDelete(transaction)
            }
          }}
        />
      )}

      <ConfirmDialog
        open={transactionToDelete !== null}
        title="Excluir recorrência"
        description={`Deseja excluir "${transactionToDelete?.description}"?`}
        confirmLabel="Excluir"
        confirmLoadingLabel="Excluindo..."
        confirmVariant="danger"
        isLoading={isDeleting}
        onCancel={() => setTransactionToDelete(null)}
        onConfirm={confirmDelete}
      />
    </section>
  )
}

export default RecurringTransactionsPage
