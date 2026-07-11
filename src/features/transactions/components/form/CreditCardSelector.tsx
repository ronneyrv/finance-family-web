import type { CreditCardResponse } from '../../../credit-cards/model/creditCardTypes'

type CreditCardSelectorProps = {
  creditCards: CreditCardResponse[]
  value: string
  onChange: (value: string) => void
}

function CreditCardSelector({ creditCards, value, onChange }: CreditCardSelectorProps) {
  return (
    <label>
      <span className="text-sm text-slate-300">Cartão de crédito</span>

      <select
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
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
  )
}

export default CreditCardSelector
