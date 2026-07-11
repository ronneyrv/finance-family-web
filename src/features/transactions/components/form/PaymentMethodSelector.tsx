import type { ReactNode } from 'react'

type PaymentMethodSelectorProps = {
  children: ReactNode
}

function PaymentMethodSelector({ children }: PaymentMethodSelectorProps) {
  return (
    <label className="sm:col-span-2">
      <span className="text-sm text-slate-300">Forma de pagamento</span>

      {children}
    </label>
  )
}

export default PaymentMethodSelector
