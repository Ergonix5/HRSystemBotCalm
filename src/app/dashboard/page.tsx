import { DashboardCard } from "../../components/dashboard/dashboard-card"
import StudentAttendanceChart from "../../components/dashboard/employee-attendance-chart"
import { Users, UserCheck, Calendar, Briefcase, Building, Megaphone, Clock, FileText } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StudentAttendanceChart />
      </div>
    </div>
  )
}