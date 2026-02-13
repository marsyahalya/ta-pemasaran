import { useEffect, useState } from "react"
import api from "../services/api"
import KpiCard from "../components/KpiCard"
import SalesByProductChart from "../components/charts/SalesByProductChart"
import RevenueBySegmentChart from "../components/charts/RevenueBySegmentChart"
import SalesCycleLengthChart from "../components/charts/SalesCycleLengthChart"
import CustomerLifetimeValueChart from "../components/charts/CustomerLifetimeValueChart"
import SalesAdequacyRatioChart from "../components/charts/SalesAdequacyRatioChart"
import SalesConversionRatioChart from "../components/charts/SalesConversionRatioChart"
import SalesVsScalingRevenueChart from "../components/charts/SalesVsScalingRevenueChart"
import { LayoutDashboard } from "lucide-react"

export default function Dashboard() {
  const [sales, setSales] = useState(null)
  const [revenue, setRevenue] = useState(null)
  const [orderCompliance, setOrderCompliance] = useState(null)
  const [churnRate, setChurnRate] = useState(null)

  const [year, setYear] = useState(2025)
  const [years, setYears] = useState([])

  const [filterType, setFilterType] = useState('ytd')
  const [month, setMonth] = useState(1)
  const [months, setMonths] = useState([])

  useEffect(() => {
    api.get("/filter/years").then(res => {
      const availableYears = res.data.data || []
      setYears(availableYears)
      if (availableYears.length > 0 && !availableYears.includes(year)) {
        setYear(2025) // Default to 2025 as requested
      }
    })

    // Hardcode months to ensure dropdown is populated correctly (1-12)
    // Matches the backend table structure where bulan is 1..12
    const allMonths = Array.from({ length: 12 }, (_, i) => i + 1)
    setMonths(allMonths)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    params.append('year', year)
    params.append('type', filterType)
    if (filterType === 'mtd') {
      params.append('month', month)
    }
    const queryString = params.toString()

    api.get(`/kpi/total-sales?${queryString}`)
      .then(r => setSales(r.data.data.total_sales))
      .catch(() => setSales(null))

    api.get(`/kpi/total-revenue?${queryString}`)
      .then(r => setRevenue(r.data.data.total_revenue))
      .catch(() => setRevenue(null))

    api.get(`/kpi/order-compliance?${queryString}`)
      .then(r => setOrderCompliance(r.data.data.order_compliance))
      .catch(() => setOrderCompliance(null))

    api.get(`/kpi/churn-rate?${queryString}`)
      .then(r => setChurnRate(r.data.data.churn_rate))
      .catch(() => setChurnRate(null))
  }, [year, filterType, month])

  const formatCurrency = (val) => {
    if (!val || val === 0 || isNaN(val)) return "-"
    return "Rp " + Number(val).toLocaleString()
  }

  const formatPercentage = (val) => {
    if (!val || val === 0 || isNaN(val)) return "-"
    return (val * 100).toFixed(2) + "%"
  }

  const formatNumber = (val) => {
    if (!val || val === 0 || isNaN(val)) return "-"
    return Number(val).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-10">

      <div className="max-w-[1600px] mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <span className="p-2 bg-indigo-600 rounded-lg text-white">
                <LayoutDashboard size={24} />
              </span>
              Marketing Dashboard
            </h1>
            <p className="text-slate-500 mt-1 ml-1">Overview of your business performance</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setFilterType('ytd')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${filterType === 'ytd'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
                  }`}
              >
                YTD
              </button>
              <button
                onClick={() => setFilterType('mtd')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${filterType === 'mtd'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
                  }`}
              >
                MTD
              </button>
            </div>

            {/* Year Selector */}
            <div className="relative">
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="appearance-none bg-transparent pl-4 pr-10 py-1.5 text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer hover:bg-slate-50 rounded-md border-l border-slate-200"
              >
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
                {years.length === 0 && <option value={2025}>2025</option>}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            {/* Month Selector (Only for MTD) */}
            {filterType === 'mtd' && (
              <div className="relative border-l border-slate-200">
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="appearance-none bg-transparent pl-4 pr-8 py-1.5 text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer hover:bg-slate-50 rounded-md"
                >
                  {months.map(m => (
                    <option key={m.id || m} value={m.id || m}>
                      {m.name || new Date(0, m - 1).toLocaleString('default', { month: 'short' })}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard title="Total Sales" value={formatCurrency(sales)} />
          <KpiCard title="Total Revenue" value={formatCurrency(revenue)} />
          <KpiCard title="Order Compliance" value={formatNumber(orderCompliance)} />
          <KpiCard title="Churn Rate" value={formatPercentage(churnRate)} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          <div className="lg:col-span-3">
            <SalesByProductChart year={year} />
          </div>
          <div className="lg:col-span-3">
            <RevenueBySegmentChart year={year} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          <div className="lg:col-span-3">
            <SalesCycleLengthChart year={year} />
          </div>
          <div className="lg:col-span-3">
            <CustomerLifetimeValueChart year={year} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          <div className="lg:col-span-4">
            <SalesAdequacyRatioChart year={year} filterType={filterType} month={month} />
          </div>
          <div className="lg:col-span-2">
            <SalesConversionRatioChart year={year} filterType={filterType} month={month} />
          </div>
        </div>

        <div className="w-full">
          <SalesVsScalingRevenueChart year={year} />
        </div>
      </div>
    </div>
  )
}
