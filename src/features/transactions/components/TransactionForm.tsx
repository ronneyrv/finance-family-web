import { useEffect, useState, type SubmitEvent } from 'react'

import { categoriesApi } from '../../categories/api/categoriesApi'
import type { CategoryResponse, SubCategoryResponse } from '../../categories/model/categoryTypes'
import { transactionsApi } from '../api/transactionsApi'
import { paymentMethodLabels, paymentMethodsByType } from '../model/paymentMethods'
import type { PaymentMethod, TransactionResponse, TransactionType } from '../model/transactionTypes'

type TransactionFormProps = {
  transaction?: TransactionResponse
  onCreated?: (transaction: TransactionResponse) => void
  onUpdated?: (transaction: TransactionResponse) => void
  onCancelEdit?: () => void
}

function TransactionForm({
  transaction,
  onCreated,
  onUpdated,
  onCancelEdit,
}: TransactionFormProps) {
  const [description, setDescription] = useState(transaction?.description ?? '')
  const [amount, setAmount] = useState(transaction ? String(transaction.amount) : '')
  const [transactionDate, setTransactionDate] = useState(transaction?.transactionDate ?? '')
  const [type, setType] = useState<TransactionType>(transaction?.type ?? 'EXPENSE')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    transaction?.paymentMethod ?? 'PIX',
  )
  const [categoryId, setCategoryId] = useState(transaction?.categoryId ?? '')
  const [subCategoryId, setSubCategoryId] = useState(transaction?.subCategoryId ?? '')
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [subCategories, setSubCategories] = useState<SubCategoryResponse[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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

  function handleTypeChange(nextType: TransactionType) {
    setType(nextType)
    setCategoryId('')
    setSubCategoryId('')
    setSubCategories([])

    if (!paymentMethodsByType[nextType].includes(paymentMethod)) {
      setPaymentMethod('PIX')
    }
  }

  function handleCategoryChange(nextCategoryId: string) {
    setCategoryId(nextCategoryId)
    setSubCategoryId('')
    setSubCategories([])
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setIsSubmitting(true)
      setErrorMessage(null)

      const request = {
        description,
        amount: Number(amount),
        transactionDate,
        type,
        paymentMethod,
        categoryId,
        subCategoryId: subCategoryId || undefined,
      }

      if (transaction) {
        const updatedTransaction = await transactionsApi.update(transaction.id, request)

        onUpdated?.(updatedTransaction)
      } else {
        const createdTransaction = await transactionsApi.create(request)

        onCreated?.(createdTransaction)

        setDescription('')
        setAmount('')
        setTransactionDate('')
        setCategoryId('')
        setSubCategoryId('')
        setSubCategories([])
      }
    } catch {
      setErrorMessage('Não foi possível criar a transação.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-6"
    >
      <div>
        <h2 className="text-lg font-semibold">
          {transaction ? 'Editar transação' : 'Nova transação'}
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          {transaction
            ? 'Atualize os dados da movimentação.'
            : 'Registre uma nova receita ou despesa.'}
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="text-sm text-slate-300">Tipo</span>

          <select
            value={type}
            onChange={(event) => handleTypeChange(event.target.value as TransactionType)}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5"
          >
            <option value="EXPENSE">Despesa</option>
            <option value="INCOME">Receita</option>
          </select>
        </label>

        <label className="sm:col-span-2">
          <span className="text-sm text-slate-300">Forma de pagamento</span>

          <select
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5"
          >
            {paymentMethodsByType[type].map((method) => (
              <option key={method} value={method}>
                {paymentMethodLabels[method]}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="text-sm text-slate-300">Descrição</span>

          <input
            required
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5"
          />
        </label>

        <label>
          <span className="text-sm text-slate-300">Valor</span>

          <input
            required
            min="0.10"
            step="0.10"
            type="number"
            inputMode="decimal"
            placeholder="0,00"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </label>

        <label>
          <span className="text-sm text-slate-300">Data</span>

          <input
            required
            type="date"
            value={transactionDate}
            onChange={(event) => setTransactionDate(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5"
          />
        </label>

        <label>
          <span className="text-sm text-slate-300">Categoria</span>

          <select
            required
            value={categoryId}
            onChange={(event) => handleCategoryChange(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5"
          >
            <option value="">Selecione</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="sm:col-span-2">
          <span className="text-sm text-slate-300">Subcategoria</span>

          <select
            value={subCategoryId}
            disabled={!categoryId}
            onChange={(event) => setSubCategoryId(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Sem subcategoria</option>

            {subCategories.map((subCategory) => (
              <option key={subCategory.id} value={subCategory.id}>
                {subCategory.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {errorMessage && <p className="mt-4 text-sm text-red-400">{errorMessage}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-lg bg-emerald-500 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? 'Salvando...' : transaction ? 'Salvar alterações' : 'Salvar transação'}
      </button>

      {transaction && (
        <button
          type="button"
          onClick={onCancelEdit}
          disabled={isSubmitting}
          className="mt-3 w-full rounded-lg border border-slate-700 px-4 py-2.5 font-medium text-slate-300 transition hover:bg-slate-900 disabled:opacity-50 sm:mt-0 sm:ml-3 sm:w-auto"
        >
          Cancelar edição
        </button>
      )}
    </form>
  )
}

export default TransactionForm
