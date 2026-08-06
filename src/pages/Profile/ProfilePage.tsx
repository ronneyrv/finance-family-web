import { useEffect, useState, useRef } from 'react'
import type { SubmitEvent, ChangeEvent } from 'react'

import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { usersApi } from '../../features/users/api/usersApi'
import { PageHeader } from '../../components/ui/page'
import { fieldClassName } from '../../components/ui/forms/fieldClass'
import { useCurrentUser } from '../../features/users/hooks/useCurrentUser'
import Alert from '../../components/ui/alert/Alert'
import Loading from '../../components/ui/loading/Loading'
import UserAvatar from '../../features/users/components/UserAvatar'
import ChangePasswordForm from '../../features/users/components/ChangePasswordForm'

function ProfilePage() {
  const { user, loading, updateUser } = useCurrentUser()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState('')

  const [isUploading, setIsUploading] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  useEffect(() => {
    if (user) {
      setName(user.name)
    }
  }, [user])

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

      updateUser(updatedUser)
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

  async function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file || !user) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setFeedback({
        type: 'error',
        message: 'Selecione um arquivo de imagem válido.',
      })

      event.target.value = ''

      return
    }

    setIsUploading(true)
    setFeedback(null)

    try {
      const formData = new FormData()

      formData.append('file', file)

      const updatedUser = await usersApi.uploadAvatar(formData)

      updateUser(updatedUser)
      setName(updatedUser.name)

      setFeedback({
        type: 'success',
        message: 'Avatar atualizado com sucesso.',
      })
    } catch {
      setFeedback({
        type: 'error',
        message: 'Não foi possível atualizar o avatar.',
      })
    } finally {
      setIsUploading(false)

      event.target.value = ''
    }
  }

  function handleAvatarClick() {
    if (!isUploading) {
      fileInputRef.current?.click()
    }
  }

  if (loading) {
    return <Loading message="Carregando perfil..." />
  }

  if (!user) {
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
            <input
              ref={fileInputRef}
              hidden
              type="file"
              accept="image/*"
              aria-label="Selecionar foto de perfil"
              onChange={handleAvatarChange}
            />

            <UserAvatar
              name={user.name}
              avatarUrl={user.avatarUrl}
              editable={!isUploading}
              onClick={handleAvatarClick}
            />

            <h2 className="mt-4 text-lg font-semibold">{user.name}</h2>
          </div>

          <div className="mt-6 grid gap-4">
            <label htmlFor="name">
              <span className="text-sm text-(--color-text)">Nome</span>

              <input
                id="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={fieldClassName}
              />
            </label>

            <label htmlFor="email">
              <span className="text-sm text-(--color-text)">E-mail</span>

              <input
                id="email"
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

      <ChangePasswordForm />
    </>
  )
}

export default ProfilePage
