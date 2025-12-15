import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
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
    <Card data-slot="card" className="bg-linear-to-t from-primary/5 to-card shadow-xs dark:bg-card dark:from-card dark:to-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        {change && (
          <p className={`text-xs mt-1 font-medium ${getChangeColor()}`}>{change}</p>
        )}
      </CardContent>
    </Card>
  )
}