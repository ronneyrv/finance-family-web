import { useEffect, useState, type SubmitEvent } from 'react'

import { ChevronDown, ChevronRight, Filter } from 'lucide-react'
import { transactionsApi } from '../../features/transactions/api/transactionsApi'
import type { TransactionResponse } from '../../features/transactions/model/transactionTypes'
import { ApiError } from '../../lib/api/apiError'
import TransactionForm from '../../features/transactions/components/TransactionForm'
import TransactionList from '../../features/transactions/components/TransactionList'
import DeleteTransactionDialog from '../../features/transactions/components/DeleteTransactionDialog'
import { fieldClassName } from '../../components/ui/forms/fieldClass'

function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [transactionToDelete, setTransactionToDelete] = useState<TransactionResponse | null>(null)
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
    return <p className="text-slate-400">Carregando transações...</p>
  }

  if (errorMessage) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
        {errorMessage}
      </div>
    )
  }

  function handleTransactionCreated() {
    if (page !== 0) {
      setPage(0)
    } else {
      setReloadKey((currentKey) => currentKey + 1)
    }
  }

  function handleTransactionDeleted(transactionId: string) {
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
      currentTransactions.filter((transaction) => transaction.id !== transactionId),
    )
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
      <div>
        <p className="text-sm font-medium text-emerald-400">Movimentações</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Transações</h1>
        <p className="mt-2 text-sm text-slate-400">Acompanhe suas receitas e despesas.</p>
      </div>

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
        <form
          onSubmit={handleFilterSubmit}
          className="mt-6 rounded-xl border border-(--color-border) bg-(--color-surface) p-4"
        >
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

      {transactionToDelete && (
        <DeleteTransactionDialog
          transaction={transactionToDelete}
          onDeleted={handleTransactionDeleted}
          onCancel={() => setTransactionToDelete(null)}
        />
      )}
    </section>
  )
}

export default TransactionsPage
