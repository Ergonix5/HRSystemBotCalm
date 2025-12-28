"use client"

import {  useState } from "react"
import { DataTable } from "../../../components/table/Data-table"
import { columns } from "./columns"
import { type Company } from "../../types/types"
import { Spinner } from "@/src/components/ui/spinner"
import { Button } from "../../../components/ui/button"
import { CompanyDetailsModal } from "../../../components/ViewDetails/company-details-"
import { CompanyForm } from "../../../components/forms/addcompany"
import { EditCompanyForm } from "../../../components/forms/editCompanyForm"
import { Dialog, DialogContent } from "../../../components/ui/dialog"
import { Plus } from "lucide-react"


type Props = {
  organizations: Company[]
  onRefresh?: () => void
}// Optional callback to refresh parent data


export function CompanyTable({ organizations }: Props) {
    //loading state for operations like API request
  const [loading, setLoading] = useState(false)

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)//viewing a company
  const [companyToEdit, setCompanyToEdit] = useState<Company | null>(null)//editing a company


  //visibility add view edit states
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

    // Open the view dialog for the selected company
  const handleViewCompany = (companyId: string) => {
    const company = organizations.find(o => o.company_id === companyId)
    if (company) {
      setSelectedCompany(company)
      setIsViewOpen(true)
    }
  }

  // Open the vedit  dialog for the selected company
  const handleEditCompany = (companyId: string) => {
    const company = organizations.find(o => o.company_id === companyId)
    if (company) {
      setCompanyToEdit(company)
      setIsEditOpen(true)
    }
  }

  //loading spinner if the component perform
  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="border p-5 rounded-md">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="font-bold text-2xl mb-2">Organizations Management</h1>
          <p className="text-gray-700">
            Manage organizations information and settings
          </p>
        </div>

        <Button variant="outline" onClick={() => setIsAddOpen(true)}>
          <Plus /> Add New Company
        </Button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns(handleViewCompany, handleEditCompany)}
        data={organizations}
        filterColumn="company_name"
        showStatusFilter
      />

      {/* view company details */}
      <CompanyDetailsModal
        company={selectedCompany}
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
      />

      {/* Add new company  */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl">
          <CompanyForm
            onSubmit={(data) => {
              console.log("Company data:", data)
              setIsAddOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit company details */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          {companyToEdit && (
            <EditCompanyForm
              company={companyToEdit}
              onSubmit={(data) => {
                console.log("Updated company data:", data)
                setIsEditOpen(false)
                setCompanyToEdit(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
