import { CreditCard } from 'lucide-react'

import { Money } from '../../../components/ui/money'
import { EmptyState } from '../../../components/ui/empty-state'
import { ActionButton } from '../../../components/ui/action-button'
import type { CreditCardResponse } from '../model/creditCardTypes'

type CreditCardListProps = {
  creditCards: CreditCardResponse[]
  onEdit: (creditCard: CreditCardResponse) => void
  onDelete: (creditCard: CreditCardResponse) => void
}

function CreditCardList({ creditCards, onEdit, onDelete }: CreditCardListProps) {
  if (creditCards.length === 0) {
    return (
      <EmptyState
        title="Nenhum cartão cadastrado"
        description="Cadastre um cartão para registrar compras e acompanhar suas faturas."
      />
    )
  }

  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {creditCards.map((creditCard) => (
        <article
          key={creditCard.id}
          className="rounded-xl border border-(--color-border) bg-(--color-surface) p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                <CreditCard size={20} />
              </div>

              <div className="min-w-0">
                <h2 className="truncate font-semibold">{creditCard.name}</h2>

                <p className="mt-1 text-xs text-(--color-text-muted)">Cartão de crédito</p>
              </div>
            </div>

            <div className="flex shrink-0 gap-1">
              <ActionButton
                variant="edit"
                label={`Editar ${creditCard.name}`}
                onClick={() => onEdit(creditCard)}
              />

              <ActionButton
                variant="delete"
                label={`Excluir ${creditCard.name}`}
                onClick={() => onDelete(creditCard)}
              />
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xs uppercase tracking-wide text-(--color-text-muted)">
              Limite de crédito
            </p>

            <p className="mt-1 text-xl font-semibold">
              <Money value={creditCard.creditLimit} />
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-(--color-border) pt-4">
            <div>
              <p className="text-xs text-(--color-text-muted)">Fechamento</p>

              <p className="mt-1 text-sm font-medium">Dia {creditCard.closingDay}</p>
            </div>

            <div>
              <p className="text-xs text-(--color-text-muted)">Vencimento</p>

              <p className="mt-1 text-sm font-medium">Dia {creditCard.dueDay}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

export default CreditCardList
