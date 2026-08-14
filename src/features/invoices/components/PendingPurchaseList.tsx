import { CreditCard } from 'lucide-react'

import { Money } from '../../../components/ui/money'
import { EmptyState } from '../../../components/ui/empty-state'
import { ActionButton } from '../../../components/ui/action-button'
import { formatDate } from '../../../lib/formatters/date'
import type { PendingPurchaseResponse } from '../model/invoiceTypes'
import PurchaseCategorySelector from './PurchaseCategorySelector'

type PendingPurchaseListProps = {
  purchases: PendingPurchaseResponse[]
  onDelete: (purchase: PendingPurchaseResponse) => void
  onCategoryChange: (
    purchase: PendingPurchaseResponse,
    categoryId: string | null,
    subCategoryId: string | null,
  ) => void
}

function PendingPurchaseList({ purchases, onDelete, onCategoryChange }: PendingPurchaseListProps) {
  if (purchases.length === 0) {
    return (
      <EmptyState
        title="Nenhuma compra pendente"
        description="Não há compras no crédito aguardando pagamento."
      />
    )
  }

  return (
    <section className="mt-8 rounded-xl border border-(--color-border) bg-(--color-surface) p-4">
      <div>
        <p className="text-sm font-medium text-emerald-400">Compras no crédito</p>

        <h2 className="mt-1 text-lg font-semibold">Últimas compras</h2>

        <p className="mt-2 text-sm text-(--color-text-muted)">
          {purchases.length} {purchases.length === 1 ? 'compra pendente' : 'compras pendentes'}
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {purchases.map((purchase) => (
          <article
            key={purchase.id}
            className="grid gap-4 rounded-lg border border-(--color-border) bg-(--color-surface-hover) p-4 sm:grid-cols-[minmax(220px,1.5fr)_minmax(180px,1fr)_minmax(180px,1fr)_90px_60px_110px_32px] sm:items-center"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-(--color-background) p-2 text-(--color-text-muted)">
                <CreditCard size={18} />
              </div>

              <div className="min-w-0">
                <p className="font-medium">{purchase.description}</p>

                <p className="mt-1 text-sm text-(--color-text-muted)">{purchase.creditCardName}</p>
              </div>
            </div>

            <PurchaseCategorySelector
              categoryId={purchase.categoryId}
              subCategoryId={purchase.subCategoryId}
              onChange={(categoryId, subCategoryId) =>
                onCategoryChange(purchase, categoryId, subCategoryId)
              }
            />

            <div className="flex items-center justify-between gap-4 sm:contents">
              <div className="grid grid-cols-3 gap-6 sm:contents">
                <div>
                  <p className="text-xs text-(--color-text-muted)">Data</p>

                  <p className="mt-1 text-sm font-medium">{formatDate(purchase.purchaseDate)}</p>
                </div>

                <div>
                  <p className="text-xs text-(--color-text-muted)">Parcelas</p>

                  <p className="mt-1 text-sm font-medium">{purchase.installmentCount}x</p>
                </div>

                <div>
                  <p className="text-xs text-(--color-text-muted)">Valor</p>

                  <p className="mt-1 text-sm font-semibold">
                    <Money value={purchase.totalAmount} />
                  </p>
                </div>
              </div>

              <ActionButton
                variant="delete"
                label={`Excluir ${purchase.description}`}
                onClick={() => onDelete(purchase)}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default PendingPurchaseList
