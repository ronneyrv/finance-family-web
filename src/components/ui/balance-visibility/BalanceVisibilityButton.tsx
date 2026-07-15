import { Eye, EyeOff } from 'lucide-react'

import { useBalanceVisibility } from '../../../app/providers/useBalanceVisibility'
import { ActionLink } from '../text-button'

function BalanceVisibilityButton() {
  const { isVisible, toggleVisibility } = useBalanceVisibility()

  const Icon = isVisible ? Eye : EyeOff

  return (
    <ActionLink
      onClick={toggleVisibility}
      aria-label={isVisible ? 'Ocultar valores' : 'Mostrar valores'}
      title={isVisible ? 'Ocultar valores' : 'Mostrar valores'}
    >
      <Icon size={20} />

      <span className="hidden sm:inline">{isVisible ? 'Ocultar valores' : 'Mostrar valores'}</span>
    </ActionLink>
  )
}

export default BalanceVisibilityButton
