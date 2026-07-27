import { useEffect, useState } from 'react'

import { Card } from '../../components/ui/card'
import { Alert } from '../../components/ui/alert'
import { Loading } from '../../components/ui/loading'
import { usersApi } from '../../features/users/api/usersApi'
import { PageHeader } from '../../components/ui/page'

import UserAvatar from '../../features/users/components/UserAvatar'
import type { CurrentUserResponse } from '../../features/users/model/currentUserTypes'

function ProfilePage() {
  const [user, setUser] = useState<CurrentUserResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await usersApi.getCurrentUser()
        setUser(response)
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

          <div className="text-center">
            <h2 className="text-xl font-semibold">{user.name}</h2>

            <p className="text-(--color-text-muted)">{user.email}</p>
          </div>
        </div>
      </Card>
    </>
  )
}

export default ProfilePage
