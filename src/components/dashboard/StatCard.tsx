import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
}

export function StatCard({ title, value, subtitle, change, changeType = "neutral" }: StatCardProps) {
  const changeColor = {
    positive: "text-green-600",
    negative: "text-red-600", 
    neutral: "text-gray-600"
  }[changeType]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        {change && <p className={`text-xs mt-1 ${changeColor}`}>{change}</p>}
      </CardContent>
    </Card>
  )
}