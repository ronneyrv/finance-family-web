import { useEffect, useState } from 'react'

import { Alert } from '../../components/ui/alert'
import { goalsApi } from '../../features/goals/api/goalsApi'
import { ApiError } from '../../lib/api/apiError'
import { PageHeader } from '../../components/ui/page'
import { ConfirmDialog } from '../../components/ui/dialog'
import type { GoalResponse } from '../../features/goals/model/goalTypes'
import GoalForm from '../../features/goals/components/GoalForm'
import GoalList from '../../features/goals/components/GoalList'

function GoalsPage() {
  const [goals, setGoals] = useState<GoalResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [goalToEdit, setGoalToEdit] = useState<GoalResponse | null>(null)
  const [goalToDelete, setGoalToDelete] = useState<GoalResponse | null>(null)

  const [isDeleting, setIsDeleting] = useState(false)

  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    async function loadGoals() {
      try {
        setErrorMessage(null)

        const response = await goalsApi.findAll()

        if (!isCancelled) {
          setGoals(response)
        }
      } catch (error) {
        if (isCancelled) {
          return
        }

        if (error instanceof ApiError) {
          setErrorMessage(error.message)
        } else {
          setErrorMessage('Não foi possível carregar as metas.')
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadGoals()

    return () => {
      isCancelled = true
    }
  }, [])

  function handleGoalCreated(createdGoal: GoalResponse) {
    setGoals((currentGoals) => [...currentGoals, createdGoal])
  }

  function handleGoalUpdated(updatedGoal: GoalResponse) {
    setGoals((currentGoals) =>
      currentGoals.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal)),
    )

    setGoalToEdit(null)
  }

  async function handleDeleteGoal() {
    if (!goalToDelete) {
      return
    }

    try {
      setIsDeleting(true)
      setDeleteErrorMessage(null)

      await goalsApi.delete(goalToDelete.id)

      setGoals((currentGoals) => currentGoals.filter((goal) => goal.id !== goalToDelete.id))

      if (goalToEdit?.id === goalToDelete.id) {
        setGoalToEdit(null)
      }

      setGoalToDelete(null)
    } catch (error) {
      if (error instanceof ApiError) {
        setDeleteErrorMessage(error.message)
      } else {
        setDeleteErrorMessage('Não foi possível excluir a meta.')
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <section>
      <PageHeader
        section="Planejamento"
        title="Metas financeiras"
        description="Defina objetivos financeiros e acompanhe o progresso de cada meta."
      />

      <GoalForm
        key={goalToEdit?.id ?? 'new'}
        goal={goalToEdit ?? undefined}
        onCreated={handleGoalCreated}
        onUpdated={handleGoalUpdated}
        onCancelEdit={() => setGoalToEdit(null)}
      />

      {isLoading && <p className="mt-8 text-(--color-text-muted)">Carregando metas...</p>}

      {errorMessage && <Alert className="mt-8">{errorMessage}</Alert>}

      {!isLoading && !errorMessage && (
        <GoalList goals={goals} onEdit={setGoalToEdit} onDelete={setGoalToDelete} />
      )}

      <ConfirmDialog
        open={goalToDelete !== null}
        title="Excluir meta"
        description={
          <>
            Tem certeza que deseja excluir a meta{' '}
            <strong className="text-(--color-text)">{goalToDelete?.name}</strong>? Esta ação não
            poderá ser desfeita.
          </>
        }
        confirmLabel="Excluir meta"
        confirmLoadingLabel="Excluindo..."
        confirmVariant="danger"
        isLoading={isDeleting}
        errorMessage={deleteErrorMessage}
        onCancel={() => {
          if (!isDeleting) {
            setDeleteErrorMessage(null)
            setGoalToDelete(null)
          }
        }}
        onConfirm={() => void handleDeleteGoal()}
      />
    </section>
  )
}

export default GoalsPage
