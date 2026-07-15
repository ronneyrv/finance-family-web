import { useEffect, useState } from 'react'

import { Loading } from '../../components/ui/loading'
import { ApiError } from '../../lib/api/apiError'
import { PageHeader } from '../../components/ui/page'
import { dashboardApi } from '../../features/dashboard/api/dashboardApi'
import CategoryExpenses from '../../features/dashboard/components/CategoryExpenses'
import MonthlySummaryChart from '../../features/dashboard/components/MonthlySummaryChart'
import DashboardSummaryCards from '../../features/dashboard/components/DashboardSummaryCards'
import MonthlyProjectionChart from '../../features/dashboard/components/MonthlyProjectionChart'
import type {
  CategoryExpenseResponse,
  DashboardSummaryResponse,
  MonthlyProjectionResponse,
  MonthlySummaryResponse,
} from '../../features/dashboard/model/dashboardTypes'

function DashboardPage() {
  const currentYear = new Date().getFullYear()

  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null)
  const [categoryExpenses, setCategoryExpenses] = useState<CategoryExpenseResponse[]>([])

  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummaryResponse[]>([])
  const [monthlyProjection, setMonthlyProjection] = useState<MonthlyProjectionResponse[]>([])

  const [isOverviewLoading, setIsOverviewLoading] = useState(true)
  const [isYearlyDataLoading, setIsYearlyDataLoading] = useState(true)

  const [overviewError, setOverviewError] = useState<string | null>(null)
  const [yearlyDataError, setYearlyDataError] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    async function loadOverview() {
      try {
        setOverviewError(null)

        const [summaryResponse, categoryExpensesResponse] = await Promise.all([
          dashboardApi.getSummary(),
          dashboardApi.getExpensesByCategory(),
        ])

        if (!isCancelled) {
          setSummary(summaryResponse)
          setCategoryExpenses(categoryExpensesResponse)
        }
      } catch (error) {
        if (isCancelled) {
          return
        }

        if (error instanceof ApiError) {
          setOverviewError(error.message)
        } else {
          setOverviewError('Não foi possível carregar os dados financeiros.')
        }
      } finally {
        if (!isCancelled) {
          setIsOverviewLoading(false)
        }
      }
    }

    void loadOverview()

    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    let isCancelled = false

    async function loadYearlyData() {
      setIsYearlyDataLoading(true)
      setYearlyDataError(null)

      try {
        const [monthlySummaryResponse, monthlyProjectionResponse] = await Promise.all([
          dashboardApi.getMonthlySummary(selectedYear),
          dashboardApi.getProjection(selectedYear),
        ])

        if (!isCancelled) {
          setMonthlySummary(monthlySummaryResponse)
          setMonthlyProjection(monthlyProjectionResponse)
        }
      } catch (error) {
        if (isCancelled) {
          return
        }

        if (error instanceof ApiError) {
          setYearlyDataError(error.message)
        } else {
          setYearlyDataError('Não foi possível carregar os dados do período.')
        }
      } finally {
        if (!isCancelled) {
          setIsYearlyDataLoading(false)
        }
      }
    }

    void loadYearlyData()

    return () => {
      isCancelled = true
    }
  }, [selectedYear])

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          section="Visão geral"
          title="Dashboard"
          description="Acompanhe sua posição financeira e a evolução das suas movimentações."
        />

        <div className="flex items-center gap-3">
          <label htmlFor="dashboard-year" className="text-sm font-medium text-(--color-text-muted)">
            Ano
          </label>

          <select
            id="dashboard-year"
            value={selectedYear}
            onChange={(event) => setSelectedYear(Number(event.target.value))}
            className="h-10 w-24 rounded-xl border border-(--color-border) bg-(--color-surface) px-3 text-sm text-(--color-text) transition focus:border-(--color-primary) focus:outline-none"
          >
            ...
          </select>
        </div>
      </div>

      <div className="mt-8">
        {isOverviewLoading && <Loading message="Carregando resumo financeiro..." />}

        {overviewError && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
            {overviewError}
          </div>
        )}

        {!isOverviewLoading && !overviewError && summary && (
          <DashboardSummaryCards summary={summary} />
        )}

        {!isOverviewLoading && !overviewError && (
          <div className="mt-6">
            <CategoryExpenses expenses={categoryExpenses} />
          </div>
        )}

        {isYearlyDataLoading && <Loading message="Carregando dados do período..." />}

        {yearlyDataError && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
            {yearlyDataError}
          </div>
        )}

        {!isYearlyDataLoading && !yearlyDataError && (
          <>
            <div className="mt-6">
              <MonthlySummaryChart data={monthlySummary} />
            </div>

            <div className="mt-6">
              <MonthlyProjectionChart data={monthlyProjection} />
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default DashboardPage
