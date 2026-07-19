import { Banknote, Landmark, PiggyBank, WalletCards } from 'lucide-react'

import { Money } from '../../../components/ui/money'
import { EmptyState } from '../../../components/ui/empty-state'
import type { AccountType, FinancialAccountResponse } from '../model/financialAccountTypes'
import { ActionButton } from '../../../components/ui/action-button'

type FinancialAccountListProps = {
  financialAccounts: FinancialAccountResponse[]
  onEdit: (financialAccount: FinancialAccountResponse) => void
  onDelete: (financialAccount: FinancialAccountResponse) => void
}

const accountTypeLabels: Record<AccountType, string> = {
  CHECKING_ACCOUNT: 'Conta corrente',
  SAVINGS_ACCOUNT: 'Conta poupança',
  DIGITAL_ACCOUNT: 'Conta digital',
  CASH: 'Dinheiro',
}

const accountTypeIcons = {
  CHECKING_ACCOUNT: Landmark,
  SAVINGS_ACCOUNT: PiggyBank,
  DIGITAL_ACCOUNT: WalletCards,
  CASH: Banknote,
} satisfies Record<AccountType, typeof Landmark>

function FinancialAccountList({ financialAccounts, onEdit, onDelete }: FinancialAccountListProps) {
  if (financialAccounts.length === 0) {
    return (
      <EmptyState
        title="Nenhuma conta financeira cadastrada"
        description="Cadastre uma conta para acompanhar seus saldos e realizar pagamentos."
      />
    )
  }

  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {financialAccounts.map((financialAccount) => {
        const Icon = accountTypeIcons[financialAccount.accountType]

        return (
          <article
            key={financialAccount.id}
            className="rounded-xl border border-(--color-border) bg-(--color-surface) p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                  <Icon size={20} />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate font-semibold">{financialAccount.name}</h2>

                  <p className="mt-1 text-xs text-(--color-text-muted)">
                    {accountTypeLabels[financialAccount.accountType]}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 gap-1">
                <ActionButton
                  variant="edit"
                  label={`Editar ${financialAccount.name}`}
                  onClick={() => onEdit(financialAccount)}
                />

                <ActionButton
                  variant="delete"
                  label={`Excluir ${financialAccount.name}`}
                  onClick={() => onDelete(financialAccount)}
                />
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs uppercase tracking-wide text-(--color-text-muted)">
                Saldo atual
              </p>

              <p className="mt-1 text-xl font-semibold">
                <Money value={financialAccount.currentBalance} />
              </p>
            </div>

            <div className="mt-5 border-t border-(--color-border) pt-4">
              <p className="text-xs text-(--color-text-muted)">Saldo inicial</p>

              <p className="mt-1 text-sm font-medium">
                <Money value={financialAccount.initialBalance} />
              </p>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default FinancialAccountList
