import { DataTable } from "../../../components/table/Data-table"
import { columns } from "../company/columns"
import { type Company } from "../../types/types"
import { DashboardCard } from "../../../components/dashboard/dashboard-card"
import { Building2, CheckCircle, XCircle } from "lucide-react"

const data: Company[] = [
  { company_id: "COM_001", company_name: "Ergonix", company_description: "Software Solutions", status: "active" },
  { company_id: "COM_002", company_name: "Techify", company_description: "Tech Consulting", status: "inactive" },
  { company_id: "COM_003", company_name: "BuildPro", company_description: "Construction Services", status: "active" },
  { company_id: "COM_004", company_name: "GreenLeaf", company_description: "Sustainable Products", status: "active" },
  { company_id: "COM_005", company_name: "DataFlow", company_description: "Data Analytics", status: "inactive" },
]
export default function Company() {
  return (
    <div className="p-6 ">
      <h1 className="text-3xl font-bold mb-6">Companies</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
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

      {/* table */}
     
        <DataTable columns={columns} data={data} filterColumn="company_name" showStatusFilter={true} />

    </div>
  )
}