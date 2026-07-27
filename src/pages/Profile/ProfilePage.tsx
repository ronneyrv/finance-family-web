import { useEffect, useState } from 'react'

import { Card } from '../../components/ui/card'
import { Alert } from '../../components/ui/alert'
import { Loading } from '../../components/ui/loading'
import { usersApi } from '../../features/users/api/usersApi'
import { PageHeader } from '../../components/ui/page'

import UserAvatar from '../../features/users/components/UserAvatar'
import type { CurrentUserResponse } from '../../features/users/model/currentUserTypes'
import { Button } from '../../components/ui/button'
import { fieldClassName } from '../../components/ui/forms/fieldClass'

function ProfilePage() {
  const [user, setUser] = useState<CurrentUserResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [name, setName] = useState('')

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

      <Card className="mt-6">
        <div className="flex flex-col items-center gap-4">
          <UserAvatar name={user.name} avatarUrl={user.avatarUrl} />

          <label>
            <span className="text-sm text-(--color-text)">Nome</span>

            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={fieldClassName}
            />
          </label>

<label>
            <span className="text-sm text-(--color-text)">E-mail</span>

            <input value={user.email} readOnly className={fieldClassName} />
          </label>
          

          <Button type="button" disabled>
            Salvar alterações
          </Button>
        </div>
      </Card>
    </>
  )
}

export default ProfilePage
