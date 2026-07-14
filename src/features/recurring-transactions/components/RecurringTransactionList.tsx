import type { RecurringTransactionResponse } from '../model/recurringTransactionTypes'

type RecurringTransactionListProps = {
  recurringTransactions: RecurringTransactionResponse[]

  onEdit: (transaction: RecurringTransactionResponse) => void

  onToggleStatus: (id: string, active: boolean) => void

  onDelete: (id: string) => void
}

function RecurringTransactionList({
  recurringTransactions,
  onEdit,
  onToggleStatus,
  onDelete,
}: RecurringTransactionListProps) {
  if (recurringTransactions.length === 0) {
    return (
      <div className="mt-8 rounded-xl border border-dashed border-(--color-border) p-10 text-center">
        <p className="text-(--color-text-muted)">Nenhuma transação recorrente cadastrada.</p>
      </div>
    )
  }

  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-(--color-border)">
      <table className="min-w-full">
        <thead className="bg-(--color-surface)">
          <tr className="text-left text-sm text-(--color-text-muted)">
            <th className="px-4 py-3">Descrição</th>
            <th className="px-4 py-3">Tipo</th>
            <th className="px-4 py-3">Valor</th>
            <th className="px-4 py-3">Dia</th>
            <th className="px-4 py-3">Categoria</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Ações</th>
          </tr>
        </thead>

        <tbody>
          {recurringTransactions.map((transaction) => (
            <tr key={transaction.id} className="border-t border-(--color-border)">
              <td className="px-4 py-3">{transaction.description}</td>

              <td className="px-4 py-3">{transaction.type === 'INCOME' ? 'Receita' : 'Despesa'}</td>

              <td className="px-4 py-3">
                {transaction.amount.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </td>

              <td className="px-4 py-3">Todo dia {transaction.dayOfMonth}</td>

              <td className="px-4 py-3">{transaction.category}</td>

              <td className="px-4 py-3">
                <span
                  className={
                    transaction.active
                      ? 'rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-400'
                      : 'rounded-full bg-slate-700 px-2 py-1 text-xs text-slate-400'
                  }
                >
                  {transaction.active ? 'Ativa' : 'Inativa'}
                </span>
              </td>

              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onEdit(transaction)}
                    className="text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleStatus(transaction.id, !transaction.active)}
                    className="text-sm font-medium text-amber-400 transition hover:text-amber-300"
                  >
                    {transaction.active ? 'Desativar' : 'Ativar'}
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(transaction.id)}
                    className="text-sm font-medium text-red-400 transition hover:text-red-300"
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RecurringTransactionList
