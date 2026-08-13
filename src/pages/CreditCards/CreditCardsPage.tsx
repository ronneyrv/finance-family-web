import { useEffect, useState } from 'react'

import CreditCardList from '../../features/credit-cards/components/CreditCardList'
import CreditCardForm from '../../features/credit-cards/components/CreditCardForm'
import { Alert } from '../../components/ui/alert'
import { Loading } from '../../components/ui/loading'
import { PageHeader } from '../../components/ui/page'
import { ConfirmDialog } from '../../components/ui/dialog'
import { creditCardsApi } from '../../features/credit-cards/api/creditCardsApi'
import { useNotification } from '../../app/providers/useNotification'
import { getApiErrorMessage } from '../../lib/api/getApiErrorMessage'
import type { CreditCardResponse } from '../../features/credit-cards/model/creditCardTypes'

function CreditCardsPage() {
  const [creditCards, setCreditCards] = useState<CreditCardResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [creditCardToEdit, setCreditCardToEdit] = useState<CreditCardResponse | null>(null)

  const [creditCardToDelete, setCreditCardToDelete] = useState<CreditCardResponse | null>(null)

  const [isDeleting, setIsDeleting] = useState(false)

  const { notify } = useNotification()

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

        setErrorMessage(getApiErrorMessage(error, 'Não foi possível carregar os cartões.'))
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

      await creditCardsApi.delete(creditCardToDelete.id)

      setCreditCards((currentCreditCards) =>
        currentCreditCards.filter((creditCard) => creditCard.id !== creditCardToDelete.id),
      )

      if (creditCardToEdit?.id === creditCardToDelete.id) {
        setCreditCardToEdit(null)
      }

      setCreditCardToDelete(null)

      notify.success('Cartão excluído com sucesso.')
    } catch (error) {
      notify.error(getApiErrorMessage(error, 'Não foi possível excluir o cartão.'))
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
        onCancel={() => {
          if (!isDeleting) {
            setCreditCardToDelete(null)
          }
        }}
        onConfirm={() => void handleDeleteCreditCard()}
      />
    </section>
  )
}

export default CreditCardsPage
