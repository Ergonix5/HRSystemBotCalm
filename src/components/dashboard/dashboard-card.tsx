import {
  TrendingUp,
  TrendingDown,
  Minus,
  LucideIcon,
} from "lucide-react"

import {
  Card,
  CardHeader,
  CardContent,
} from "../../components/ui/card"

interface DashboardCardProps {
  title: string
  value: string | number
  subtitle?: string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon?: LucideIcon
}

export function DashboardCard({
  title,
  value,
  subtitle,
  change,
  changeType = "neutral",
  icon: Icon,
}: DashboardCardProps) {
  const getChangeStyles = (): {
    color: string
    bg: string
    indicator: LucideIcon
  } => {
    switch (changeType) {
      case "positive":
        return {
          color: "text-emerald-600",
          bg: "bg-emerald-50 dark:bg-emerald-500/10",
          indicator: TrendingUp,
        }
      case "negative":
        return {
          color: "text-red-600",
          bg: "bg-red-50 dark:bg-red-500/10",
          indicator: TrendingDown,
        }
      default:
        return {
          color: "text-slate-500",
          bg: "bg-slate-100 dark:bg-slate-500/10",
          indicator: Minus,
        }
    }
  }

  const style = getChangeStyles()
  const StatusIndicator = style.indicator

  return (
    <Card className="group relative overflow-hidden rounded-sm border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-800 dark:bg-black">
      {/* Left Brand Accent */}
      <div className="absolute left-0 top-0 h-full w-1 bg-[#B91434]" />

    
      <CardHeader className=" pb-0 pl-7">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              {title}
            </p>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {value}
            </h2>
          </div>

          {Icon && (
            <div className="flex h-11 w-11 items-center justify-center     dark:border-neutral-800 dark:bg-neutral-900">
              <Icon size={20} strokeWidth={2} />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className=" pr-5 ">
        <div className="flex flex-col gap-1.5">
          {subtitle && (
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              {subtitle}
            </p>
          )}

          {change && (
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight ${style.bg} ${style.color}`}
              >
                <StatusIndicator size={12} strokeWidth={3} />
                {change}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
