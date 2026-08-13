import { useEffect, useState } from 'react'

import { Loading } from '../../components/ui/loading'
import { PageHeader } from '../../components/ui/page'
import { dashboardApi } from '../../features/dashboard/api/dashboardApi'
import { getApiErrorMessage } from '../../lib/api/getApiErrorMessage'
import AnnualCreditCardTrendChart from '../../features/dashboard/components/AnnualCreditCardTrendChart'
import CashFlowChart from '../../features/dashboard/components/CashFlowChart'
import CategoryExpenses from '../../features/dashboard/components/CategoryExpenses'
import CreditCardInvoices from '../../features/dashboard/components/CreditCardInvoices'
import DashboardSummaryCards from '../../features/dashboard/components/DashboardSummaryCards'
import FinancialHealthCard from '../../features/dashboard/components/FinancialHealthCard'
import FinancialHealthChart from '../../features/dashboard/components/FinancialHealthChart'
import IncomeCommitmentChart from '../../features/dashboard/components/IncomeCommitmentChart'
import MonthlyProjectionChart from '../../features/dashboard/components/MonthlyProjectionChart'
import MonthlyResultChart from '../../features/dashboard/components/MonthlyResultChart'
import type {
  CashFlowResponse,
  CategoryExpenseResponse,
  CreditCardExpenseTrendResponse,
  CreditCardInvoiceSummaryResponse,
  CumulativeResultResponse,
  DashboardFiltersResponse,
  DashboardSummaryResponse,
  FinancialHealthResponse,
  IncomeCommitmentResponse,
  MonthlyProjectionResponse,
  MonthlySummaryResponse,
} from '../../features/dashboard/model/dashboardTypes'

function DashboardPage() {
  const [filters, setFilters] = useState<DashboardFiltersResponse | null>(null)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null)
  const [incomeCommitment, setIncomeCommitment] = useState<IncomeCommitmentResponse | null>(null)
  const [financialHealth, setFinancialHealth] = useState<FinancialHealthResponse | null>(null)
  const [overviewError, setOverviewError] = useState<string | null>(null)
  const [yearlyDataError, setYearlyDataError] = useState<string | null>(null)

  const [categoryExpenses, setCategoryExpenses] = useState<CategoryExpenseResponse[]>([])
  const [creditCardInvoices, setCreditCardInvoices] = useState<CreditCardInvoiceSummaryResponse[]>(
    [],
  )
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummaryResponse[]>([])
  const [familyCumulativeResult, setFamilyCumulativeResult] = useState<CumulativeResultResponse[]>(
    [],
  )
  const [myCumulativeResult, setMyCumulativeResult] = useState<CumulativeResultResponse[]>([])
  const [cashFlow, setCashFlow] = useState<CashFlowResponse[]>([])
  const [monthlyProjection, setMonthlyProjection] = useState<MonthlyProjectionResponse[]>([])
  const [creditCardTrend, setCreditCardTrend] = useState<CreditCardExpenseTrendResponse[]>([])

  const [isOverviewLoading, setIsOverviewLoading] = useState(true)
  const [isYearlyDataLoading, setIsYearlyDataLoading] = useState(false)

  useEffect(() => {
    let isCancelled = false

    async function loadOverview() {
      try {
        setOverviewError(null)

        const [
          summaryResponse,
          incomeCommitmentResponse,
          financialHealthResponse,
          categoryExpensesResponse,
          filtersResponse,
          creditCardInvoicesResponse,
        ] = await Promise.all([
          dashboardApi.getSummary(),
          dashboardApi.getIncomeCommitment(),
          dashboardApi.getFinancialHealth(),
          dashboardApi.getExpensesByCategory(),
          dashboardApi.getFilters(),
          dashboardApi.getCreditCardInvoices(),
        ])

        if (!isCancelled) {
          setSummary(summaryResponse)
          setIncomeCommitment(incomeCommitmentResponse)
          setFinancialHealth(financialHealthResponse)
          setCategoryExpenses(categoryExpensesResponse)
          setFilters(filtersResponse)
          setSelectedYear(filtersResponse.defaultYear)
          setCreditCardInvoices(creditCardInvoicesResponse)
        }
      } catch (error) {
        if (isCancelled) {
          return
        }

        setOverviewError(
          getApiErrorMessage(error, 'Não foi possível carregar os dados financeiros.'),
        )
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
        const [
          monthlySummaryResponse,
          familyCumulativeResultResponse,
          myCumulativeResultResponse,
          cashFlowResponse,
          monthlyProjectionResponse,
          creditCardTrendResponse,
        ] = await Promise.all([
          dashboardApi.getMonthlySummary(year),
          dashboardApi.getCumulativeResult(year),
          dashboardApi.getMyCumulativeResult(year),
          dashboardApi.getCashFlow(year),
          dashboardApi.getProjection(year),
          dashboardApi.getCreditCardTrend(year),
        ])

        if (!isCancelled) {
          setMonthlySummary(monthlySummaryResponse)
          setFamilyCumulativeResult(familyCumulativeResultResponse)
          setMyCumulativeResult(myCumulativeResultResponse)
          setCashFlow(cashFlowResponse)
          setMonthlyProjection(monthlyProjectionResponse)
          setCreditCardTrend(creditCardTrendResponse)
        }
      } catch (error) {
        if (isCancelled) {
          return
        }

        setYearlyDataError(
          getApiErrorMessage(error, 'Não foi possível carregar os dados do período.'),
        )
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
      <PageHeader
        section={
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
        }
        title="Dashboard"
        description="Acompanhe a evolução financeira da sua família."
      />

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

            <div className="mt-6 grid gap-6 lg:h-100 lg:grid-cols-12">
              <div className="lg:col-span-3 lg:min-h-0">
                <CreditCardInvoices invoices={creditCardInvoices} />
              </div>

              <div className="lg:col-span-3 lg:min-h-0">
                <CategoryExpenses expenses={categoryExpenses} />
              </div>

              <div className="lg:col-span-6 lg:min-h-0">
                <AnnualCreditCardTrendChart data={creditCardTrend} />
              </div>
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
              <MonthlyResultChart data={monthlySummary} />
            </div>

            <div className="mt-6">
              <FinancialHealthChart
                data={myCumulativeResult}
                title="Minha evolução financeira"
                description="Entradas, despesas e evolução do resultado acumulado."
                scope="individual"
              />
            </div>

            <div className="mt-6">
              <FinancialHealthChart
                data={familyCumulativeResult}
                title="Evolução financeira da família"
                description="Entradas, despesas e evolução do resultado acumulado da família."
                scope="family"
              />
            </div>

            <div className="mt-6">
              <CashFlowChart data={cashFlow} />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-stretch">
              {financialHealth && (
                <div className="lg:col-span-3 [&>div]:h-full">
                  <FinancialHealthCard data={financialHealth} />
                </div>
              )}

              {incomeCommitment && (
                <div className="lg:col-span-3 [&>div]:h-full">
                  <IncomeCommitmentChart data={incomeCommitment} />
                </div>
              )}

              <div className="lg:col-span-6 [&>div]:h-full">
                <MonthlyProjectionChart data={monthlyProjection} />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default DashboardPage
