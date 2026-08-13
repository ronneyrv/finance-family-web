import { useEffect, useState } from 'react'

import MoneyInput from '../../../components/ui/money/MoneyInput'
import { Card } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { categoriesApi } from '../../categories/api/categoriesApi'
import { fieldClassName } from '../../../components/ui/forms/fieldClass'
import { useNotification } from '../../../app/providers/useNotification'
import { parseCurrencyInput } from '../../../lib/parsers/currency'
import { getApiErrorMessage } from '../../../lib/api/getApiErrorMessage'
import { recurringTransactionsApi } from '../api/recurringTransactionsApi'
import { formatCurrencyInputValue } from '../../../lib/formatters/currencyInput'
import type { PaymentMethod, TransactionType } from '../../transactions/model/transactionTypes'
import type { CategoryResponse, SubCategoryResponse } from '../../categories/model/categoryTypes'
import type {
  RecurringTransactionRequest,
  RecurringTransactionResponse,
} from '../model/recurringTransactionTypes'

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
    recurringTransaction ? formatCurrencyInputValue(recurringTransaction.amount) : '',
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

  const [isSubmitting, setIsSubmitting] = useState(false)

  const { notify } = useNotification()

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
    setAmount(formatCurrencyInputValue(recurringTransaction.amount))
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
      } catch (error) {
        if (!isCancelled) {
          notify.error(getApiErrorMessage(error, 'Não foi possível carregar as categorias.'))
        }
      }
    }

    void loadCategories()

    return () => {
      isCancelled = true
    }
  }, [notify, type])

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
      } catch (error) {
        if (!isCancelled) {
          notify.error(getApiErrorMessage(error, 'Não foi possível carregar as subcategorias.'))
        }
      }
    }

    void loadSubCategories()

    return () => {
      isCancelled = true
    }
  }, [categoryId, notify])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setIsSubmitting(true)

      const request: RecurringTransactionRequest = {
        description: description.trim(),
        amount: parseCurrencyInput(amount),
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

        notify.success('Recorrência atualizada com sucesso.')
      } else {
        const created = await recurringTransactionsApi.create(request)

        onCreated?.(created)

        resetForm()

        notify.success('Recorrência cadastrada com sucesso.')
      }
    } catch (error) {
      notify.error(
        getApiErrorMessage(
          error,
          recurringTransaction
            ? 'Não foi possível atualizar a recorrência.'
            : 'Não foi possível cadastrar a recorrência.',
        ),
      )
    }
  }

  return (
    <Card className="mt-8">
      <form onSubmit={handleSubmit}>
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

            <MoneyInput required placeholder="0,00" value={amount} onChange={setAmount} />
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

        <div className="mt-6 flex flex-col gap-3 border-t border-(--color-border) pt-4 sm:flex-row">
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting
              ? 'Salvando...'
              : recurringTransaction
                ? 'Salvar alterações'
                : 'Cadastrar recorrência'}
          </Button>

          {recurringTransaction && (
            <Button
              type="button"
              variant="secondary"
              disabled={isSubmitting}
              onClick={() => {
                resetForm()
                onCancelEdit?.()
              }}
              className="w-full sm:w-auto"
            >
              Cancelar edição
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}

export default RecurringTransactionForm
