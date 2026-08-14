import { useEffect, useState } from 'react'

import { Loading } from '../../components/ui/loading'
import { PageHeader } from '../../components/ui/page'
import { invoicesApi } from '../../features/invoices/api/invoicesApi'
import { creditCardsApi } from '../../features/credit-cards/api/creditCardsApi'
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
import { Alert } from '../../components/ui/alert'
import { useNotification } from '../../app/providers/useNotification'
import PendingPurchaseList from '../../features/invoices/components/PendingPurchaseList'
import { ConfirmDialog } from '../../components/ui/dialog'

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

  useEffect(() => {
    let isCancelled = false

    async function loadPendingPurchases() {
      try {
        setPendingPurchasesErrorMessage(null)

        const response = await invoicesApi.findPendingPurchases()

        if (!isCancelled) {
          setPendingPurchases(response)
        }
      } catch (error) {
        if (isCancelled) {
          return
        }

        setPendingPurchasesErrorMessage(
          getApiErrorMessage(error, 'Não foi possível carregar as compras pendentes.'),
        )
      } finally {
        if (!isCancelled) {
          setIsLoadingPendingPurchases(false)
        }
      }
    }

    void loadPendingPurchases()

    return () => {
      isCancelled = true
    }
  }, [])

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
          {isLoadingPendingPurchases && (
            <Loading className="mt-8" message="Carregando compras pendentes..." />
          )}

          {pendingPurchasesErrorMessage && (
            <Alert className="mt-8">{pendingPurchasesErrorMessage}</Alert>
          )}

          {!isLoadingPendingPurchases && !pendingPurchasesErrorMessage && (
            <PendingPurchaseList purchases={pendingPurchases} onDelete={setPurchaseToDelete} />
          )}
        </>
      )}

      {invoiceErrorMessage && <Alert className="mt-8">{invoiceErrorMessage}</Alert>}

      {invoice && (
        <>
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
