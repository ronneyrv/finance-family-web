import { fieldClassName } from '../../../../components/ui/forms/fieldClass'

type InstallmentSelectorProps = {
  value: string
  onChange: (value: string) => void
}

function InstallmentSelector({ value, onChange }: InstallmentSelectorProps) {
  return (
    <label>
      <span className="text-sm text-slate-300">Parcelas</span>

      <input
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
