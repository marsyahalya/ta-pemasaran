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
    Legend,
    LabelList
} from "recharts"

const monthLabel = {
    1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr",
    5: "May", 6: "Jun", 7: "Jul", 8: "Aug",
    9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"
}

export default function SalesVsScalingRevenueChart({ year }) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!year) return
        setLoading(true)

        const params = new URLSearchParams({ year, type: 'ytd' })

        api.get(`/kpi/sales-vs-scaling-revenue?${params.toString()}`).then(res => {
            const rawData = res.data.data || res.data || []
            const dataToMap = Array.isArray(rawData) ? rawData : (rawData.data || [])

            const formatted = dataToMap.map(item => ({
                month: monthLabel[item.bulan] || item.bulan,
                sales: Number(item.sales),
                revenue_scalling: Number(item.revenue_scalling)
            }))
            setData(formatted)
        }).catch(() => setData([]))
            .finally(() => setLoading(false))
    }, [year])

    const formatValue = (val) => {
        if (val >= 1e9) return (val / 1e9).toFixed(0) + "bn"
        if (val >= 1e6) return (val / 1e6).toFixed(0) + "m"
        return val.toLocaleString()
    }

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow h-[420px] flex items-center justify-center">
                <p className="text-slate-400 font-medium animate-pulse">Loading...</p>
            </div>
        )
    }

    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow h-[420px] flex flex-col">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="font-bold text-gray-800 text-lg">Sales vs Scaling Revenue</h2>
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
                        <div key={index} className="flex items-center gap-2 mb-1">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-slate-500 text-sm font-medium">
                                {entry.name}:
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
            <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold text-gray-800 text-lg">Sales vs Scaling Revenue</h2>
            </div>

            <ResponsiveContainer width="100%" height={360}>
                <AreaChart data={data} margin={{ top: 30, right: 20, left: 20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="gradSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={colors.indigo[600]} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={colors.indigo[600]} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradScaling" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={colors.sky[500]} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={colors.sky[500]} stopOpacity={0} />
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
                    <Legend
                        wrapperStyle={{ paddingTop: "20px", fontSize: "12px", fontFamily: "Roboto, sans-serif" }}
                        iconType="circle"
                    />

                    <Area
                        type="monotone"
                        dataKey="sales"
                        name="Sales"
                        stroke={colors.indigo[500]}
                        fill="url(#gradSales)"
                        strokeWidth={3}
                        dot={{ r: 0 }}
                        activeDot={{ r: 6, fill: colors.white, stroke: colors.indigo[500], strokeWidth: 3 }}
                    >
                        <LabelList
                            dataKey="sales"
                            position="top"
                            offset={15}
                            formatter={formatValue}
                            fill={colors.indigo[500]}
                            fontSize={12}
                            fontWeight={600}
                        />
                    </Area>

                    <Area
                        type="monotone"
                        dataKey="revenue_scalling"
                        name="Scaling Revenue"
                        stroke={colors.sky[500]}
                        fill="url(#gradScaling)"
                        strokeWidth={3}
                        dot={{ r: 0 }}
                        activeDot={{ r: 6, fill: colors.white, stroke: colors.sky[500], strokeWidth: 3 }}
                    >
                        <LabelList
                            dataKey="revenue_scalling"
                            position="top"
                            offset={15}
                            formatter={formatValue}
                            fill={colors.sky[500]}
                            fontSize={12}
                            fontWeight={600}
                        />
                    </Area>
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
