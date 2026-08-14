import { useEffect, useState, type SubmitEvent } from 'react'

import MoneyInput from '../../../components/ui/money/MoneyInput'
import CreditCardSelector from './form/CreditCardSelector'
import InstallmentSelector from './form/InstallmentSelector'
import PaymentMethodSelector from './form/PaymentMethodSelector'
import TransactionTypeSelector from './form/TransactionTypeSelector'
import FinancialAccountSelector from './form/FinancialAccountSelector'
import { Card } from '../../../components/ui/card'
import { purchasesApi } from '../../purchases/api/purchasesApi'
import { categoriesApi } from '../../categories/api/categoriesApi'
import { creditCardsApi } from '../../credit-cards/api/creditCardsApi'
import { fieldClassName } from '../../../components/ui/forms/fieldClass'
import { transactionsApi } from '../api/transactionsApi'
import { useNotification } from '../../../app/providers/useNotification'
import { parseCurrencyInput } from '../../../lib/parsers/currency'
import { getApiErrorMessage } from '../../../lib/api/getApiErrorMessage'
import { paymentMethodsByType } from '../model/paymentMethods'
import { financialAccountsApi } from '../../financial-accounts/api/financialAccountsApi'
import { formatCurrencyInputValue } from '../../../lib/formatters/currencyInput'
import type { FinancialAccountResponse } from '../../financial-accounts/model/financialAccountTypes'
import type { CreditCardResponse } from '../../credit-cards/model/creditCardTypes'
import type { CategoryResponse, SubCategoryResponse } from '../../categories/model/categoryTypes'
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
  const [amount, setAmount] = useState(
    transaction ? formatCurrencyInputValue(transaction.amount) : '',
  )
  const [transactionDate, setTransactionDate] = useState(transaction?.transactionDate ?? '')
  const [type, setType] = useState<TransactionType>(transaction?.type ?? 'EXPENSE')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    transaction?.paymentMethod ?? 'PIX',
  )
  const [accountId, setAccountId] = useState(transaction?.accountId ?? '')
  const [creditCardId, setCreditCardId] = useState('')
  const [installments, setInstallments] = useState('')

  const [categoryId, setCategoryId] = useState(transaction?.categoryId ?? '')
  const [subCategoryId, setSubCategoryId] = useState(transaction?.subCategoryId ?? '')

  const [financialAccounts, setFinancialAccounts] = useState<FinancialAccountResponse[]>([])
  const [creditCards, setCreditCards] = useState<CreditCardResponse[]>([])
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [subCategories, setSubCategories] = useState<SubCategoryResponse[]>([])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const { notify } = useNotification()

  useEffect(() => {
    let isCancelled = false

    async function loadPaymentSources() {
      try {
        const [financialAccountsResponse, creditCardsResponse] = await Promise.all([
          financialAccountsApi.findAll(),
          creditCardsApi.findAll(),
        ])

        if (!isCancelled) {
          setFinancialAccounts(financialAccountsResponse)
          setCreditCards(creditCardsResponse)
        }
      } catch (error) {
        if (!isCancelled) {
          notify.error(getApiErrorMessage(error, 'Não foi possível carregar as contas e cartões.'))
        }
      }
    }

    void loadPaymentSources()

    return () => {
      isCancelled = true
    }
  }, [notify])

  useEffect(() => {
    let isCancelled = false

    async function loadCategories() {
      try {
        const response = await categoriesApi.findAll(type)

        if (!isCancelled) {
          setCategories(response)

          if (type === 'INCOME') {
            const incomeCategory = response.find((category) => category.type === 'INCOME')

            if (incomeCategory) {
              setCategoryId(incomeCategory.id)
            }
          }
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
  }, [notify, categoryId])

  function handleTypeChange(nextType: TransactionType) {
    setType(nextType)
    setCategoryId('')
    setSubCategoryId('')
    setSubCategories([])

    if (!paymentMethodsByType[nextType].includes(paymentMethod)) {
      setPaymentMethod('PIX')
      setCreditCardId('')
      setInstallments('')
    }
  }

  function handlePaymentMethodChange(nextPaymentMethod: PaymentMethod) {
    setPaymentMethod(nextPaymentMethod)

    if (nextPaymentMethod === 'CASH') {
      const cashAccount = financialAccounts.find((account) => account.accountType === 'CASH')

      if (cashAccount) {
        setAccountId(cashAccount.id)
      }
    }

    if (nextPaymentMethod === 'CREDIT_CARD') {
      setAccountId('')
      setInstallments('1')
    } else {
      setCreditCardId('')
      setInstallments('')
    }
  }

  function handleCategoryChange(nextCategoryId: string) {
    setCategoryId(nextCategoryId)
    setSubCategoryId('')
    setSubCategories([])
  }

  function resetFormAfterCreation() {
    setDescription('')
    setAmount('')
    setTransactionDate('')
    setSubCategoryId('')

    if (type === 'INCOME') {
      const incomeCategory = categories.find((category) => category.type === 'INCOME')

      setCategoryId(incomeCategory?.id ?? '')
    } else {
      setCategoryId('')
      setSubCategories([])
    }
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setIsSubmitting(true)

      if (paymentMethod === 'CREDIT_CARD') {
        await purchasesApi.create(creditCardId, {
          description,
          totalAmount: parseCurrencyInput(amount),
          installments: Number(installments),
          purchaseDate: transactionDate,
          categoryId,
          subCategoryId: subCategoryId || undefined,
        })

        setDescription('')
        setAmount('')
        setTransactionDate('')
        setCreditCardId('')
        setInstallments('1')
        setAccountId('')
        setSubCategoryId('')

        const expenseCategory = categories.find((category) => category.type === 'EXPENSE')
        setCategoryId(expenseCategory?.id ?? '')

        notify.success('Compra no cartão registrada com sucesso.')

        return
      }

      const request = {
        description,
        amount: parseCurrencyInput(amount),
        transactionDate,
        type,
        paymentMethod,
        accountId,
        categoryId,
        subCategoryId: subCategoryId || undefined,
      }

      if (transaction) {
        const updatedTransaction = await transactionsApi.update(transaction.id, request)

        onUpdated?.(updatedTransaction)
        notify.success('Transação atualizada com sucesso.')
      } else {
        const createdTransaction = await transactionsApi.create(request)

        onCreated?.(createdTransaction)

        resetFormAfterCreation()

        notify.success('Transação criada com sucesso.')
      }
    } catch (error) {
      notify.error(
        getApiErrorMessage(
          error,
          paymentMethod === 'CREDIT_CARD'
            ? 'Não foi possível registrar a compra no cartão.'
            : transaction
              ? 'Não foi possível atualizar a transação.'
              : 'Não foi possível criar a transação.',
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableAccounts =
    paymentMethod === 'CASH'
      ? financialAccounts.filter((account) => account.accountType === 'CASH')
      : financialAccounts.filter((account) => account.accountType !== 'CASH')

  return (
    <Card className="mt-8">
      <form onSubmit={handleSubmit}>
        <div>
          <h2 className="text-lg font-semibold">
            {transaction ? 'Editar transação' : 'Nova transação'}
          </h2>
          <p className="mt-1 text-sm text-(--color-text-muted)">
            {transaction
              ? 'Atualize os dados da movimentação.'
              : 'Registre uma nova receita ou despesa.'}
          </p>
        </div>

        <div className="mt-6 space-y-6">
          <div className="mt-6 grid gap-4 sm:grid-cols-[2fr_1fr_1fr_2fr]">
            <label className="sm:col-span-1">
              <span className="text-sm text-(--color-text)">Descrição</span>

              <input
                required
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className={fieldClassName}
              />
            </label>

            <label className="sm:col-span-1">
              <span className="text-sm text-(--color-text)">Valor</span>

              <MoneyInput required placeholder="0,00" value={amount} onChange={setAmount} />
            </label>

            <label className="sm:col-span-1">
              <span className="text-sm text-(--color-text)">Data</span>

              <input
                required
                type="date"
                value={transactionDate}
                onChange={(event) => setTransactionDate(event.target.value)}
                className={fieldClassName}
              />
            </label>

            <div className="sm:col-span-1">
              <TransactionTypeSelector value={type} onChange={handleTypeChange} />
            </div>
          </div>

          <div>
            <PaymentMethodSelector
              methods={paymentMethodsByType[type]}
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
            />
          </div>

          {paymentMethod === 'CREDIT_CARD' ? (
            <div className="grid gap-4 sm:grid-cols-4">
              <CreditCardSelector
                creditCards={creditCards}
                value={creditCardId}
                onChange={setCreditCardId}
              />

              <InstallmentSelector value={installments} onChange={setInstallments} />

              <label>
                <span className="text-sm text-(--color-text)">Categoria</span>

                <select
                  required
                  value={categoryId}
                  onChange={(event) => handleCategoryChange(event.target.value)}
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
                <span className="text-sm text-(--color-text)">Subcategoria</span>

                <select
                  value={subCategoryId}
                  disabled={!categoryId}
                  onChange={(event) => setSubCategoryId(event.target.value)}
                  className={fieldClassName}
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
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              <FinancialAccountSelector
                accounts={availableAccounts}
                value={accountId}
                onChange={setAccountId}
              />

              <label>
                <span className="text-sm text-(--color-text)">Categoria</span>

                <select
                  required
                  value={categoryId}
                  onChange={(event) => handleCategoryChange(event.target.value)}
                  disabled={type === 'INCOME'}
                  className={`${fieldClassName} ${
                    type === 'INCOME' ? 'cursor-not-allowed opacity-70' : ''
                  }`}
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
                <span className="text-sm text-(--color-text)">Subcategoria</span>

                <select
                  value={subCategoryId}
                  disabled={!categoryId}
                  onChange={(event) => setSubCategoryId(event.target.value)}
                  className={fieldClassName}
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
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-(--color-border) pt-4 sm:flex-row">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isSubmitting ? 'Salvando...' : transaction ? 'Salvar alterações' : 'Salvar transação'}
          </button>

          {transaction && (
            <button
              type="button"
              onClick={onCancelEdit}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-(--color-border) px-4 py-2.5 font-medium text-(--color-text) transition hover:bg-(--color-surface-hover) disabled:opacity-50 sm:w-auto"
            >
              Cancelar edição
            </button>
          )}
        </div>
      </form>
    </Card>
  )
}

export default TransactionForm
