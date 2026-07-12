import { useState, type SubmitEvent } from 'react'

import type { CreditCardResponse } from '../../credit-cards/model/creditCardTypes'
import { fieldClassName } from '../../../components/ui/forms/fieldClass'

type InvoiceFilterProps = {
  creditCards: CreditCardResponse[]
  isLoading: boolean
  onSearch: (creditCardId: string, month: number, year: number) => void
}

function InvoiceFilter({ creditCards, isLoading, onSearch }: InvoiceFilterProps) {
  const currentDate = new Date()

  const [creditCardId, setCreditCardId] = useState('')
  const [month, setMonth] = useState(String(currentDate.getMonth() + 1))
  const [year, setYear] = useState(String(currentDate.getFullYear()))

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    onSearch(creditCardId, Number(month), Number(year))
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-xl border border-(--color-border) bg-(--color-surface) p-4"
    >
      <div>
        <h2 className="text-lg font-semibold">Consultar fatura</h2>

        <p className="mt-1 text-sm text-(--color-text-muted)">
          Selecione o cartão e o período da fatura que deseja consultar.
        </p>
      </div>

      {creditCards.length === 0 ? (
        <div className="mt-6 rounded-lg border border-amber-500/20 bg-amber-500/10 p-4">
          <p className="text-sm text-amber-300">
            Cadastre um cartão de crédito antes de consultar faturas.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <label className="sm:col-span-3">
              <span className="text-sm text-(--color-text)">Cartão</span>

              <select
                required
                value={creditCardId}
                onChange={(event) => setCreditCardId(event.target.value)}
                className={fieldClassName}
              >
                <option value="">Selecione um cartão</option>

                {creditCards.map((creditCard) => (
                  <option key={creditCard.id} value={creditCard.id}>
                    {creditCard.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="text-sm text-(--color-text)">Mês</span>

              <input
                required
                type="number"
                inputMode="numeric"
                min="1"
                max="12"
                value={month}
                onChange={(event) => setMonth(event.target.value)}
                className={`${fieldClassName} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
              />
            </label>

            <label>
              <span className="text-sm text-(--color-text)">Ano</span>

              <input
                required
                type="number"
                inputMode="numeric"
                min="2000"
                value={year}
                onChange={(event) => setYear(event.target.value)}
                className={`${fieldClassName} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
              />
            </label>
          </div>

          <div className="mt-6 border-t border-(--color-border) pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isLoading ? 'Consultando...' : 'Consultar fatura'}
            </button>
          </div>
        </>
      )}
    </form>
  )
}

export default InvoiceFilter
