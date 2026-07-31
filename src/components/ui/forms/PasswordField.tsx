import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import type { InputHTMLAttributes } from 'react'

import { fieldClassName } from './fieldClass'

type PasswordFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
}

function PasswordField({ label, className, ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <label>
      <span className="text-sm text-(--color-text)">{label}</span>

      <div className="relative mt-1">
        <input
          {...props}
          type={visible ? 'text' : 'password'}
          className={`${fieldClassName} pr-10 ${className ?? ''}`}
        />

        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          className="absolute inset-y-0 right-3 flex items-center text-(--color-text-muted) hover:text-(--color-text)"
          aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
          aria-pressed={visible}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </label>
  )
}

export default PasswordField
