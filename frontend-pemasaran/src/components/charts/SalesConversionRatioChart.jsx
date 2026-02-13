import { useEffect, useState } from "react"
import api from "../../services/api"
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Label
} from "recharts"

export default function SalesConversionRatioChart({ year, filterType, month }) {
    const [ratio, setRatio] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!year) return
        setLoading(true)

        const params = new URLSearchParams({ year, type: filterType })
        if (filterType === 'mtd') params.append('month', month)

        api.get(`/kpi/sales-conversion-ratio?${params.toString()}`).then(res => {
            const rawData = res.data.data
            let val = null;

            if (typeof rawData === 'object' && rawData !== null && !Array.isArray(rawData)) {
                val = Number(rawData.sales_conversion_ratio || 0)
            } else if (Array.isArray(rawData) && rawData.length > 0) {
                val = Number(rawData[0].sales_conversion_ratio || 0)
            }

            setRatio(val)
        }).catch(() => setRatio(null))
            .finally(() => setLoading(false))
    }, [year, filterType, month])

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow h-full flex items-center justify-center">
                <p className="text-slate-400 font-medium animate-pulse">Loading...</p>
            </div>
        )
    }

    if (ratio === null) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow h-full flex flex-col justify-center items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -z-10 opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl -z-10 opacity-60"></div>

                <h2 className="font-bold text-gray-800 text-lg mb-4 text-center w-full z-10">Sales Conversion</h2>
                <div className="flex-1 flex items-center justify-center z-10">
                    <p className="text-gray-400 font-medium italic">Data Not Available</p>
                </div>
            </div>
        )
    }

    const data = [
        { name: "Ratio", value: ratio },
        { name: "Remaining", value: (100 - ratio) > 0 ? (100 - ratio) : 0 }
    ]

    const trackData = [{ value: 100 }]

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow h-full flex flex-col justify-center items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -z-10 opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl -z-10 opacity-60"></div>

            <h2 className="font-bold text-gray-800 text-lg mb-4 text-center w-full z-10">Sales Conversion</h2>

            <div className="h-[260px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <defs>
                            <linearGradient id="gradConversion" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#8b5cf6" />
                                <stop offset="50%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#ec4899" />
                            </linearGradient>
                            <filter id="shadow" height="130%">
                                <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="rgba(99, 102, 241, 0.3)" />
                            </filter>
                        </defs>

                        <Pie
                            data={trackData}
                            cx="50%"
                            cy="50%"
                            innerRadius={85}
                            outerRadius={105}
                            dataKey="value"
                            fill="#f1f5f9"
                            stroke="none"
                            isAnimationActive={false}
                        />

                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={85}
                            outerRadius={105}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={50}
                            paddingAngle={0}
                        >
                            <Cell fill="url(#gradConversion)" filter="url(#shadow)" />
                            <Cell fill="transparent" />
                        </Pie>

                        <text
                            x="50%"
                            y="45%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="text-4xl font-black fill-gray-800"
                            style={{ fontFamily: 'Roboto, sans-serif', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))' }}
                        >
                            {Number(ratio).toFixed(1)}%
                        </text>
                        <text
                            x="50%"
                            y="62%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="text-sm font-semibold fill-gray-400 tracking-wide uppercase"
                        >
                            Success Rate
                        </text>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
