import { useEffect, useState } from 'react'

import { dashboardApi } from '../../features/dashboard/api/dashboardApi'
import CategoryExpenses from '../../features/dashboard/components/CategoryExpenses'
import DashboardSummaryCards from '../../features/dashboard/components/DashboardSummaryCards'
import MonthlyProjectionChart from '../../features/dashboard/components/MonthlyProjectionChart'
import MonthlySummaryChart from '../../features/dashboard/components/MonthlySummaryChart'
import type {
  CategoryExpenseResponse,
  DashboardSummaryResponse,
  MonthlyProjectionResponse,
  MonthlySummaryResponse,
} from '../../features/dashboard/model/dashboardTypes'
import { ApiError } from '../../lib/api/apiError'

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
      <div>
        <p className="text-sm font-medium text-emerald-400">Visão geral</p>

        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Dashboard</h1>

        <p className="mt-2 text-sm text-slate-400">
          Acompanhe sua posição financeira e a evolução das suas movimentações.
        </p>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <label htmlFor="dashboard-year" className="text-sm text-slate-400">
          Ano
        </label>

        <select
          id="dashboard-year"
          value={selectedYear}
          onChange={(event) => setSelectedYear(Number(event.target.value))}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
        >
          {Array.from({ length: 5 }, (_, index) => currentYear - index).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8">
        {isOverviewLoading && <p className="text-slate-400">Carregando resumo financeiro...</p>}

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

        {isYearlyDataLoading && (
          <p className="mt-6 text-slate-400">Carregando dados do período...</p>
        )}

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
