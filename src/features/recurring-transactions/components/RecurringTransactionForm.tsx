import { useEffect, useState } from 'react'

import { categoriesApi } from '../../categories/api/categoriesApi'
import type { CategoryResponse, SubCategoryResponse } from '../../categories/model/categoryTypes'
import { fieldClassName } from '../../../components/ui/forms/fieldClass'
import type { PaymentMethod, TransactionType } from '../../transactions/model/transactionTypes'
import type {
  RecurringTransactionRequest,
  RecurringTransactionResponse,
} from '../model/recurringTransactionTypes'
import { ApiError } from '../../../lib/api/apiError'
import { recurringTransactionsApi } from '../api/recurringTransactionsApi'

type RecurringTransactionFormProps = {
  recurringTransaction?: RecurringTransactionResponse

  onCreated?: (transaction: RecurringTransactionResponse) => void

  onUpdated?: (transaction: RecurringTransactionResponse) => void

  onCancelEdit?: () => void
}

function RecurringTransactionForm({
  recurringTransaction,
  onCreated,
  onUpdated,
  onCancelEdit,
}: RecurringTransactionFormProps) {
  const [description, setDescription] = useState(recurringTransaction?.description ?? '')

  const [amount, setAmount] = useState(
    recurringTransaction ? String(recurringTransaction.amount) : '',
  )

  const [type, setType] = useState<TransactionType>(recurringTransaction?.type ?? 'EXPENSE')

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    recurringTransaction?.paymentMethod ?? 'PIX',
  )

  const [dayOfMonth, setDayOfMonth] = useState(
    recurringTransaction ? String(recurringTransaction.dayOfMonth) : '',
  )

  const [startDate, setStartDate] = useState(recurringTransaction?.startDate ?? '')

  const [endDate, setEndDate] = useState(recurringTransaction?.endDate ?? '')

  const [categoryId, setCategoryId] = useState(recurringTransaction?.categoryId ?? '')

  const [subCategoryId, setSubCategoryId] = useState(recurringTransaction?.subCategoryId ?? '')

  const [categories, setCategories] = useState<CategoryResponse[]>([])

  const [subCategories, setSubCategories] = useState<SubCategoryResponse[]>([])

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)

  function resetForm() {
    setDescription('')
    setAmount('')
    setType('EXPENSE')
    setPaymentMethod('PIX')
    setDayOfMonth('')
    setStartDate('')
    setEndDate('')
    setCategoryId('')
    setSubCategoryId('')
  }

  useEffect(() => {
    if (!recurringTransaction) {
      return
    }

    setDescription(recurringTransaction.description)
    setAmount(String(recurringTransaction.amount))
    setType(recurringTransaction.type)
    setPaymentMethod(recurringTransaction.paymentMethod)
    setDayOfMonth(String(recurringTransaction.dayOfMonth))
    setStartDate(recurringTransaction.startDate)
    setEndDate(recurringTransaction.endDate ?? '')
    setCategoryId(recurringTransaction.categoryId)
    setSubCategoryId(recurringTransaction.subCategoryId ?? '')
  }, [recurringTransaction])

  useEffect(() => {
    let isCancelled = false

    async function loadCategories() {
      try {
        const response = await categoriesApi.findAll(type)

        if (!isCancelled) {
          setCategories(response)
        }
      } catch {
        if (!isCancelled) {
          setErrorMessage('Não foi possível carregar as categorias.')
        }
      }
    }

    void loadCategories()

    return () => {
      isCancelled = true
    }
  }, [type])

  useEffect(() => {
    if (!categoryId) {
      return
    }

    let isCancelled = false

    async function loadSubCategories() {
      try {
        const response = await categoriesApi.findSubCategories(categoryId)

        if (!isCancelled) {
          setSubCategories(response)
        }
      } catch {
        if (!isCancelled) {
          setErrorMessage('Não foi possível carregar as subcategorias.')
        }
      }
    }

    void loadSubCategories()

    return () => {
      isCancelled = true
    }
  }, [categoryId])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setIsSubmitting(true)
      setErrorMessage(null)

      const request: RecurringTransactionRequest = {
        description: description.trim(),
        amount: Number(amount),
        type,
        paymentMethod,
        dayOfMonth: Number(dayOfMonth),
        startDate,
        endDate: endDate || undefined,
        categoryId,
        subCategoryId: subCategoryId || undefined,
      }

      if (recurringTransaction) {
        const updated = await recurringTransactionsApi.update(recurringTransaction.id, request)

        onUpdated?.(updated)
      } else {
        const created = await recurringTransactionsApi.create(request)

        onCreated?.(created)

        resetForm()
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage(
          recurringTransaction
            ? 'Não foi possível atualizar a recorrência.'
            : 'Não foi possível cadastrar a recorrência.',
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-xl border border-(--color-border) bg-(--color-surface) p-4"
    >
      <div>
        <h2 className="text-lg font-semibold">
          {recurringTransaction ? 'Editar recorrência' : 'Nova recorrência'}
        </h2>

        <p className="mt-1 text-sm text-(--color-text-muted)">
          Configure uma receita ou despesa recorrente.
        </p>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="text-sm">Descrição</span>

          <input
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={fieldClassName}
          />
        </label>

        <label>
          <span className="text-sm">Valor</span>

          <input
            required
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`${fieldClassName} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
          />
        </label>

        <label>
          <span className="text-sm">Tipo</span>

          <select
            value={type}
            onChange={(e) => setType(e.target.value as TransactionType)}
            className={fieldClassName}
          >
            <option value="EXPENSE">Despesa</option>
            <option value="INCOME">Receita</option>
          </select>
        </label>

        <label>
          <span className="text-sm">Pagamento</span>

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            className={fieldClassName}
          >
            <option value="PIX">PIX</option>
            <option value="CASH">Dinheiro</option>
            <option value="DEBIT_CARD">Débito</option>
            <option value="BANK_TRANSFER">Transferência</option>
          </select>
        </label>

        <label>
          <span className="text-sm">Dia do mês</span>

          <input
            required
            type="number"
            min="1"
            max="31"
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(e.target.value)}
            className={`${fieldClassName} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
          />
        </label>

        <label>
          <span className="text-sm">Início</span>

          <input
            required
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={fieldClassName}
          />
        </label>

        <label>
          <span className="text-sm">Fim (opcional)</span>

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={fieldClassName}
          />
        </label>

        <label>
          <span className="text-sm">Categoria</span>

          <select
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={fieldClassName}
          >
            <option value="">Selecione</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="text-sm">Subcategoria</span>

          <select
            value={subCategoryId}
            onChange={(e) => setSubCategoryId(e.target.value)}
            className={fieldClassName}
          >
            <option value="">Nenhuma</option>

            {subCategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      {errorMessage && <p className="mt-4 text-sm text-red-400">{errorMessage}</p>}

      <div className="mt-6 flex flex-col gap-3 border-t border-(--color-border) pt-4 sm:flex-row">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting
            ? 'Salvando...'
            : recurringTransaction
              ? 'Salvar alterações'
              : 'Cadastrar recorrência'}
        </button>

        {recurringTransaction && (
          <button
            type="button"
            onClick={() => {
              resetForm()
              onCancelEdit?.()
            }}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-(--color-border) px-4 py-2.5 font-medium text-(--color-text) transition hover:bg-(--color-surface-hover) disabled:opacity-50 sm:w-auto"
          >
            Cancelar edição
          </button>
        )}
      </div>
    </form>
  )
}

export default RecurringTransactionForm
