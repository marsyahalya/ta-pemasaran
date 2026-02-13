import { useEffect, useState } from "react"
import api from "../../services/api"
import colors from "tailwindcss/colors"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"

export default function RevenueBySegmentChart({ year }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!year) return
    setLoading(true)

    const params = new URLSearchParams({ year, type: 'ytd' })

    api.get(`/kpi/revenue-by-segment?${params.toString()}`)
      .then(res => {
        const rawData = res.data.data || []
        const formatted = rawData.map(item => ({
          segment: item.segment,
          sustain: Number(item.sustain),
          scaling: Number(item.scalling)
        }))
        setData(formatted)
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }, [year])

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
          <h2 className="font-bold text-gray-800 text-lg">Revenue by Segment</h2>
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow h-full">
      <div className="mb-6">
        <h2 className="font-bold text-gray-800 text-lg">Revenue by Segment</h2>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} barGap={4}>
          <XAxis
            dataKey="segment"
            axisLine={false}
            tickLine={false}
            tick={{ fill: colors.slate[400], fontSize: 12, fontWeight: 500 }}
            dy={10}
          />
          <YAxis
            domain={[0, 5e11]}
            ticks={[0, 1e11, 2e11, 3e11, 4e11, 5e11]}
            tickFormatter={(v) => (v / 1e9).toFixed(0) + " M"}
            axisLine={false}
            tickLine={false}
            tick={{ fill: colors.slate[400], fontSize: 12 }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: colors.slate[50] }}
          />
          <Legend
            iconType="circle"
            wrapperStyle={{ paddingTop: "20px", fontSize: "12px", fontFamily: "Roboto, sans-serif" }}
          />

          <Bar dataKey="sustain" name="Sustain" stackId="a" fill={colors.blue[500]} radius={[0, 0, 12, 12]} barSize={40} />
          <Bar dataKey="scaling" name="Scaling" stackId="a" fill={colors.blue[300]} radius={[12, 12, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
