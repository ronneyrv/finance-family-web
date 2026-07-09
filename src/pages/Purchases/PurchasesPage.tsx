import { useEffect, useState } from 'react'

import { creditCardsApi } from '../../features/credit-cards/api/creditCardsApi'
import type { CreditCardResponse } from '../../features/credit-cards/model/creditCardTypes'
import InstallmentList from '../../features/purchases/components/InstallmentList'
import PurchaseForm from '../../features/purchases/components/PurchaseForm'
import type { InstallmentResponse } from '../../features/purchases/model/purchaseTypes'
import { ApiError } from '../../lib/api/apiError'

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
      <div>
        <p className="text-sm font-medium text-emerald-400">Compras parceladas</p>

        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Compras no cartão</h1>

        <p className="mt-2 text-sm text-slate-400">
          Registre compras à vista ou parceladas e acompanhe as faturas em que serão cobradas.
        </p>
      </div>

      {isLoading && <p className="mt-8 text-slate-400">Carregando cartões...</p>}

      {errorMessage && (
        <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
          {errorMessage}
        </div>
      )}

      {!isLoading && !errorMessage && (
        <PurchaseForm creditCards={creditCards} onCreated={handlePurchaseCreated} />
      )}

      <InstallmentList installments={generatedInstallments} />
    </section>
  )
}

export default PurchasesPage
