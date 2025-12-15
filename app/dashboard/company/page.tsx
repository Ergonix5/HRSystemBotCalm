import { DashboardCard } from "@/components/dashboard/dashboard-card"
import { Building2, CheckCircle, XCircle } from "lucide-react"

export default function Company() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Companies</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Companies"
          value="4"
          icon={Building2}
        />
        
        <DashboardCard
          title="Active"
          value="3"
          subtitle="Active"
          icon={CheckCircle}
        />
        
        <DashboardCard
          title="Inactive"
          value="1"
          subtitle="Inactive"
          change="Recently Updated"
          changeType="neutral"
          icon={XCircle}
        />
      </div>
    </div>
  )
}