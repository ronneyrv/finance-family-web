import { useState, type SubmitEvent } from 'react'

import { ApiError } from '../../../lib/api/apiError'
import { creditCardsApi } from '../api/creditCardsApi'
import type { CreditCardResponse } from '../model/creditCardTypes'

type CreditCardFormProps = {
  creditCard?: CreditCardResponse
  onCreated?: (creditCard: CreditCardResponse) => void
  onUpdated?: (creditCard: CreditCardResponse) => void
  onCancelEdit?: () => void
}

function CreditCardForm({ creditCard, onCreated, onUpdated, onCancelEdit }: CreditCardFormProps) {
  const [name, setName] = useState(creditCard?.name ?? '')

  const [creditLimit, setCreditLimit] = useState(creditCard ? String(creditCard.creditLimit) : '')

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
        creditLimit: Number(creditLimit),
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
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-6"
    >
      <div>
        <h2 className="text-lg font-semibold">{creditCard ? 'Editar cartão' : 'Novo cartão'}</h2>

        <p className="mt-1 text-sm text-slate-400">
          {creditCard
            ? 'Atualize os dados do cartão de crédito.'
            : 'Cadastre um cartão para registrar compras e acompanhar faturas.'}
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="text-sm text-slate-300">Nome do cartão</span>

          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ex.: Nubank Platinum"
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5"
          />
        </label>

        <label>
          <span className="text-sm text-slate-300">Limite de crédito</span>

          <input
            required
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            value={creditLimit}
            onChange={(event) => setCreditLimit(event.target.value)}
            placeholder="0,00"
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </label>

        <div className="hidden sm:block" />

        <label>
          <span className="text-sm text-slate-300">Dia do fechamento</span>

          <input
            required
            type="number"
            inputMode="numeric"
            min="1"
            max="31"
            value={closingDay}
            onChange={(event) => setClosingDay(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5"
          />
        </label>

        <label>
          <span className="text-sm text-slate-300">Dia do vencimento</span>

          <input
            required
            type="number"
            inputMode="numeric"
            min="1"
            max="31"
            value={dueDay}
            onChange={(event) => setDueDay(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5"
          />
        </label>
      </div>

      {errorMessage && <p className="mt-4 text-sm text-red-400">{errorMessage}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-lg bg-emerald-500 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? 'Salvando...' : creditCard ? 'Salvar alterações' : 'Cadastrar cartão'}
      </button>

      {creditCard && (
        <button
          type="button"
          onClick={onCancelEdit}
          disabled={isSubmitting}
          className="mt-3 w-full rounded-lg border border-slate-700 px-4 py-2.5 font-medium text-slate-300 transition hover:bg-slate-900 disabled:opacity-50 sm:mt-0 sm:ml-3 sm:w-auto"
        >
          Cancelar edição
        </button>
      )}
    </form>
  )
}

export default CreditCardForm
