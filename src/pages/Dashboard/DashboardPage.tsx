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
  CreditCardExpenseTrendResponse,
  CreditCardInvoiceSummaryResponse,
  DashboardFiltersResponse,
  DashboardSummaryResponse,
  MonthlyProjectionResponse,
  MonthlySummaryResponse,
} from '../../features/dashboard/model/dashboardTypes'
import CreditCardInvoices from '../../features/dashboard/components/CreditCardInvoices'
import AnnualCreditCardTrendChart from '../../features/dashboard/components/AnnualCreditCardTrendChart'

function DashboardPage() {
  const [filters, setFilters] = useState<DashboardFiltersResponse | null>(null)

  const [selectedYear, setSelectedYear] = useState<number | null>(null)

  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null)
  const [categoryExpenses, setCategoryExpenses] = useState<CategoryExpenseResponse[]>([])

  const [creditCardInvoices, setCreditCardInvoices] = useState<CreditCardInvoiceSummaryResponse[]>(
    [],
  )

  const [monthlySummary, setMonthlySummary] = useState<MonthlySummaryResponse[]>([])
  const [monthlyProjection, setMonthlyProjection] = useState<MonthlyProjectionResponse[]>([])

  const [creditCardTrend, setCreditCardTrend] = useState<CreditCardExpenseTrendResponse[]>([])

  const [isOverviewLoading, setIsOverviewLoading] = useState(true)
  const [isYearlyDataLoading, setIsYearlyDataLoading] = useState(false)

  const [overviewError, setOverviewError] = useState<string | null>(null)
  const [yearlyDataError, setYearlyDataError] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    async function loadOverview() {
      try {
        setOverviewError(null)

        const [
          summaryResponse,
          categoryExpensesResponse,
          filtersResponse,
          creditCardInvoicesResponse,
        ] = await Promise.all([
          dashboardApi.getSummary(),
          dashboardApi.getExpensesByCategory(),
          dashboardApi.getFilters(),
          dashboardApi.getCreditCardInvoices(),
        ])

        if (!isCancelled) {
          setSummary(summaryResponse)
          setCategoryExpenses(categoryExpensesResponse)
          setFilters(filtersResponse)
          setSelectedYear(filtersResponse.defaultYear)
          setCreditCardInvoices(creditCardInvoicesResponse)
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
    if (selectedYear === null) {
      return
    }

    const year = selectedYear
    let isCancelled = false

    async function loadYearlyData() {
      setIsYearlyDataLoading(true)
      setYearlyDataError(null)

      try {
        const [monthlySummaryResponse, monthlyProjectionResponse, creditCardTrendResponse] =
          await Promise.all([
            dashboardApi.getMonthlySummary(year),
            dashboardApi.getProjection(year),
            dashboardApi.getCreditCardTrend(year),
          ])

        if (!isCancelled) {
          setMonthlySummary(monthlySummaryResponse)
          setMonthlyProjection(monthlyProjectionResponse)
          setCreditCardTrend(creditCardTrendResponse)
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

        <div className="flex flex-col items-start gap-2 sm:items-end">
          <label
            htmlFor="dashboard-year"
            className="text-xs font-medium uppercase tracking-wide text-(--color-text-muted)"
          >
            Ano
          </label>

          <select
            id="dashboard-year"
            value={selectedYear ?? ''}
            onChange={(event) => setSelectedYear(Number(event.target.value))}
            disabled={!filters}
            className="h-10 w-32 rounded-xl border border-(--color-border) bg-(--color-surface) px-3 text-sm text-(--color-text) transition focus:border-(--color-primary) focus:outline-none"
          >
            {filters &&
              filters.years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
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
          <>
            <DashboardSummaryCards summary={summary} />

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <CreditCardInvoices invoices={creditCardInvoices} />

              <CategoryExpenses expenses={categoryExpenses} />
            </div>
          </>
        )}

        {isYearlyDataLoading && <Loading message="Carregando dados do período..." />}

        {yearlyDataError && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
            {yearlyDataError}
          </div>
        )}

        {selectedYear !== null && !isYearlyDataLoading && !yearlyDataError && (
          <>
            <div className="mt-6">
              <MonthlySummaryChart data={monthlySummary} />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <AnnualCreditCardTrendChart data={creditCardTrend} />

              <MonthlyProjectionChart data={monthlyProjection} />
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default DashboardPage
