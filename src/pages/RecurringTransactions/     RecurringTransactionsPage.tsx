import { useEffect, useState } from 'react'

import { Alert } from '../../components/ui/alert'
import { ApiError } from '../../lib/api/apiError'
import { PageHeader } from '../../components/ui/page'
import { ConfirmDialog } from '../../components/ui/dialog'
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

        if (error instanceof ApiError) {
          setErrorMessage(error.message)
        } else {
          setErrorMessage('Não foi possível carregar as recorrências.')
        }
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
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('Não foi possível atualizar a recorrência.')
      }
    }
  }

  async function confirmDelete() {
    if (!transactionToDelete) {
      return
    }

    try {
      await recurringTransactionsApi.delete(transactionToDelete.id)

      setRecurringTransactions((current) =>
        current.filter((item) => item.id !== transactionToDelete.id),
      )

      if (editingRecurringTransaction?.id === transactionToDelete.id) {
        setEditingRecurringTransaction(null)
      }

      setTransactionToDelete(null)
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('Não foi possível excluir a recorrência.')
      }
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
        recurringTransaction={editingRecurringTransaction ?? undefined}
        onCreated={(created) => {
          setRecurringTransactions((current) => [...current, created])
        }}
        onUpdated={(updated) => {
          setRecurringTransactions((current) =>
            current.map((item) => (item.id === updated.id ? updated : item)),
          )

          setEditingRecurringTransaction(null)
        }}
        onCancelEdit={() => setEditingRecurringTransaction(null)}
      />

      {isLoading && <p className="mt-8 text-(--color-text-muted)">Carregando recorrências...</p>}

      {errorMessage && <Alert className="mt-8">{errorMessage}</Alert>}

      {!isLoading && !errorMessage && (
        <RecurringTransactionList
          recurringTransactions={recurringTransactions}
          onEdit={setEditingRecurringTransaction}
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
        confirmVariant="danger"
        onCancel={() => setTransactionToDelete(null)}
        onConfirm={confirmDelete}
      />
    </section>
  )
}

export default RecurringTransactionsPage
