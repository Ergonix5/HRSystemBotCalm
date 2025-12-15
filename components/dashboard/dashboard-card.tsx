import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface DashboardCardProps {
  title: string
  value: string | number
  subtitle?: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: LucideIcon
}

export function DashboardCard({ 
  title, 
  value, 
  subtitle, 
  change, 
  changeType = 'neutral',
  icon: Icon
}: DashboardCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-green-600'
      case 'negative': return 'text-red-600'
      default: return 'text-muted-foreground'
    }
  }

  return (
    <Card className="bg-linear-to-br from-gray-50/80 via-white/60 to-gray-100/40 backdrop-blur-sm border-gray-200/50 transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-600">
            {title}
          </CardTitle>
          {Icon && <Icon className="h-5 w-5 text-gray-700 opacity-80" />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{value}</div>
        {subtitle && (
          <p className="text-xl text-gray-500 mt-1">{subtitle}</p>
        )}
        {change && (
          <p className={`text-xs mt-1 font-medium ${getChangeColor()}`}>{change}</p>
        )}
      </CardContent>
    </Card>
  )
}