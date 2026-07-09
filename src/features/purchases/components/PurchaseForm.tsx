import { useState, type FormEvent } from 'react'

import type { CreditCardResponse } from '../../credit-cards/model/creditCardTypes'
import { ApiError } from '../../../lib/api/apiError'
import { purchasesApi } from '../api/purchasesApi'
import type { InstallmentResponse } from '../model/purchaseTypes'

type PurchaseFormProps = {
  creditCards: CreditCardResponse[]
  onCreated: (installments: InstallmentResponse[]) => void
}

function PurchaseForm({ creditCards, onCreated }: PurchaseFormProps) {
  const [creditCardId, setCreditCardId] = useState('')
  const [description, setDescription] = useState('')
  const [totalAmount, setTotalAmount] = useState('')
  const [installments, setInstallments] = useState('1')
  const [purchaseDate, setPurchaseDate] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setIsSubmitting(true)
      setErrorMessage(null)

      const response = await purchasesApi.create(creditCardId, {
        description,
        totalAmount: Number(totalAmount),
        installments: Number(installments),
        purchaseDate,
      })

      onCreated(response)

      setDescription('')
      setTotalAmount('')
      setInstallments('1')
      setPurchaseDate('')
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('Não foi possível registrar a compra.')
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
        <h2 className="text-lg font-semibold">Nova compra</h2>

        <p className="mt-1 text-sm text-slate-400">
          Registre uma compra e acompanhe o cronograma das parcelas geradas.
        </p>
      </div>

      {creditCards.length === 0 ? (
        <div className="mt-6 rounded-lg border border-amber-500/20 bg-amber-500/10 p-4">
          <p className="text-sm text-amber-300">
            Cadastre um cartão de crédito antes de registrar uma compra.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="text-sm text-slate-300">Cartão</span>

              <select
                required
                value={creditCardId}
                onChange={(event) => setCreditCardId(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5"
              >
                <option value="">Selecione um cartão</option>

                {creditCards.map((creditCard) => (
                  <option key={creditCard.id} value={creditCard.id}>
                    {creditCard.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="sm:col-span-2">
              <span className="text-sm text-slate-300">Descrição</span>

              <input
                required
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Ex.: Notebook"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5"
              />
            </label>

            <label>
              <span className="text-sm text-slate-300">Valor total</span>

              <input
                required
                type="number"
                inputMode="decimal"
                min="0.10"
                step="0.10"
                value={totalAmount}
                onChange={(event) => setTotalAmount(event.target.value)}
                placeholder="0,00"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </label>

            <label>
              <span className="text-sm text-slate-300">Parcelas</span>

              <input
                required
                type="number"
                inputMode="numeric"
                min="1"
                max="36"
                value={installments}
                onChange={(event) => setInstallments(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </label>

            <label className="sm:col-span-2">
              <span className="text-sm text-slate-300">Data da compra</span>

              <input
                required
                type="date"
                value={purchaseDate}
                onChange={(event) => setPurchaseDate(event.target.value)}
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
            {isSubmitting ? 'Registrando...' : 'Registrar compra'}
          </button>
        </>
      )}
    </form>
  )
}

export default PurchaseForm
