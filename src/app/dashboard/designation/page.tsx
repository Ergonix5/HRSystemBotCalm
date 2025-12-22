"use client"

import { useState, useEffect } from "react"
import { DataTable } from "../../../components/table/Data-table"
import { columns as designationColumns } from "../designation/columns"
import { type Designation } from "../../types/types"
import { Button } from "../../../components/ui/button"
import { Plus } from "lucide-react"
import { DesignationDetailsModal } from "../../../components/ViewDetails/designation-details"
import { DesignationForm } from "../../../components/forms/addDesignation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog"
import { getDesignations } from "@/src/lib/api"
// import { api } from "../../../lib/api"

export default function DesignationPage() {
  const [designations, setDesignations] = useState<Designation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)

  // useEffect(() => {
  //   const fetchDesignations = async () => {
  //     try {
  //       const data = await api.designations.getAll()
  //       setDesignationData(data)
  //     } catch (error) {
  //       console.error('Error fetching designations:', error)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchDesignations()
  // }, [])


  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const data = await getDesignations()
      setDesignations(data)
      setLoading(false)
    }

    loadData()
  }, [])

  if (loading) {
    return <div>Loading designations...</div>
  }


  const handleViewDesignation = (designationId: string) => {
    const designation = designations.find(des => des.designation_id === designationId)
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
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">Loading designations...</div>
          </div>
        ) : (
          <DataTable columns={designationColumns(handleViewDesignation)} data={designations} filterColumn="title" showStatusFilter={true} />
        )}
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
