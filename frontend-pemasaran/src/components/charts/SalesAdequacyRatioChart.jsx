import { useEffect, useState } from "react"
import api from "../../services/api"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Cell
} from "recharts"

export default function SalesAdequacyRatioChart({ year, filterType, month }) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!year) return
        setLoading(true)

        const params = new URLSearchParams({ year, type: filterType })
        if (filterType === 'mtd') params.append('month', month)

        api.get(`/kpi/sales-adequacy-ratio?${params.toString()}`).then(res => {
            const rawData = res.data.data || []
            const formatted = rawData.map(item => ({
                name: item.funnel || item.product_name, // Fallback
                value: Number(item.sales_adequacy_value)
            })).sort((a, b) => b.value - a.value)

            setData(formatted)
        }).catch(() => setData([]))
            .finally(() => setLoading(false))
    }, [year, filterType, month])

    const formatValue = (val) => {
        if (val >= 1e9) return (val / 1e9).toFixed(1) + "bn"
        if (val >= 1e6) return (val / 1e6).toFixed(1) + "m"
        return val.toLocaleString()
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
                <div className="mb-6">
                    <h2 className="font-bold text-gray-800 text-lg">Sales Adequacy Ratio</h2>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-400 font-medium italic">Data Not Available</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow h-full">
            <div className="mb-6">
                <h2 className="font-bold text-gray-800 text-lg">Sales Adequacy Ratio</h2>
            </div>

            <ResponsiveContainer width="100%" height={320}>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                    barCategoryGap={15}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis
                        dataKey="name"
                        type="category"
                        width={40}
                        tick={{ fontSize: 13, fontWeight: 600, fill: "#475569" }}
                        interval={0}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: '#f8fafc' }}
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-white rounded-2xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] border-none px-4 py-3" style={{ fontFamily: 'Roboto, sans-serif' }}>
                                        <p className="font-bold text-slate-800 mb-2">{label}</p>
                                        {payload.map((entry, index) => (
                                            <div key={index} className="flex items-center gap-2 mb-1">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: entry.color || `rgba(139, 92, 246, ${1 - index * 0.15})` }}
                                                />
                                                <span className="text-slate-500 text-sm font-medium">
                                                    Ratio:
                                                </span>
                                                <span className="text-slate-800 text-sm font-bold">
                                                    {formatValue(entry.value)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Bar dataKey="value" radius={[0, 12, 12, 0]} barSize={28}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`rgba(139, 92, 246, ${1 - index * 0.15})`} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

