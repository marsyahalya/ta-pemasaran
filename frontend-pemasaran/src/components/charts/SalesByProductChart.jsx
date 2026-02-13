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

export default function SalesByProductChart({ year }) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!year) return
        setLoading(true)

        // Always fetch annual data (YTD) for this chart
        const params = new URLSearchParams({ year, type: 'ytd' })

        api.get(`/kpi/sales-by-product?${params.toString()}`)
            .then(res => {
                const rawData = res.data.data || []
                const formatted = rawData.map(item => ({
                    ...item,
                    product_name: item.product_name,
                    total_sales: Number(item.total_sales)
                }))
                    .sort((a, b) => b.total_sales - a.total_sales)

                setData(formatted)
            })
            .catch(() => setData([]))
            .finally(() => setLoading(false))
    }, [year])

    const chartHeight = Math.max(data.length * 60, 400);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow h-full">
            <h2 className="font-bold text-gray-800 text-lg mb-4">Sales by Product</h2>

            {loading ? (
                <div className="h-[400px] flex items-center justify-center text-slate-400 font-medium">
                    Loading...
                </div>
            ) : data.length > 0 ? (
                <div className="overflow-y-auto pr-2 custom-scrollbar" style={{ height: '400px' }}>
                    <div style={{ height: `${chartHeight}px`, minHeight: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                layout="vertical"
                                margin={{ left: 10, right: 30, top: 10, bottom: 10 }}
                                barCategoryGap={20}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />

                                <XAxis
                                    type="number"
                                    tickFormatter={(v) => (v / 1e9).toFixed(1) + "M"}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                                    orientation="top"
                                    dy={10}
                                />

                                <YAxis
                                    dataKey="product_name"
                                    type="category"
                                    width={140}
                                    tick={{ fill: "#475569", fontSize: 13, fontWeight: 600 }}
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
                                                                style={{ backgroundColor: entry.color || (index === 0 ? "#6366f1" : "#818cf8") }}
                                                            />
                                                            <span className="text-slate-500 text-sm font-medium">
                                                                Total Sales:
                                                            </span>
                                                            <span className="text-slate-800 text-sm font-bold">
                                                                Rp {entry.value.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />

                                <Bar
                                    dataKey="total_sales"
                                    radius={[0, 12, 12, 0]}
                                    barSize={20}
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? "#6366f1" : "#818cf8"} fillOpacity={1 - (index * 0.05)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            ) : (
                <div className="h-[400px] flex items-center justify-center text-slate-400 font-medium">
                    Data Not Available
                </div>
            )}
        </div>
    )
}
