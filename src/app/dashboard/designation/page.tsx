"use client"

import { useState } from "react"
import { DataTable } from "../../../components/table/Data-table"
import { columns as designationColumns } from "../designation/columns" 
import { type Designation } from "../../types/types"
import { Button } from "../../../components/ui/button"
import { Plus } from "lucide-react"
import { DesignationDetailsModal } from "../../../components/ViewDetails/designation-details"
import {DesignationForm} from "../../../components/forms/addDesignation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog"

// Mock designation data
const designationData: Designation[] = [
  { designation_id: "DES_001", title: "Software Engineer", company_name: "Ergonix", description: "Develops and maintains software applications", status: "Active" },
  { designation_id: "DES_002", title: "Project Manager", company_name: "Techify", description: "Oversees project delivery and timelines", status: "Inactive" },
  { designation_id: "DES_003", title: "Civil Engineer", company_name: "BuildPro", description: "Plans and supervises construction projects", status: "Active" },
  { designation_id: "DES_004", title: "Sustainability Analyst", company_name: "GreenLeaf", description: "Analyzes and implements sustainable practices", status: "Active" },
  { designation_id: "DES_005", title: "Data Analyst", company_name: "DataFlow", description: "Interprets and analyzes data to drive business decisions", status: "Inactive" },
  { designation_id: "DES_006", title: "UI/UX Designer", company_name: "Ergonix", description: "Designs user interfaces and improves user experience", status: "Active" },
  { designation_id: "DES_007", title: "QA Engineer", company_name: "Techify", description: "Tests software to ensure quality and reliability", status: "Active" },
  { designation_id: "DES_008", title: "Site Supervisor", company_name: "BuildPro", description: "Manages construction site operations", status: "Inactive" },
  { designation_id: "DES_009", title: "Product Manager", company_name: "GreenLeaf", description: "Defines product strategy and roadmap", status: "Active" },
  { designation_id: "DES_010", title: "Business Analyst", company_name: "DataFlow", description: "Analyzes business requirements and processes", status: "Active" },
]

export default function DesignationPage() {
  const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleViewDesignation = (designationId: string) => {
    const designation = designationData.find(des => des.designation_id === designationId)
    if (designation) {
      setSelectedDesignation(designation)
      setIsModalOpen(true)
    }
  }

  return (
    <div className="p-6">
     

      {/* table */}
      <div className="border p-5 rounded-md"> 
<div className="flex justify-between mb-6">
        <div>
          <h1 className="font-bold text-2xl mb-2">Designations Management</h1>
          <p className="text-gray-700">Manage job positions and role information</p>
        </div>
<Button
  className="mt-4"
  variant="outline"
  onClick={() => setIsFormOpen(true)} // <-- Add this
>
  <Plus /> Add New Designation
</Button>      </div>  
      {/* data table */}
<DataTable columns={designationColumns(handleViewDesignation)} data={designationData} filterColumn="title" showStatusFilter={true} />
</div>

      <DesignationDetailsModal
        designation={selectedDesignation}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

       <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogContent className="max-w-2xl">
              
                <DesignationForm
                  onSubmit={(data) => {
                    console.log('designation data:', data)
                    setIsFormOpen(false)
                  }}
                  onCancel={() => setIsFormOpen(false)}
                />
              </DialogContent>
            </Dialog>
    </div>
  )
}
