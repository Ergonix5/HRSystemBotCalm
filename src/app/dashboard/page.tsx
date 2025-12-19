import { DashboardCard } from "../../components/dashboard/dashboard-card"
import StudentAttendanceChart from "../../components/dashboard/employee-attendance-chart"
import { CompanyDistributionChart } from "../../components/dashboard/company-distribution-chart"
import { EmployeeOverview } from "../../components/dashboard/employee-overview"
import { PendingLeaveRequests } from "../../components/dashboard/pending-leave-requests"
import { RecentActivities } from "../../components/dashboard/pending-recent-activities"
import { Button } from "../../components/ui/button"
import { Users, UserCheck, Calendar, Briefcase, Building, Megaphone, Clock, FileText, Eye } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="p-6 space-y-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Employees"
          value="58"
          subtitle="Active: 53"
          change="+8 this month"
          changeType="positive"
          icon={Users}
        />
        
        <DashboardCard
          title="Today's Attendance"
          value="92.3%"
          subtitle="48 / 52 Present"
          change="+2.5% vs yesterday"
          changeType="positive"
          icon={UserCheck}
        />
        
        <DashboardCard
          title="Pending Leaves"
          value="3"
          subtitle="7 Total Requests"
          change="4 approved today"
          changeType="neutral"
          icon={Calendar}
        />
        
        <DashboardCard
          title="Active Roles"
          value="7"
          subtitle="1 Inactive"
          change="18 permissions"
          changeType="neutral"
          icon={Briefcase}
        />
        
        <DashboardCard
          title="Companies"
          value="12"
          subtitle="9 Active"
          change="+2 this quarter"
          changeType="positive"
          icon={Building}
        />
        
        <DashboardCard
          title="Announcements"
          value="6"
          subtitle="5 Active"
          change="2 high priority"
          changeType="neutral"
          icon={Megaphone}
        />
        
        <DashboardCard
          title="Avg Work Hours"
          value="8.7h"
          subtitle="This Week"
          change="+0.3h vs last week"
          changeType="positive"
          icon={Clock}
        />
        
        <DashboardCard
          title="Report Logs"
          value="156"
          subtitle="Last 7 Days"
          change=""
          changeType="neutral"
          icon={FileText}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StudentAttendanceChart />
        <CompanyDistributionChart />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <EmployeeOverview />
        </div>
        <div className="space-y-4">
          <PendingLeaveRequests />
        </div>
        <div className="space-y-4">
          <RecentActivities />
        </div>
      </div>
    </div>
  )
}