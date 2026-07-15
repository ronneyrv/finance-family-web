import { useEffect, useState } from 'react'

import { Alert } from '../../components/ui/alert'
import { ApiError } from '../../lib/api/apiError'
import { PageHeader } from '../../components/ui/page'
import { creditCardsApi } from '../../features/credit-cards/api/creditCardsApi'
import type { CreditCardResponse } from '../../features/credit-cards/model/creditCardTypes'
import type { InstallmentResponse } from '../../features/purchases/model/purchaseTypes'
import InstallmentList from '../../features/purchases/components/InstallmentList'
import PurchaseForm from '../../features/purchases/components/PurchaseForm'

function PurchasesPage() {
  const [creditCards, setCreditCards] = useState<CreditCardResponse[]>([])
  const [generatedInstallments, setGeneratedInstallments] = useState<InstallmentResponse[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    async function loadCreditCards() {
      try {
        setErrorMessage(null)

        const response = await creditCardsApi.findAll()

        if (!isCancelled) {
          setCreditCards(response)
        }
      } catch (error) {
        if (isCancelled) {
          return
        }

        if (error instanceof ApiError) {
          setErrorMessage(error.message)
        } else {
          setErrorMessage('Não foi possível carregar os cartões.')
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadCreditCards()

    return () => {
      isCancelled = true
    }
  }, [])

  function handlePurchaseCreated(installments: InstallmentResponse[]) {
    setGeneratedInstallments(installments)
  }

  return (
    <section>
      <PageHeader
        section="Compras parceladas"
        title="Compras no cartão"
        description="Registre compras à vista ou parceladas e acompanhe as faturas em que serão cobradas."
      />

      {isLoading && <p className="mt-8 text-slate-400">Carregando cartões...</p>}

      {errorMessage && <Alert className="mt-8">{errorMessage}</Alert>}

      {!isLoading && !errorMessage && (
        <PurchaseForm creditCards={creditCards} onCreated={handlePurchaseCreated} />
      )}

      <InstallmentList installments={generatedInstallments} />
    </section>
  )
}

export default PurchasesPage
