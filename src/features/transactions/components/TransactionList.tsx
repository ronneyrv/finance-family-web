import { formatCurrency } from '../../../lib/formatters/currency'
import { formatDate } from '../../../lib/formatters/date'
import type { TransactionResponse } from '../model/transactionTypes'
import { Pencil, Trash2 } from 'lucide-react'
import { paymentMethodLabels } from '../model/paymentMethods'
import { Card } from '../../../components/ui/card'

type TransactionListProps = {
  transactions: TransactionResponse[]
  onEdit: (transaction: TransactionResponse) => void
  onDelete: (transaction: TransactionResponse) => void
}

function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  function getCategoryLabel(transaction: TransactionResponse) {
    if (transaction.transactionKind === 'CREDIT_CARD_PAYMENT') {
      return 'Pagamento de fatura'
    }

    return transaction.category ?? 'Sem categoria'
  }

  if (transactions.length === 0) {
    return (
      <Card className="mt-8 p-8 text-center">
        <p className="font-medium">Nenhuma transação encontrada</p>

        <p className="mt-2 text-sm text-(--color-text-muted)">
          Suas movimentações financeiras aparecerão aqui.
        </p>
      </Card>
    )
  }

  return (
    <div className="mt-8">
      <div className="space-y-3 lg:hidden">
        {transactions.map((transaction) => (
          <article
            key={transaction.id}
            className="rounded-xl border border-(--color-border) bg-(--color-surface) p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="truncate font-medium">{transaction.description}</h2>

                <p className="mt-1 text-sm text-(--color-text-muted)">
                  {getCategoryLabel(transaction)}
                  {transaction.transactionKind === 'REGULAR' && transaction.subCategory
                    ? ` · ${transaction.subCategory}`
                    : ''}
                </p>

                <p className="mt-2 text-xs text-(--color-text-muted)">
                  {formatDate(transaction.transactionDate)}
                  {' · '}
                  {paymentMethodLabels[transaction.paymentMethod]}
                </p>
              </div>

              <span
                className={
                  transaction.type === 'INCOME'
                    ? 'shrink-0 font-semibold text-emerald-400'
                    : 'shrink-0 font-semibold text-red-400'
                }
              >
                {transaction.type === 'INCOME' ? '+' : '-'} {formatCurrency(transaction.amount)}
              </span>
            </div>

            {transaction.transactionKind === 'REGULAR' && (
              <div className="mt-4 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => onEdit(transaction)}
                  className="flex items-center gap-2 text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
                  aria-label={`Editar ${transaction.description}`}
                >
                  <Pencil size={16} />
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(transaction)}
                  className="flex items-center gap-2 text-sm font-medium text-red-400 transition hover:text-red-300"
                  aria-label={`Excluir ${transaction.description}`}
                >
                  <Trash2 size={16} />
                  Excluir
                </button>
              </div>
            )}
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface) lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-(--color-border) bg-(--color-surface-hover)">
              <tr className="text-left text-xs font-medium uppercase tracking-wider text-(--color-text-muted)">
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Pagamento</th>
                <th className="px-6 py-4 text-right">Valor</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-(--color-border)">
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="transition-colors hover:bg-(--color-surface-hover)"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-(--color-text-muted)">
                    {formatDate(transaction.transactionDate)}
                  </td>

                  <td className="px-6 py-4 font-medium text-(--color-text)">
                    {transaction.description}
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm">{getCategoryLabel(transaction)}</p>

                    {transaction.transactionKind === 'CREDIT_CARD_PAYMENT' ? (
                      <p className="mt-1 text-xs text-(--color-text-muted)">
                        Conta: {transaction.accountName}
                      </p>
                    ) : (
                      transaction.subCategory && (
                        <p className="mt-1 text-xs text-(--color-text-muted)">
                          {transaction.subCategory}
                        </p>
                      )
                    )}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm text-(--color-text-muted)">
                    {paymentMethodLabels[transaction.paymentMethod]}
                  </td>

                  <td
                    className={
                      transaction.type === 'INCOME'
                        ? 'whitespace-nowrap px-6 py-4 text-right font-semibold text-emerald-400'
                        : 'whitespace-nowrap px-6 py-4 text-right font-semibold text-red-400'
                    }
                  >
                    {transaction.type === 'INCOME' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    {transaction.transactionKind === 'REGULAR' && (
                      <>
                        <button
                          type="button"
                          onClick={() => onEdit(transaction)}
                          className="inline-flex rounded-lg p-2 text-(--color-text-muted) transition hover:bg-emerald-500/10 hover:text-emerald-400"
                          aria-label={`Editar ${transaction.description}`}
                          title="Editar transação"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(transaction)}
                          className="inline-flex rounded-lg p-2 text-(--color-text-muted) transition hover:bg-red-500/10 hover:text-red-400"
                          aria-label={`Excluir ${transaction.description}`}
                          title="Excluir transação"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TransactionList
