import { useEffect, useState } from "react"
import api from "../../services/api"
import colors from "tailwindcss/colors"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    LabelList
} from "recharts"

const monthLabel = {
    1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr",
    5: "May", 6: "Jun", 7: "Jul", 8: "Aug",
    9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"
}

export default function CustomerLifetimeValueChart({ year }) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!year) return
        setLoading(true)

        // Always fetch annual data (YTD) for this chart
        const params = new URLSearchParams({ year, type: 'ytd' })

        api.get(`/kpi/customer-lifetime-value?${params.toString()}`).then(res => {
            const rawData = res.data.data || []
            const formatted = rawData.map(item => ({
                month: monthLabel[item.bulan] || item.month,
                value: Number(item.clv || item.total_clv || item.value || 0)
            }))
            setData(formatted)
        }).catch(() => setData([]))
            .finally(() => setLoading(false))
    }, [year])

    const formatValue = (val) => {
        if (val >= 1e9) return (val / 1e9).toFixed(0) + "bn"
        if (val >= 1e6) return (val / 1e6).toFixed(0) + "m"
        return val
    }

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow h-full flex items-center justify-center">
                <p className="text-slate-400 font-medium animate-pulse">Loading...</p>
            </div>
        )
    }

    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-gray-800 text-lg">Customer Lifetime Value</h2>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-400 font-medium italic">Data Not Available</p>
                </div>
            </div>
        )
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white rounded-2xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] border-none px-4 py-3" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    <p className="font-bold text-slate-800 mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full bg-cyan-500"
                            />
                            <span className="text-slate-500 text-sm font-medium">
                                Value:
                            </span>
                            <span className="text-slate-800 text-sm font-bold">
                                Rp {entry.value.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            )
        }
        return null
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-gray-800 text-lg">Customer Lifetime Value</h2>
                <span className="text-xs font-medium bg-cyan-50 text-cyan-600 px-2.5 py-1 rounded-full">
                    CLV Growth
                </span>
            </div>

            <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorInd" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={colors.cyan[500]} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={colors.cyan[500]} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.slate[100]} />
                    <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: colors.slate[400], fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis hide />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ stroke: colors.slate[300], strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke={colors.cyan[500]}
                        fill="url(#colorInd)"
                        strokeWidth={3}
                    >
                        <LabelList
                            dataKey="value"
                            position="top"
                            offset={15}
                            formatter={formatValue}
                            fill={colors.slate[500]}
                            fontSize={12}
                            fontWeight={600}
                        />
                    </Area>
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

