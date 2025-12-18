

import { DataTable } from "../../../components/table/Data-table"
import { columns as designationColumns } from "../designation/columns" 
import { type Designation } from "../../types/types"


// Mock designation data
const designationData: Designation[] = [
  { designation_id: "DES_001", title: "Software Engineer", company_name: "Ergonix", description: "Develops and maintains software applications", status: "active" },
  { designation_id: "DES_002", title: "Project Manager", company_name: "Techify", description: "Oversees project delivery and timelines", status: "inactive" },
  { designation_id: "DES_003", title: "Civil Engineer", company_name: "BuildPro", description: "Plans and supervises construction projects", status: "active" },
  { designation_id: "DES_004", title: "Sustainability Analyst", company_name: "GreenLeaf", description: "Analyzes and implements sustainable practices", status: "active" },
  { designation_id: "DES_005", title: "Data Analyst", company_name: "DataFlow", description: "Interprets and analyzes data to drive business decisions", status: "inactive" },
  { designation_id: "DES_006", title: "UI/UX Designer", company_name: "Ergonix", description: "Designs user interfaces and improves user experience", status: "active" },
  { designation_id: "DES_007", title: "QA Engineer", company_name: "Techify", description: "Tests software to ensure quality and reliability", status: "active" },
  { designation_id: "DES_008", title: "Site Supervisor", company_name: "BuildPro", description: "Manages construction site operations", status: "inactive" },
  { designation_id: "DES_009", title: "Product Manager", company_name: "GreenLeaf", description: "Defines product strategy and roadmap", status: "active" },
  { designation_id: "DES_010", title: "Business Analyst", company_name: "DataFlow", description: "Analyzes business requirements and processes", status: "active" },
]

export default function DesignationPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Designations</h1>

      {/* table */}
      <DataTable columns={designationColumns} data={designationData} filterColumn="title" showStatusFilter={true} showCompanyFilter={true} />
    </div>
  )
}
