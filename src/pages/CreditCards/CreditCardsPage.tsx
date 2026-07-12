import { useEffect, useState } from 'react'

import { creditCardsApi } from '../../features/credit-cards/api/creditCardsApi'
import CreditCardForm from '../../features/credit-cards/components/CreditCardForm'
import CreditCardList from '../../features/credit-cards/components/CreditCardList'
import DeleteCreditCardDialog from '../../features/credit-cards/components/DeleteCreditCardDialog'
import type { CreditCardResponse } from '../../features/credit-cards/model/creditCardTypes'
import { ApiError } from '../../lib/api/apiError'

function CreditCardsPage() {
  const [creditCards, setCreditCards] = useState<CreditCardResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [creditCardToEdit, setCreditCardToEdit] = useState<CreditCardResponse | null>(null)

  const [creditCardToDelete, setCreditCardToDelete] = useState<CreditCardResponse | null>(null)

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

  function handleCreditCardCreated(createdCreditCard: CreditCardResponse) {
    setCreditCards((currentCreditCards) => [...currentCreditCards, createdCreditCard])
  }

  function handleCreditCardUpdated(updatedCreditCard: CreditCardResponse) {
    setCreditCards((currentCreditCards) =>
      currentCreditCards.map((creditCard) =>
        creditCard.id === updatedCreditCard.id ? updatedCreditCard : creditCard,
      ),
    )

    setCreditCardToEdit(null)
  }

  function handleCreditCardDeleted(creditCardId: string) {
    setCreditCards((currentCreditCards) =>
      currentCreditCards.filter((creditCard) => creditCard.id !== creditCardId),
    )

    setCreditCardToDelete(null)

    if (creditCardToEdit?.id === creditCardId) {
      setCreditCardToEdit(null)
    }
  }

  return (
    <section>
      <div>
        <p className="text-sm font-medium text-emerald-400">Cartões e faturas</p>

        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Cartões de crédito</h1>

        <p className="mt-2 text-sm text-(--color-text-muted)">
          Gerencie seus cartões, limites e datas de fechamento e vencimento.
        </p>
      </div>

      <CreditCardForm
        key={creditCardToEdit?.id ?? 'new'}
        creditCard={creditCardToEdit ?? undefined}
        onCreated={handleCreditCardCreated}
        onUpdated={handleCreditCardUpdated}
        onCancelEdit={() => setCreditCardToEdit(null)}
      />

      {isLoading && <p className="mt-8 text-(--color-text-muted)">Carregando cartões...</p>}

      {errorMessage && (
        <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
          {errorMessage}
        </div>
      )}

      {!isLoading && !errorMessage && (
        <CreditCardList
          creditCards={creditCards}
          onEdit={setCreditCardToEdit}
          onDelete={setCreditCardToDelete}
        />
      )}

      {creditCardToDelete && (
        <DeleteCreditCardDialog
          creditCard={creditCardToDelete}
          onDeleted={handleCreditCardDeleted}
          onCancel={() => setCreditCardToDelete(null)}
        />
      )}
    </section>
  )
}

export default CreditCardsPage
