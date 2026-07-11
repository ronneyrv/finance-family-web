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
        className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
    </label>
  )
}

export default InstallmentSelector
