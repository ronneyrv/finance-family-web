import { useEffect, useState } from 'react'

import { Loading } from '../../components/ui/loading'
import { ApiError } from '../../lib/api/apiError'
import { PageHeader } from '../../components/ui/page'
import { invoicesApi } from '../../features/invoices/api/invoicesApi'
import { creditCardsApi } from '../../features/credit-cards/api/creditCardsApi'
import { financialAccountsApi } from '../../features/financial-accounts/api/financialAccountsApi'
import type { CreditCardResponse } from '../../features/credit-cards/model/creditCardTypes'
import type { InvoiceResponse } from '../../features/invoices/model/invoiceTypes'
import type { FinancialAccountResponse } from '../../features/financial-accounts/model/financialAccountTypes'
import InvoicePaymentForm from '../../features/invoices/components/InvoicePaymentForm'
import InvoiceFilter from '../../features/invoices/components/InvoiceFilter'
import InvoiceInstallmentList from '../../features/invoices/components/InvoiceInstallmentList'
import InvoiceSummary from '../../features/invoices/components/InvoiceSummary'
import { Alert } from '../../components/ui/alert'

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

        if (error instanceof ApiError) {
          setCardsErrorMessage(error.message)
        } else {
          setCardsErrorMessage('Não foi possível carregar os cartões.')
        }
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
      if (error instanceof ApiError) {
        setInvoiceErrorMessage(error.message)
      } else {
        setInvoiceErrorMessage('Não foi possível carregar a fatura.')
      }
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
      if (error instanceof ApiError) {
        setAccountsErrorMessage(error.message)
      } else {
        setAccountsErrorMessage('Não foi possível carregar as contas financeiras.')
      }
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
    </section>
  )
}

export default InvoicesPage
