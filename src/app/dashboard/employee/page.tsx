
"use client"

import { DataTable } from "../../../components/table/Data-table"
import { columns  } from "./colomns"
import { type Employee } from "../../types/types"


// Mock employee data
const employeesData: Employee[] = [
  { employee_id: "EMP_001", name: "Alice Johnson", email: "alice@ergonix.com", phone: "123-456-7890", company_name: "Ergonix", designation: "Software Engineer", join_date: "2022-01-15", status: "active" },
  { employee_id: "EMP_002", name: "Bob Smith", email: "bob@techify.com", phone: "234-567-8901", company_name: "Techify", designation: "Project Manager", join_date: "2021-03-20", status: "inactive" },
  { employee_id: "EMP_003", name: "Charlie Lee", email: "charlie@buildpro.com", phone: "345-678-9012", company_name: "BuildPro", designation: "Civil Engineer", join_date: "2020-07-10", status: "active" },
  { employee_id: "EMP_004", name: "Diana Green", email: "diana@greenleaf.com", phone: "456-789-0123", company_name: "GreenLeaf", designation: "Sustainability Analyst", join_date: "2019-11-05", status: "active" },
  { employee_id: "EMP_005", name: "Ethan Brown", email: "ethan@dataflow.com", phone: "567-890-1234", company_name: "DataFlow", designation: "Data Analyst", join_date: "2023-02-28", status: "inactive" },
  { employee_id: "EMP_006", name: "Fiona White", email: "fiona@ergonix.com", phone: "678-901-2345", company_name: "Ergonix", designation: "UI/UX Designer", join_date: "2022-06-12", status: "active" },
  { employee_id: "EMP_007", name: "George King", email: "george@techify.com", phone: "789-012-3456", company_name: "Techify", designation: "QA Engineer", join_date: "2021-09-15", status: "active" },
  { employee_id: "EMP_008", name: "Hannah Scott", email: "hannah@buildpro.com", phone: "890-123-4567", company_name: "BuildPro", designation: "Site Supervisor", join_date: "2020-12-01", status: "inactive" },
  { employee_id: "EMP_009", name: "Ian Wright", email: "ian@greenleaf.com", phone: "901-234-5678", company_name: "GreenLeaf", designation: "Product Manager", join_date: "2019-04-18", status: "active" },
  { employee_id: "EMP_010", name: "Julia Adams", email: "julia@dataflow.com", phone: "012-345-6789", company_name: "DataFlow", designation: "Business Analyst", join_date: "2023-08-22", status: "active" },
]

export default function EmployeesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Employees</h1>

      {/* Employees Table */}
      <DataTable
        columns={columns}
        data={employeesData}
        filterColumn="name"
        showStatusFilter={true}
        showCompanyFilter={true}
      />
    </div>
  )
}
