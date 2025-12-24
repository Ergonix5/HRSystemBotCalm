"use client"

import { useEffect, useState } from "react"
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
}

export function CompanyTable({ organizations }: Props) {
  const [loading, setLoading] = useState(false)

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [companyToEdit, setCompanyToEdit] = useState<Company | null>(null)

  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const handleViewCompany = (companyId: string) => {
    const company = organizations.find(o => o.company_id === companyId)
    if (company) {
      setSelectedCompany(company)
      setIsViewOpen(true)
    }
  }

  const handleEditCompany = (companyId: string) => {
    const company = organizations.find(o => o.company_id === companyId)
    if (company) {
      setCompanyToEdit(company)
      setIsEditOpen(true)
    }
  }

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

      {/* View modal */}
      <CompanyDetailsModal
        company={selectedCompany}
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
      />

      {/* Add modal */}
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

      {/* Edit modal */}
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
