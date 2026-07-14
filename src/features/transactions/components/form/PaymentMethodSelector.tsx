import { CreditCard, Landmark, Wallet, Zap } from 'lucide-react'

import { SegmentedButton } from '../../../../components/ui/button'
import { paymentMethodLabels } from '../../model/paymentMethods'
import type { PaymentMethod } from '../../model/transactionTypes'

type PaymentMethodSelectorProps = {
  methods: PaymentMethod[]
  value: PaymentMethod
  onChange: (value: PaymentMethod) => void
}

const paymentMethodIcons = {
  PIX: <Zap size={16} />,
  CASH: <Wallet size={16} />,
  DEBIT_CARD: <CreditCard size={16} />,
  CREDIT_CARD: <CreditCard size={16} />,
  BANK_TRANSFER: <Landmark size={16} />,
}

function PaymentMethodSelector({ methods, value, onChange }: PaymentMethodSelectorProps) {
  return (
    <div className="sm:col-span-2">
      <span className="text-sm font-medium text-(--color-text)">Forma de pagamento</span>

      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-flow-col sm:auto-cols-fr">
        {methods.map((method) => (
          <SegmentedButton
            key={method}
            selected={value === method}
            icon={paymentMethodIcons[method]}
            onClick={() => onChange(method)}
          >
            {paymentMethodLabels[method]}
          </SegmentedButton>
        ))}
      </div>
    </div>
  )
}

export default PaymentMethodSelector
