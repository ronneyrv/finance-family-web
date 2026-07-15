import { useEffect, useState } from 'react'

import { Alert } from '../../components/ui/alert'
import { ApiError } from '../../lib/api/apiError'
import { PageHeader } from '../../components/ui/page'
import { ConfirmDialog } from '../../components/ui/dialog'
import { creditCardsApi } from '../../features/credit-cards/api/creditCardsApi'
import type { CreditCardResponse } from '../../features/credit-cards/model/creditCardTypes'
import CreditCardForm from '../../features/credit-cards/components/CreditCardForm'
import CreditCardList from '../../features/credit-cards/components/CreditCardList'
import { Loading } from '../../components/ui/loading'

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
      <PageHeader
        section="Cartões"
        title="Cartões de crédito"
        description="Gerencie cartões, limites e ciclos de faturamento."
      />

      <CreditCardForm
        key={creditCardToEdit?.id ?? 'new'}
        creditCard={creditCardToEdit ?? undefined}
        onCreated={handleCreditCardCreated}
        onUpdated={handleCreditCardUpdated}
        onCancelEdit={() => setCreditCardToEdit(null)}
      />

      {isLoading && <Loading className="mt-8" message="Carregando cartões..." />}

      {errorMessage && <Alert className="mt-8">{errorMessage}</Alert>}

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
