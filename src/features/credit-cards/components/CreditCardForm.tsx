import { useState, type SubmitEvent } from 'react'

import MoneyInput from '../../../components/ui/money/MoneyInput'
import { Card } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { ApiError } from '../../../lib/api/apiError'
import { creditCardsApi } from '../api/creditCardsApi'
import { fieldClassName } from '../../../components/ui/forms/fieldClass'
import { parseCurrencyInput } from '../../../lib/parsers/currency'
import { formatCurrencyInputValue } from '../../../lib/formatters/currencyInput'
import type { CreditCardResponse } from '../model/creditCardTypes'

type CreditCardFormProps = {
  creditCard?: CreditCardResponse
  onCreated?: (creditCard: CreditCardResponse) => void
  onUpdated?: (creditCard: CreditCardResponse) => void
  onCancelEdit?: () => void
}

function CreditCardForm({ creditCard, onCreated, onUpdated, onCancelEdit }: CreditCardFormProps) {
  const [name, setName] = useState(creditCard?.name ?? '')

  const [creditLimit, setCreditLimit] = useState(
    creditCard ? formatCurrencyInputValue(creditCard.creditLimit) : '',
  )

  const [closingDay, setClosingDay] = useState(creditCard ? String(creditCard.closingDay) : '')

  const [dueDay, setDueDay] = useState(creditCard ? String(creditCard.dueDay) : '')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setIsSubmitting(true)
      setErrorMessage(null)

      const request = {
        name,
        creditLimit: parseCurrencyInput(creditLimit),
        closingDay: Number(closingDay),
        dueDay: Number(dueDay),
      }

      if (creditCard) {
        const updatedCreditCard = await creditCardsApi.update(creditCard.id, request)

        onUpdated?.(updatedCreditCard)
      } else {
        const createdCreditCard = await creditCardsApi.create(request)

        onCreated?.(createdCreditCard)

        setName('')
        setCreditLimit('')
        setClosingDay('')
        setDueDay('')
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage(
          creditCard
            ? 'Não foi possível atualizar o cartão.'
            : 'Não foi possível cadastrar o cartão.',
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="mt-8">
      <form onSubmit={handleSubmit}>
        <div>
          <h2 className="text-lg font-semibold">{creditCard ? 'Editar cartão' : 'Novo cartão'}</h2>

          <p className="mt-1 text-sm text-(--color-text-muted)">
            {creditCard
              ? 'Atualize os dados do cartão de crédito.'
              : 'Cadastre um cartão para registrar compras e acompanhar faturas.'}
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="text-sm text-(--color-text)">Nome do cartão</span>

            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex.: Nubank Platinum"
              className={fieldClassName}
            />
          </label>

          <label>
            <span className="text-sm text-(--color-text)">Limite de crédito</span>

            <MoneyInput required placeholder="0,00" value={creditLimit} onChange={setCreditLimit} />
          </label>

          <div className="hidden sm:block" />

          <label>
            <span className="text-sm text-(--color-text)">Dia do fechamento</span>

            <input
              required
              type="number"
              inputMode="numeric"
              min="1"
              max="31"
              value={closingDay}
              onChange={(event) => setClosingDay(event.target.value)}
              className={`${fieldClassName} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
            />
          </label>

          <label>
            <span className="text-sm text-(--color-text)">Dia do vencimento</span>

            <input
              required
              type="number"
              inputMode="numeric"
              min="1"
              max="31"
              value={dueDay}
              onChange={(event) => setDueDay(event.target.value)}
              className={`${fieldClassName} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
            />
          </label>
        </div>

        {errorMessage && <p className="mt-4 text-sm text-red-400">{errorMessage}</p>}

        <div className="mt-6 flex flex-col gap-3 border-t border-(--color-border) pt-4 sm:flex-row">
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? 'Salvando...' : creditCard ? 'Salvar alterações' : 'Cadastrar cartão'}
          </Button>

          {creditCard && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancelEdit}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancelar edição
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}

export default CreditCardForm
