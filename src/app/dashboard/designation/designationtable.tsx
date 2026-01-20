"use client"

import { useState } from "react"
import { DataTable } from "../../../components/table/Data-table"
import { columns as designationColumns } from "./columns"
import { type Designation } from "../../types/types"
import { Button } from "../../../components/ui/button"
import { Plus } from "lucide-react"
import { createDesignation, updateDesignation, deleteDesignation } from "../../../services/designation.service"
import { EditDesignationForm } from "@/src/components/forms/editDesignationForm"
import { DesignationDetailsModal } from "../../../components/ViewDetails/designation-details"
import { DesignationForm } from "../../../components/forms/addDesignation"

type Props = {
  designations: Designation[]
}

export function DesignationTable({ designations }: Props) {
  const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null) //track the currently selected designation for viewing
  const [designationToEdit, setDesignationToEdit] = useState<Designation | null>(null) //track the designation being edited


  //control viewdialog visibility
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)


  //open the view  with the selected designation
  const handleViewDesignation = (designation_id: string) => {
    const designation = designations.find(d => d.designation_id === designation_id)
    if (designation) {
      setSelectedDesignation(designation)
      setIsViewOpen(true)
    }
  }

  //edit modal with the selected designation
  const handleEditDesignation = (designation_id: string) => {
    const designation = designations.find(d => d.designation_id === designation_id)
    if (designation) {
      setDesignationToEdit(designation)
      setIsEditOpen(true)
    }
  }

  //delete a specific designation
  const handleDeleteDesignation = async (designation_id: string) => {
    const designation = designations.find(d => d.designation_id === designation_id)
    if (!designation) return

    if (window.confirm(`Are you sure you want to delete ${designation.title}?`)) {
      try {
        await deleteDesignation(designation._id)
        window.location.reload()
      } catch (error) {
        console.error("Failed to delete designation:", error)
        alert("Failed to delete designation. Please try again.")
      }
    }
  }

  return (
    <div className="border p-5 rounded-md">
      {/* Header */}
        <div className="space-y-6 mb-10">
  <div className="flex flex-wrap items-center justify-between gap-4">
    <div className="space-y-1">
      <h1 className="text-3xl font-bold text-gray-900">Designations Management</h1>
      <p className="text-gray-500 text-md italic">
        Manage job positions and role information
      </p>
    </div>

  
      
      <Button 
        variant="outline"
        onClick={() => setIsAddOpen(true)}
        className="border-[#B91434] text-[#B91434] hover:bg-[#B91434] hover:text-white transition-colors"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Designation
      </Button>
    
  </div>
  <hr className="border-gray-100" />
</div>
      {/* Table */}
      <DataTable
        columns={designationColumns(handleViewDesignation, handleEditDesignation, handleDeleteDesignation)}
        data={designations}
        filterColumn="title"
        showStatusFilter
      />

      {/* viewing a designation*/}
      <DesignationDetailsModal
        designation={selectedDesignation}
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
      />

      {/* adding a new designation */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <DesignationForm
            onSubmit={async (data) => {
              try {
                await createDesignation(data)
                setIsAddOpen(false)
                window.location.reload()
              } catch (error) {
                console.error("Failed to create designation:", error)
                alert("Failed to create designation. Please try again.")
              }
            }}
            onClose={() => setIsAddOpen(false)}
          />
        </div>
      )}

      {/* editing an existing designation */}
      {isEditOpen && designationToEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <EditDesignationForm
            designation={designationToEdit}
            onSubmit={async (data) => {
              try {
                await updateDesignation(designationToEdit._id, data)
                setIsEditOpen(false)
                setDesignationToEdit(null)
                window.location.reload()
              } catch (error) {
                console.error("Failed to update designation:", error)
                alert("Failed to update designation. Please try again.")
              }
            }}
            onClose={() => setIsEditOpen(false)}
          />
        </div>
      )}
    </div>
  )
}
