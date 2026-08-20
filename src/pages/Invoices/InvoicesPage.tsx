import { useCallback, useEffect, useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

import { Alert } from '../../components/ui/alert'
import { Loading } from '../../components/ui/loading'
import { PageHeader } from '../../components/ui/page'
import { invoicesApi } from '../../features/invoices/api/invoicesApi'
import { purchasesApi } from '../../features/purchases/api/purchasesApi'
import { ConfirmDialog } from '../../components/ui/dialog'
import { creditCardsApi } from '../../features/credit-cards/api/creditCardsApi'
import { useNotification } from '../../app/providers/useNotification'
import { getApiErrorMessage } from '../../lib/api/getApiErrorMessage'
import { financialAccountsApi } from '../../features/financial-accounts/api/financialAccountsApi'
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

  const [purchaseToDelete, setPurchaseToDelete] = useState<PendingPurchaseResponse | null>(null)
  const [isDeletingPurchase, setIsDeletingPurchase] = useState(false)

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
      await purchasesApi.updateCategory(purchase.id, {
        categoryId,
        subCategoryId,
      })

      await loadPendingPurchases()

      notify.success('Categoria da compra atualizada com sucesso.')
    } catch (error) {
      notify.error(getApiErrorMessage(error, 'Não foi possível atualizar a categoria da compra.'))
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
              {isLoadingPendingPurchases && (
                <Loading className="mt-8" message="Carregando compras pendentes..." />
              )}

              {pendingPurchasesErrorMessage && (
                <Alert className="mt-8">{pendingPurchasesErrorMessage}</Alert>
              )}

              {!isLoadingPendingPurchases && !pendingPurchasesErrorMessage && (
                <PendingPurchaseList
                  purchases={pendingPurchases}
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

          <InvoiceInstallmentList installments={invoice.installments} />
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
