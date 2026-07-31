import { useState } from 'react'

import { Card } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { usersApi } from '../api/usersApi'
import { ApiError } from '../../../lib/api/apiError'
import type { SubmitEvent } from 'react'
import Alert from '../../../components/ui/alert/Alert'
import PasswordField from '../../../components/ui/forms/PasswordField'

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    setFeedback(null)

    if (newPassword !== confirmPassword) {
      setFeedback({
        type: 'error',
        message: 'As senhas não coincidem.',
      })

      return
    }

    if (newPassword.length < 8) {
      setFeedback({
        type: 'error',
        message: 'A nova senha deve possuir pelo menos 8 caracteres.',
      })

      return
    }

    setIsSubmitting(true)

    try {
      await usersApi.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      })

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')

      setFeedback({
        type: 'success',
        message: 'Senha alterada com sucesso.',
      })
    } catch (error) {
      if (error instanceof ApiError) {
        setFeedback({
          type: 'error',
          message: error.message,
        })
      } else {
        setFeedback({
          type: 'error',
          message: 'Não foi possível alterar a senha.',
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="mt-8">
      <form onSubmit={handleSubmit}>
        <h2 className="text-lg font-semibold">Alterar senha</h2>

        <div className="mt-6 grid gap-4">
          <PasswordField
            required
            label="Senha atual"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
          />

          <PasswordField
            required
            label="Nova senha"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />

          <PasswordField
            required
            label="Confirmar nova senha"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </div>

        {feedback && (
          <Alert variant={feedback.type} className="mt-4">
            {feedback.message}
          </Alert>
        )}

        <div className="mt-6 border-t border-(--color-border) pt-4">
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? 'Alterando...' : 'Alterar senha'}
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default ChangePasswordForm
