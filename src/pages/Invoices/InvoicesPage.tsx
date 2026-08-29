import { useCallback, useEffect, useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

import { Alert } from '../../components/ui/alert'
import { Loading } from '../../components/ui/loading'
import { PageHeader } from '../../components/ui/page'
import { invoicesApi } from '../../features/invoices/api/invoicesApi'
import { purchasesApi } from '../../features/purchases/api/purchasesApi'
import { ConfirmDialog } from '../../components/ui/dialog'
import { categoriesApi } from '../../features/categories/api/categoriesApi'
import { fieldClassName } from '../../components/ui/forms/fieldClass'
import { creditCardsApi } from '../../features/credit-cards/api/creditCardsApi'
import { useNotification } from '../../app/providers/useNotification'
import { getApiErrorMessage } from '../../lib/api/getApiErrorMessage'
import { financialAccountsApi } from '../../features/financial-accounts/api/financialAccountsApi'
import type { CategoryResponse } from '../../features/categories/model/categoryTypes'
import type { CreditCardResponse } from '../../features/credit-cards/model/creditCardTypes'
import type {
  InvoiceResponse,
  PendingPurchaseResponse,
} from '../../features/invoices/model/invoiceTypes'
import type { FinancialAccountResponse } from '../../features/financial-accounts/model/financialAccountTypes'
import InvoicePaymentForm from '../../features/invoices/components/InvoicePaymentForm'
import InvoiceFilter from '../../features/invoices/components/InvoiceFilter'
import InvoiceInstallmentList from '../../features/invoices/components/InvoiceInstallmentList'
import InvoiceSummary from '../../features/invoices/components/InvoiceSummary'
import PendingPurchaseList from '../../features/invoices/components/PendingPurchaseList'

function InvoicesPage() {
  const [creditCards, setCreditCards] = useState<CreditCardResponse[]>([])
  const [invoice, setInvoice] = useState<InvoiceResponse | null>(null)
  const [categories, setCategories] = useState<CategoryResponse[]>([])

  const [isLoadingCards, setIsLoadingCards] = useState(true)
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false)

  const [cardsErrorMessage, setCardsErrorMessage] = useState<string | null>(null)
  const [invoiceErrorMessage, setInvoiceErrorMessage] = useState<string | null>(null)

  const [financialAccounts, setFinancialAccounts] = useState<FinancialAccountResponse[]>([])
  const [selectedCreditCardId, setSelectedCreditCardId] = useState<string | null>(null)
  const [accountsErrorMessage, setAccountsErrorMessage] = useState<string | null>(null)

  const [pendingPurchases, setPendingPurchases] = useState<PendingPurchaseResponse[]>([])
  const [isLoadingPendingPurchases, setIsLoadingPendingPurchases] = useState(true)
  const [pendingPurchasesErrorMessage, setPendingPurchasesErrorMessage] = useState<string | null>(
    null,
  )
  const [showPendingPurchases, setShowPendingPurchases] = useState(false)

  const [showPendingPurchaseFilters, setShowPendingPurchaseFilters] = useState(false)

  const [pendingPurchaseStartDate, setPendingPurchaseStartDate] = useState('')
  const [pendingPurchaseEndDate, setPendingPurchaseEndDate] = useState('')
  const [pendingPurchaseCategoryId, setPendingPurchaseCategoryId] = useState('')
  const [pendingPurchaseCreditCardId, setPendingPurchaseCreditCardId] = useState('')
  const [pendingPurchaseDescription, setPendingPurchaseDescription] = useState('')

  const [appliedPendingPurchaseStartDate, setAppliedPendingPurchaseStartDate] = useState('')
  const [appliedPendingPurchaseEndDate, setAppliedPendingPurchaseEndDate] = useState('')
  const [appliedPendingPurchaseCategoryId, setAppliedPendingPurchaseCategoryId] = useState('')
  const [appliedPendingPurchaseCreditCardId, setAppliedPendingPurchaseCreditCardId] = useState('')
  const [appliedPendingPurchaseDescription, setAppliedPendingPurchaseDescription] = useState('')

  const [showInvoiceItemFilters, setShowInvoiceItemFilters] = useState(false)

  const [invoiceItemStartDate, setInvoiceItemStartDate] = useState('')
  const [invoiceItemEndDate, setInvoiceItemEndDate] = useState('')
  const [invoiceItemDescription, setInvoiceItemDescription] = useState('')

  const [appliedInvoiceItemStartDate, setAppliedInvoiceItemStartDate] = useState('')
  const [appliedInvoiceItemEndDate, setAppliedInvoiceItemEndDate] = useState('')
  const [appliedInvoiceItemDescription, setAppliedInvoiceItemDescription] = useState('')

  const [purchaseToDelete, setPurchaseToDelete] = useState<PendingPurchaseResponse | null>(null)
  const [isDeletingPurchase, setIsDeletingPurchase] = useState(false)
  const [isUpdatingPurchase, setIsUpdatingPurchase] = useState(false)

  const { notify } = useNotification()

  useEffect(() => {
    let isCancelled = false

    async function loadCreditCards() {
      try {
        setCardsErrorMessage(null)

        const response = await creditCardsApi.findAll()

        if (!isCancelled) {
          setCreditCards(response)
        }
      } catch (error) {
        if (isCancelled) {
          return
        }

        setCardsErrorMessage(getApiErrorMessage(error, 'Não foi possível carregar os cartões.'))
      } finally {
        if (!isCancelled) {
          setIsLoadingCards(false)
        }
      }
    }

    void loadCreditCards()

    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    let isCancelled = false

    async function loadCategories() {
      try {
        const response = await categoriesApi.findAll('EXPENSE')

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
  }, [notify])

  const loadPendingPurchases = useCallback(async () => {
    try {
      setPendingPurchasesErrorMessage(null)

      const response = await invoicesApi.findPendingPurchases()

      setPendingPurchases(response)
    } catch (error) {
      setPendingPurchasesErrorMessage(
        getApiErrorMessage(error, 'Não foi possível carregar as compras pendentes.'),
      )
    } finally {
      setIsLoadingPendingPurchases(false)
    }
  }, [])

  async function handleTogglePendingPurchases() {
    if (showPendingPurchases) {
      setShowPendingPurchases(false)
      return
    }

    setShowPendingPurchases(true)
    await loadPendingPurchases()
  }

  function handleBackToPendingPurchases() {
    setInvoice(null)
    setSelectedCreditCardId(null)
    setShowPendingPurchases(true)

    setShowInvoiceItemFilters(false)

    setInvoiceItemStartDate('')
    setInvoiceItemEndDate('')
    setInvoiceItemDescription('')

    setAppliedInvoiceItemStartDate('')
    setAppliedInvoiceItemEndDate('')
    setAppliedInvoiceItemDescription('')
  }

  function getFilteredPendingPurchases() {
    return pendingPurchases.filter((purchase) => {
      const matchesStartDate =
        !appliedPendingPurchaseStartDate || purchase.purchaseDate >= appliedPendingPurchaseStartDate

      const matchesEndDate =
        !appliedPendingPurchaseEndDate || purchase.purchaseDate <= appliedPendingPurchaseEndDate

      const matchesCategory =
        !appliedPendingPurchaseCategoryId ||
        purchase.categoryId === appliedPendingPurchaseCategoryId

      const matchesCreditCard =
        !appliedPendingPurchaseCreditCardId ||
        purchase.creditCardId === appliedPendingPurchaseCreditCardId

      const matchesDescription =
        !appliedPendingPurchaseDescription ||
        purchase.description.toLowerCase().includes(appliedPendingPurchaseDescription.toLowerCase())

      return (
        matchesStartDate &&
        matchesEndDate &&
        matchesCategory &&
        matchesCreditCard &&
        matchesDescription
      )
    })
  }

  function handlePendingPurchaseFilterSubmit() {
    setAppliedPendingPurchaseStartDate(pendingPurchaseStartDate)
    setAppliedPendingPurchaseEndDate(pendingPurchaseEndDate)
    setAppliedPendingPurchaseCategoryId(pendingPurchaseCategoryId)
    setAppliedPendingPurchaseCreditCardId(pendingPurchaseCreditCardId)
    setAppliedPendingPurchaseDescription(pendingPurchaseDescription)
  }

  function handleClearPendingPurchaseFilters() {
    setPendingPurchaseStartDate('')
    setPendingPurchaseEndDate('')
    setPendingPurchaseCategoryId('')
    setPendingPurchaseCreditCardId('')
    setPendingPurchaseDescription('')

    setAppliedPendingPurchaseStartDate('')
    setAppliedPendingPurchaseEndDate('')
    setAppliedPendingPurchaseCategoryId('')
    setAppliedPendingPurchaseCreditCardId('')
    setAppliedPendingPurchaseDescription('')
  }

  function getFilteredInvoiceInstallments() {
    if (!invoice) {
      return []
    }

    return invoice.installments.filter((installment) => {
      const matchesStartDate =
        !appliedInvoiceItemStartDate || installment.purchaseDate >= appliedInvoiceItemStartDate

      const matchesEndDate =
        !appliedInvoiceItemEndDate || installment.purchaseDate <= appliedInvoiceItemEndDate

      const matchesDescription =
        !appliedInvoiceItemDescription ||
        installment.description.toLowerCase().includes(appliedInvoiceItemDescription.toLowerCase())

      return matchesStartDate && matchesEndDate && matchesDescription
    })
  }

  function handleInvoiceItemFilterSubmit() {
    setAppliedInvoiceItemStartDate(invoiceItemStartDate)
    setAppliedInvoiceItemEndDate(invoiceItemEndDate)
    setAppliedInvoiceItemDescription(invoiceItemDescription)
  }

  function handleClearInvoiceItemFilters() {
    setInvoiceItemStartDate('')
    setInvoiceItemEndDate('')
    setInvoiceItemDescription('')

    setAppliedInvoiceItemStartDate('')
    setAppliedInvoiceItemEndDate('')
    setAppliedInvoiceItemDescription('')
  }

  async function handleDeletePurchase() {
    if (!purchaseToDelete) {
      return
    }

    try {
      setIsDeletingPurchase(true)

      await invoicesApi.deletePurchase(purchaseToDelete.id)

      setPendingPurchases((currentPurchases) =>
        currentPurchases.filter((purchase) => purchase.id !== purchaseToDelete.id),
      )

      setPurchaseToDelete(null)

      notify.success('Compra excluída com sucesso.')
    } catch (error) {
      notify.error(getApiErrorMessage(error, 'Não foi possível excluir a compra.'))
    } finally {
      setIsDeletingPurchase(false)
    }
  }

  async function handleCategoryChange(
    purchase: PendingPurchaseResponse,
    categoryId: string | null,
    subCategoryId: string | null,
  ) {
    try {
      setIsUpdatingPurchase(true)

      await purchasesApi.updateCategory(purchase.id, {
        categoryId,
        subCategoryId,
      })

      await loadPendingPurchases()

      notify.success('Categoria da compra atualizada com sucesso.')
    } catch (error) {
      notify.error(getApiErrorMessage(error, 'Não foi possível atualizar a categoria da compra.'))
    } finally {
      setIsUpdatingPurchase(false)
    }
  }

  async function handleSearch(creditCardId: string, month: number, year: number) {
    try {
      setIsLoadingInvoice(true)
      setInvoiceErrorMessage(null)
      setAccountsErrorMessage(null)
      setInvoice(null)
      setSelectedCreditCardId(null)

      const response = await invoicesApi.findByPeriod(creditCardId, month, year)

      setInvoice(response)
      setSelectedCreditCardId(creditCardId)

      setShowInvoiceItemFilters(false)

      setInvoiceItemStartDate('')
      setInvoiceItemEndDate('')
      setInvoiceItemDescription('')

      setAppliedInvoiceItemStartDate('')
      setAppliedInvoiceItemEndDate('')
      setAppliedInvoiceItemDescription('')

      const isPaid = response.installments.every((installment) => installment.paid)

      if (!isPaid) {
        await loadFinancialAccounts()
      }
    } catch (error) {
      setInvoiceErrorMessage(getApiErrorMessage(error, 'Não foi possível carregar a fatura.'))
    } finally {
      setIsLoadingInvoice(false)
    }
  }

  async function loadFinancialAccounts() {
    try {
      setAccountsErrorMessage(null)

      const response = await financialAccountsApi.findAll()

      setFinancialAccounts(response)
    } catch (error) {
      setAccountsErrorMessage(
        getApiErrorMessage(error, 'Não foi possível carregar as contas financeiras.'),
      )
    }
  }

  async function handleInvoicePaid() {
    if (!selectedCreditCardId || !invoice) {
      return
    }

    const updatedInvoice = await invoicesApi.findByPeriod(
      selectedCreditCardId,
      invoice.month,
      invoice.year,
    )

    setInvoice(updatedInvoice)
  }

  const filteredPendingPurchases = getFilteredPendingPurchases()
  const hasActivePendingPurchaseFilters =
    Boolean(appliedPendingPurchaseStartDate) ||
    Boolean(appliedPendingPurchaseEndDate) ||
    Boolean(appliedPendingPurchaseCategoryId) ||
    Boolean(appliedPendingPurchaseCreditCardId) ||
    Boolean(appliedPendingPurchaseDescription)

  return (
    <section>
      <PageHeader
        section="Cartões e faturas"
        title="Faturas"
        description="Consulte os lançamentos e acompanhe a situação das suas faturas."
      />

      {isLoadingCards && <Loading className="mt-8" message="Carregando cartões..." />}

      {cardsErrorMessage && <Alert className="mt-8">{cardsErrorMessage}</Alert>}

      {!isLoadingCards && !cardsErrorMessage && (
        <InvoiceFilter
          creditCards={creditCards}
          isLoading={isLoadingInvoice}
          onSearch={handleSearch}
        />
      )}

      {!invoice && (
        <>
          <button
            type="button"
            onClick={() => void handleTogglePendingPurchases()}
            className="mt-8 flex w-full items-center justify-between rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-sm font-medium text-(--color-text) transition hover:bg-(--color-surface-hover)"
          >
            <span>Últimas compras</span>

            {showPendingPurchases ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>

          {showPendingPurchases && (
            <>
              {!isLoadingPendingPurchases && !pendingPurchasesErrorMessage && (
                <section className="mt-6 rounded-xl border border-(--color-border) bg-(--color-surface) p-4">
                  <button
                    type="button"
                    onClick={() => setShowPendingPurchaseFilters((current) => !current)}
                    className="flex w-full items-center justify-between text-left"
                  >
                    <span className="text-sm font-semibold">Filtros</span>

                    {showPendingPurchaseFilters ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                  </button>

                  {showPendingPurchaseFilters && (
                    <form
                      onSubmit={(event) => {
                        event.preventDefault()
                        handlePendingPurchaseFilterSubmit()
                      }}
                      className="mt-4"
                    >
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                        <label>
                          <span className="text-sm text-(--color-text)">Descrição</span>

                          <input
                            type="text"
                            value={pendingPurchaseDescription}
                            onChange={(event) => setPendingPurchaseDescription(event.target.value)}
                            placeholder="Ex.: mercado"
                            className={fieldClassName}
                          />
                        </label>

                        <label>
                          <span className="text-sm text-(--color-text)">Categoria</span>

                          <select
                            value={pendingPurchaseCategoryId}
                            onChange={(event) => setPendingPurchaseCategoryId(event.target.value)}
                            className={fieldClassName}
                          >
                            <option value="">Todas as categorias</option>

                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label>
                          <span className="text-sm text-(--color-text)">Cartão</span>

                          <select
                            value={pendingPurchaseCreditCardId}
                            onChange={(event) => setPendingPurchaseCreditCardId(event.target.value)}
                            className={fieldClassName}
                          >
                            <option value="">Todos os cartões</option>

                            {creditCards.map((creditCard) => (
                              <option key={creditCard.id} value={creditCard.id}>
                                {creditCard.name}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label>
                          <span className="text-sm text-(--color-text)">Data inicial</span>

                          <input
                            type="date"
                            value={pendingPurchaseStartDate}
                            onChange={(event) => setPendingPurchaseStartDate(event.target.value)}
                            className={fieldClassName}
                          />
                        </label>

                        <label>
                          <span className="text-sm text-(--color-text)">Data final</span>

                          <input
                            type="date"
                            value={pendingPurchaseEndDate}
                            onChange={(event) => setPendingPurchaseEndDate(event.target.value)}
                            className={fieldClassName}
                          />
                        </label>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          type="submit"
                          className="rounded-lg bg-emerald-500 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-emerald-400"
                        >
                          Filtrar
                        </button>

                        <button
                          type="button"
                          onClick={handleClearPendingPurchaseFilters}
                          className="rounded-lg border border-(--color-border) px-4 py-2.5 text-sm font-medium text-(--color-text) transition hover:bg-(--color-surface-hover)"
                        >
                          Limpar filtros
                        </button>
                      </div>
                    </form>
                  )}
                </section>
              )}

              {isLoadingPendingPurchases && (
                <Loading className="mt-8" message="Carregando compras pendentes..." />
              )}

              {pendingPurchasesErrorMessage && (
                <Alert className="mt-8">{pendingPurchasesErrorMessage}</Alert>
              )}

              {!isLoadingPendingPurchases && !pendingPurchasesErrorMessage && (
                <PendingPurchaseList
                  purchases={filteredPendingPurchases}
                  hasActiveFilters={hasActivePendingPurchaseFilters}
                  isUpdating={isUpdatingPurchase}
                  onDelete={setPurchaseToDelete}
                  onCategoryChange={handleCategoryChange}
                />
              )}
            </>
          )}
        </>
      )}

      {invoiceErrorMessage && <Alert className="mt-8">{invoiceErrorMessage}</Alert>}

      {invoice && (
        <>
          <button
            type="button"
            onClick={handleBackToPendingPurchases}
            className="mt-8 flex items-center gap-2 rounded-lg border border-(--color-border) bg-(--color-surface) px-4 py-2.5 text-sm font-medium text-(--color-text) transition hover:bg-(--color-surface-hover)"
          >
            <ChevronRight className="rotate-180" size={18} />
            Últimas compras
          </button>

          <InvoiceSummary invoice={invoice} />

          <section className="mt-6 rounded-xl border border-(--color-border) bg-(--color-surface) p-4">
            <button
              type="button"
              onClick={() => setShowInvoiceItemFilters((current) => !current)}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="text-sm font-semibold">Filtros</span>

              {showInvoiceItemFilters ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>

            {showInvoiceItemFilters && (
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  handleInvoiceItemFilterSubmit()
                }}
                className="mt-4"
              >
                <div className="grid gap-4 md:grid-cols-3">
                  <label>
                    <span className="text-sm text-(--color-text)">Descrição</span>

                    <input
                      type="text"
                      value={invoiceItemDescription}
                      onChange={(event) => setInvoiceItemDescription(event.target.value)}
                      placeholder="Ex.: mercado"
                      className={fieldClassName}
                    />
                  </label>

                  <label>
                    <span className="text-sm text-(--color-text)">Data inicial</span>

                    <input
                      type="date"
                      value={invoiceItemStartDate}
                      onChange={(event) => setInvoiceItemStartDate(event.target.value)}
                      className={fieldClassName}
                    />
                  </label>

                  <label>
                    <span className="text-sm text-(--color-text)">Data final</span>

                    <input
                      type="date"
                      value={invoiceItemEndDate}
                      onChange={(event) => setInvoiceItemEndDate(event.target.value)}
                      className={fieldClassName}
                    />
                  </label>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="rounded-lg bg-emerald-500 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-emerald-400"
                  >
                    Filtrar
                  </button>

                  <button
                    type="button"
                    onClick={handleClearInvoiceItemFilters}
                    className="rounded-lg border border-(--color-border) px-4 py-2.5 text-sm font-medium text-(--color-text) transition hover:bg-(--color-surface-hover)"
                  >
                    Limpar filtros
                  </button>
                </div>
              </form>
            )}
          </section>

          <InvoiceInstallmentList installments={getFilteredInvoiceInstallments()} />
          {accountsErrorMessage && <Alert className="mt-8">{accountsErrorMessage}</Alert>}

          {selectedCreditCardId &&
            !invoice.installments.every((installment) => installment.paid) &&
            !accountsErrorMessage && (
              <InvoicePaymentForm
                creditCardId={selectedCreditCardId}
                month={invoice.month}
                year={invoice.year}
                financialAccounts={financialAccounts}
                onPaid={handleInvoicePaid}
              />
            )}
        </>
      )}

      <ConfirmDialog
        open={purchaseToDelete !== null}
        title="Excluir compra"
        description={
          <>
            Tem certeza que deseja excluir a compra{' '}
            <strong className="text-(--color-text)">{purchaseToDelete?.description}</strong>? Esta
            ação não poderá ser desfeita.
          </>
        }
        confirmLabel="Excluir compra"
        confirmLoadingLabel="Excluindo..."
        confirmVariant="danger"
        isLoading={isDeletingPurchase}
        onCancel={() => {
          if (!isDeletingPurchase) {
            setPurchaseToDelete(null)
          }
        }}
        onConfirm={() => void handleDeletePurchase()}
      />
    </section>
  )
}

export default InvoicesPage
