import { useEffect, useState } from 'react'

import { creditCardsApi } from '../../features/credit-cards/api/creditCardsApi'
import CreditCardForm from '../../features/credit-cards/components/CreditCardForm'
import CreditCardList from '../../features/credit-cards/components/CreditCardList'
import { ConfirmDialog } from '../../components/ui/dialog'
import type { CreditCardResponse } from '../../features/credit-cards/model/creditCardTypes'
import { ApiError } from '../../lib/api/apiError'

function CreditCardsPage() {
  const [creditCards, setCreditCards] = useState<CreditCardResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [creditCardToEdit, setCreditCardToEdit] = useState<CreditCardResponse | null>(null)

  const [creditCardToDelete, setCreditCardToDelete] = useState<CreditCardResponse | null>(null)

  const [isDeleting, setIsDeleting] = useState(false)

  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null)

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

  async function handleDeleteCreditCard() {
    if (!creditCardToDelete) {
      return
    }

    try {
      setIsDeleting(true)
      setDeleteErrorMessage(null)

      await creditCardsApi.delete(creditCardToDelete.id)

      setCreditCards((currentCreditCards) =>
        currentCreditCards.filter((creditCard) => creditCard.id !== creditCardToDelete.id),
      )

      if (creditCardToEdit?.id === creditCardToDelete.id) {
        setCreditCardToEdit(null)
      }

      setCreditCardToDelete(null)
    } catch (error) {
      if (error instanceof ApiError) {
        setDeleteErrorMessage(error.message)
      } else {
        setDeleteErrorMessage('Não foi possível excluir o cartão.')
      }
    } finally {
      setIsDeleting(false)
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

      <ConfirmDialog
        open={creditCardToDelete !== null}
        title="Excluir cartão"
        description={
          <>
            Tem certeza que deseja excluir o cartão{' '}
            <strong className="text-(--color-text)">{creditCardToDelete?.name}</strong>? Esta ação
            não poderá ser desfeita.
          </>
        }
        confirmLabel="Excluir cartão"
        confirmLoadingLabel="Excluindo..."
        confirmVariant="danger"
        isLoading={isDeleting}
        errorMessage={deleteErrorMessage}
        onCancel={() => {
          if (!isDeleting) {
            setDeleteErrorMessage(null)
            setCreditCardToDelete(null)
          }
        }}
        onConfirm={() => void handleDeleteCreditCard()}
      />
    </section>
  )
}

export default CreditCardsPage
