"use client"

import { useState } from "react"
import { DataTable } from "../../../components/table/Data-table"
import { columns as designationColumns } from "./columns"
import { type Designation } from "../../types/types"
import { Button } from "../../../components/ui/button"
import { Plus } from "lucide-react"
import { EditDesignationForm } from "@/src/components/forms/editDesignationForm"
import { DesignationDetailsModal } from "../../../components/ViewDetails/designation-details"
import { DesignationForm } from "../../../components/forms/addDesignation"
import { Dialog, DialogContent } from "../../../components/ui/dialog"

type Props = {
  designations: Designation[]
}

export function DesignationTable({ designations }: Props) {
  const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null)
  const [designationToEdit, setDesignationToEdit] = useState<Designation | null>(null)

  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const handleViewDesignation = (designationId: string) => {
    const designation = designations.find(d => d.designation_id === designationId)
    if (designation) {
      setSelectedDesignation(designation)
      setIsViewOpen(true)
    }
  }

  const handleEditDesignation = (designationId: string) => {
    const designation = designations.find(d => d.designation_id === designationId)
    if (designation) {
      setDesignationToEdit(designation)
      setIsEditOpen(true)
    }
  }

  return (
    <div className="border p-5 rounded-md">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="font-bold text-2xl mb-2">Designations Management</h1>
          <p className="text-gray-700">
            Manage job positions and role information
          </p>
        </div>

        <Button variant="outline" onClick={() => setIsAddOpen(true)}>
          <Plus /> Add New Designation
        </Button>
      </div>

      {/* Table */}
      <DataTable
        columns={designationColumns(handleViewDesignation, handleEditDesignation)}
        data={designations}
        filterColumn="title"
        showStatusFilter
      />

      {/* View modal */}
      <DesignationDetailsModal
        designation={selectedDesignation}
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
      />

      {/* Add modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl">
          <DesignationForm
            onSubmit={(data) => {
              console.log("Designation data:", data)
              setIsAddOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          {designationToEdit && (
            <EditDesignationForm
              designation={designationToEdit}
              onSubmit={(data) => {
                console.log("Updated designation data:", data)
                setIsEditOpen(false)
                setDesignationToEdit(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
