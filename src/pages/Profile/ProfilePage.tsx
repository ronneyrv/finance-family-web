import { useEffect, useState } from 'react'
import type { SubmitEvent } from 'react'

import Alert from '../../components/ui/alert/Alert'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { fieldClassName } from '../../components/ui/forms/fieldClass'
import Loading from '../../components/ui/loading/Loading'
import { PageHeader } from '../../components/ui/page'

import { usersApi } from '../../features/users/api/usersApi'
import UserAvatar from '../../features/users/components/UserAvatar'
import type { CurrentUserResponse } from '../../features/users/model/currentUserTypes'

function ProfilePage() {
  const [user, setUser] = useState<CurrentUserResponse | null>(null)

  const [name, setName] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await usersApi.getCurrentUser()

        setUser(response)
        setName(response.name)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    void loadUser()
  }, [])

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!user) {
      return
    }

    setFeedback(null)
    setIsSubmitting(true)

    try {
      const updatedUser = await usersApi.updateCurrentUser({
        name,
      })

      setUser(updatedUser)
      setName(updatedUser.name)

      setFeedback({
        type: 'success',
        message: 'Perfil atualizado com sucesso.',
      })
    } catch {
      setFeedback({
        type: 'error',
        message: 'Não foi possível atualizar o perfil.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <Loading message="Carregando perfil..." />
  }

  if (error || !user) {
    return <Alert variant="error">Não foi possível carregar o perfil.</Alert>
  }

  return (
    <>
      <PageHeader
        section="Conta"
        title="Meu Perfil"
        description="Gerencie suas informações pessoais."
      />

      <Card className="mt-8">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center">
            <UserAvatar name={user.name} avatarUrl={user.avatarUrl} />

            <h2 className="mt-4 text-lg font-semibold">{user.name}</h2>
          </div>

          <div className="mt-6 grid gap-4">
            <label>
              <span className="text-sm text-(--color-text)">Nome</span>

              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={fieldClassName}
              />
            </label>

            <label>
              <span className="text-sm text-(--color-text)">E-mail</span>

              <input
                value={user.email}
                readOnly
                className={`${fieldClassName} cursor-not-allowed opacity-70`}
              />
            </label>
          </div>

          {feedback && (
            <Alert variant={feedback.type} className="mt-4">
              {feedback.message}
            </Alert>
          )}

          <div className="mt-6 flex border-t border-(--color-border) pt-4">
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </div>
        </form>
      </Card>
    </>
  )
}

export default ProfilePage
