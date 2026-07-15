import { useEffect, useState, type SubmitEvent } from 'react'

import { categoriesApi } from '../../categories/api/categoriesApi'
import type { CategoryResponse, SubCategoryResponse } from '../../categories/model/categoryTypes'
import { transactionsApi } from '../api/transactionsApi'
import { paymentMethodsByType } from '../model/paymentMethods'
import type { PaymentMethod, TransactionResponse, TransactionType } from '../model/transactionTypes'
import { financialAccountsApi } from '../../financial-accounts/api/financialAccountsApi'
import type { FinancialAccountResponse } from '../../financial-accounts/model/financialAccountTypes'
import { creditCardsApi } from '../../credit-cards/api/creditCardsApi'
import type { CreditCardResponse } from '../../credit-cards/model/creditCardTypes'
import { purchasesApi } from '../../purchases/api/purchasesApi'
import TransactionTypeSelector from './form/TransactionTypeSelector'
import PaymentMethodSelector from './form/PaymentMethodSelector'
import InstallmentSelector from './form/InstallmentSelector'
import CreditCardSelector from './form/CreditCardSelector'
import FinancialAccountSelector from './form/FinancialAccountSelector'
import { fieldClassName } from '../../../components/ui/forms/fieldClass'
import { Card } from '../../../components/ui/card'

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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
      } catch {
        if (!isCancelled) {
          setErrorMessage('Não foi possível carregar as contas e cartões.')
        }
      }
    }

    void loadPaymentSources()

    return () => {
      isCancelled = true
    }
  }, [])

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
      setCategoryId('')
      setSubCategoryId('')
      setSubCategories([])
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

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setIsSubmitting(true)
      setErrorMessage(null)

      if (paymentMethod === 'CREDIT_CARD') {
        await purchasesApi.create(creditCardId, {
          description,
          totalAmount: Number(amount),
          installments: Number(installments),
          purchaseDate: transactionDate,
        })

        setDescription('')
        setAmount('')
        setTransactionDate('')
        setCreditCardId('')
        setInstallments('')
        setCategoryId('')
        setSubCategoryId('')
        setSubCategories([])

        return
      }

      const request = {
        description,
        amount: Number(amount),
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
      setErrorMessage(
        paymentMethod === 'CREDIT_CARD'
          ? 'Não foi possível registrar a compra no cartão.'
          : transaction
            ? 'Não foi possível atualizar a transação.'
            : 'Não foi possível criar a transação.',
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

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <TransactionTypeSelector value={type} onChange={handleTypeChange} />

          <PaymentMethodSelector
            methods={paymentMethodsByType[type]}
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
          />

          {paymentMethod === 'CREDIT_CARD' ? (
            <>
              <CreditCardSelector
                creditCards={creditCards}
                value={creditCardId}
                onChange={setCreditCardId}
              />
              <InstallmentSelector value={installments} onChange={setInstallments} />
            </>
          ) : (
            <FinancialAccountSelector
              accounts={availableAccounts}
              value={accountId}
              onChange={setAccountId}
            />
          )}

          <label>
            <span className="text-sm text-(--color-text)">Descrição</span>

            <input
              required
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className={fieldClassName}
            />
          </label>

          <label>
            <span className="text-sm text-(--color-text)">Valor</span>

            <input
              required
              min="0.10"
              step="0.10"
              type="number"
              inputMode="decimal"
              placeholder="0,00"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className={`${fieldClassName} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
            />
          </label>

          <label>
            <span className="text-sm text-(--color-text)">Data</span>

            <input
              required
              type="date"
              value={transactionDate}
              onChange={(event) => setTransactionDate(event.target.value)}
              className={fieldClassName}
            />
          </label>

          {paymentMethod !== 'CREDIT_CARD' && (
            <>
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
            </>
          )}
        </div>

        {errorMessage && <p className="mt-4 text-sm text-red-400">{errorMessage}</p>}

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
