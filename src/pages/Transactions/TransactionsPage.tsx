import { useEffect, useState, type SubmitEvent } from 'react'

import { Card } from '../../components/ui/card'
import { Alert } from '../../components/ui/alert'
import { Loading } from '../../components/ui/loading'
import { ApiError } from '../../lib/api/apiError'
import { PageHeader } from '../../components/ui/page'
import { ConfirmDialog } from '../../components/ui/dialog'
import { fieldClassName } from '../../components/ui/forms/fieldClass'
import { transactionsApi } from '../../features/transactions/api/transactionsApi'
import { ChevronDown, ChevronRight, Filter } from 'lucide-react'
import type { TransactionResponse } from '../../features/transactions/model/transactionTypes'
import TransactionForm from '../../features/transactions/components/TransactionForm'
import TransactionList from '../../features/transactions/components/TransactionList'

function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [transactionToDelete, setTransactionToDelete] = useState<TransactionResponse | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null)
  const [transactionToEdit, setTransactionToEdit] = useState<TransactionResponse | null>(null)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [reloadKey, setReloadKey] = useState(0)

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [appliedStartDate, setAppliedStartDate] = useState('')
  const [appliedEndDate, setAppliedEndDate] = useState('')

  useEffect(() => {
    let isCancelled = false

    async function loadTransactions() {
      try {
        setErrorMessage(null)

        const response = await transactionsApi.findAll({
          page,
          size: 20,
          startDate: appliedStartDate || undefined,
          endDate: appliedEndDate || undefined,
        })

        if (!isCancelled) {
          setTransactions(response.content)
          setTotalPages(response.totalPages)
          setTotalElements(response.totalElements)
        }
      } catch (error) {
        if (isCancelled) {
          return
        }

        if (error instanceof ApiError) {
          setErrorMessage(error.message)
        } else {
          setErrorMessage('Não foi possível carregar as transações.')
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadTransactions()

    return () => {
      isCancelled = true
    }
  }, [page, appliedStartDate, appliedEndDate, reloadKey])

  if (isLoading) {
    return <Loading message="Carregando transações..." />
  }

  if (errorMessage) {
    return <Alert>{errorMessage}</Alert>
  }

  function handleTransactionCreated() {
    if (page !== 0) {
      setPage(0)
    } else {
      setReloadKey((currentKey) => currentKey + 1)
    }
  }

  async function handleDeleteTransaction() {
    if (!transactionToDelete) {
      return
    }

    try {
      setIsDeleting(true)
      setDeleteErrorMessage(null)

      await transactionsApi.delete(transactionToDelete.id)

      const nextTotalElements = Math.max(totalElements - 1, 0)
      const nextTotalPages = Math.ceil(nextTotalElements / 20)

      setTransactionToDelete(null)

      setTotalElements(nextTotalElements)
      setTotalPages(nextTotalPages)

      const isOnlyItemOnCurrentPage = transactions.length === 1 && page > 0

      if (isOnlyItemOnCurrentPage) {
        setPage((currentPage) => currentPage - 1)
        return
      }

      const hasItemsAfterCurrentPage = totalElements > (page + 1) * 20

      if (hasItemsAfterCurrentPage) {
        setReloadKey((currentKey) => currentKey + 1)
        return
      }

      setTransactions((currentTransactions) =>
        currentTransactions.filter((transaction) => transaction.id !== transactionToDelete.id),
      )
    } catch (error) {
      if (error instanceof ApiError) {
        setDeleteErrorMessage(error.message)
      } else {
        setDeleteErrorMessage('Não foi possível excluir a transação.')
      }
    } finally {
      setIsDeleting(false)
    }
  }

  function handleTransactionUpdated(updatedTransaction: TransactionResponse) {
    setTransactions((currentTransactions) =>
      currentTransactions.map((transaction) =>
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction,
      ),
    )

    setTransactionToEdit(null)
  }

  function handleFilterSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    setPage(0)
    setAppliedStartDate(startDate)
    setAppliedEndDate(endDate)
  }

  function handleClearFilters() {
    setStartDate('')
    setEndDate('')
    setAppliedStartDate('')
    setAppliedEndDate('')
    setPage(0)
  }

  return (
    <section>
      <PageHeader
        section="Movimentações"
        title="Transações"
        description="Acompanhe suas receitas e despesas."
      />

      <TransactionForm
        key={transactionToEdit?.id ?? 'new'}
        transaction={transactionToEdit ?? undefined}
        onCreated={handleTransactionCreated}
        onUpdated={handleTransactionUpdated}
        onCancelEdit={() => setTransactionToEdit(null)}
      />

      <button
        type="button"
        onClick={() => setShowFilters((value) => !value)}
        className="mt-6 mb-6 flex w-full items-center justify-between rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-sm font-medium text-(--color-text) transition hover:bg-(--color-surface-hover)"
      >
        <span className="flex items-center gap-2">
          <Filter size={18} />
          Filtros
        </span>

        {showFilters ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>

      {showFilters && (
        <Card className="mt-6">
          <form onSubmit={handleFilterSubmit}>
            <div>
              <h2 className="text-lg font-semibold text-(--color-text)">Filtrar por período</h2>

              <p className="mt-1 text-sm text-(--color-text-muted)">
                Selecione uma data inicial e final para consultar as movimentações.
              </p>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
              <label>
                <span className="text-sm text-(--color-text)">Data inicial</span>

                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className={fieldClassName}
                />
              </label>

              <label>
                <span className="text-sm text-(--color-text)">Data final</span>

                <input
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  className={fieldClassName}
                />
              </label>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-emerald-500 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-emerald-400 lg:flex-none"
                >
                  Filtrar
                </button>

                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="flex-1 rounded-lg border border-slate-700 px-4 py-2.5 font-medium text-slate-300 transition hover:bg-slate-900 lg:flex-none"
                >
                  Limpar
                </button>
              </div>
            </div>
          </form>
        </Card>
      )}

      <TransactionList
        transactions={transactions}
        onEdit={setTransactionToEdit}
        onDelete={setTransactionToDelete}
      />

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between gap-4">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((currentPage) => currentPage - 1)}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Anterior
          </button>

          <span className="text-sm text-slate-400">
            Página {page + 1} de {totalPages}
          </span>

          <button
            type="button"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((currentPage) => currentPage + 1)}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Próxima
          </button>
        </div>
      )}

      <ConfirmDialog
        open={transactionToDelete !== null}
        title="Excluir transação?"
        description={
          <>
            <strong className="text-(--color-text)">{transactionToDelete?.description}</strong> será
            excluída permanentemente.
          </>
        }
        confirmLabel="Excluir"
        confirmLoadingLabel="Excluindo..."
        confirmVariant="danger"
        isLoading={isDeleting}
        errorMessage={deleteErrorMessage}
        onCancel={() => {
          if (!isDeleting) {
            setDeleteErrorMessage(null)
            setTransactionToDelete(null)
          }
        }}
        onConfirm={() => void handleDeleteTransaction()}
      />
    </section>
  )
}

export default TransactionsPage
