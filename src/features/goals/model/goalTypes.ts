export type GoalRequest = {
  name: string
  targetAmount: number
  targetDate?: string
}

export type GoalResponse = {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  remainingAmount: number
  progress: number
  targetDate: string | null
}
