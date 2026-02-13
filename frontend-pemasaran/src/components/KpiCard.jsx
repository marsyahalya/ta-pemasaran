import { TrendingUp, DollarSign, Activity, Users, ShoppingBag } from "lucide-react"

export default function KpiCard({ title, value }) {
    const getIcon = () => {
        switch (title) {
            case "Total Sales":
                return {
                    icon: ShoppingBag,
                    bg: "bg-gradient-to-br from-blue-500 to-blue-600",
                    shadow: "shadow-blue-200"
                }
            case "Total Revenue":
                return {
                    icon: DollarSign,
                    bg: "bg-gradient-to-br from-emerald-500 to-teal-600",
                    shadow: "shadow-teal-200"
                }
            case "Order Compliance":
                return {
                    icon: Activity,
                    bg: "bg-gradient-to-br from-purple-500 to-indigo-600",
                    shadow: "shadow-indigo-200"
                }
            case "Churn Rate":
                return {
                    icon: Users,
                    bg: "bg-gradient-to-br from-rose-500 to-pink-600",
                    shadow: "shadow-rose-200"
                }
            default:
                return {
                    icon: TrendingUp,
                    bg: "bg-gradient-to-br from-gray-500 to-gray-600",
                    shadow: "shadow-gray-200"
                }
        }
    }

    const { icon: Icon, bg, shadow } = getIcon()

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-800 tracking-tight">{value || "-"}</h3>
                </div>
                <div className={`p-3 rounded-xl shadow-lg ${bg} ${shadow} text-white`}>
                    <Icon size={24} strokeWidth={2} />
                </div>
            </div>
        </div>
    )
}
