import { fieldClassName } from '../../../../components/ui/forms/fieldClass'

type InstallmentSelectorProps = {
  value: string
  onChange: (value: string) => void
}

function InstallmentSelector({ value, onChange }: InstallmentSelectorProps) {
  return (
    <label htmlFor="installments">
      <span className="text-sm text-(--color-text)">Parcelas</span>

      <input
        id="installments"
        required
        type="number"
        inputMode="numeric"
        min="1"
        max="36"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${fieldClassName} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
      />
    </label>
  )
}

export default InstallmentSelector
