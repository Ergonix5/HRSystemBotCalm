"use client";

import { useState } from "react";
import { DataTable } from "../../../components/table/Data-table";
import { columns } from "./columns";
import { type Company } from "../../types/types";
import { Spinner } from "@/src/components/ui/spinner";
import { Button } from "../../../components/ui/button";
import { CompanyDetailsModal } from "../../../components/ViewDetails/company-details-";
import { CompanyForm } from "../../../components/forms/addcompany";

import { EditCompanyForm } from "../../../components/forms/editCompanyForm";
import { Dialog, DialogContent } from "../../../components/ui/dialog";
import { Plus, Search } from "lucide-react";
import { PermissionCheck } from "../../../components/PermissionCheck";
import { createOrganization, updateOrganization } from "../../../lib/api";

type Props = {
  organizations: Company[];
  onRefresh?: () => void | Promise<void>; // Callback to refresh data
};

export function CompanyTable({ organizations, onRefresh }: Props)
{
  //loading state for operations like API request
  const [loading, setLoading] = useState(false);

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null); //viewing a company
  const [companyToEdit, setCompanyToEdit] = useState<Company | null>(null); //editing a company

  //visibility add view edit states
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Open the view dialog for the selected company
  const handleViewCompany = (companyId: string) =>
  {
    const company = organizations.find((o) => o.company_id === companyId);
    if (company)
    {
      setSelectedCompany(company);
      setIsViewOpen(true);
    }
  };

  // Open the vedit  dialog for the selected company
  const handleEditCompany = (companyId: string) =>
  {
    const company = organizations.find((o) => o.company_id === companyId);
    if (company)
    {
      setCompanyToEdit(company);
      setIsEditOpen(true);
    }
  };

  //delete a specific company
  const handleDeleteCompany = async (companyId: string) =>
  {
    const company = organizations.find(o => o.company_id === companyId)
    if (!company) return

    if (window.confirm(`Are you sure you want to delete ${company.company_name}?`))
    {
      try
      {
        await deleteOrganization(company._id)
        if (onRefresh)
        {
          await onRefresh(); // Refresh data instead of full page reload
        }
      } catch (error)
      {
        console.error("Failed to delete company:", error)
        alert("Failed to delete company. Please try again.")
      }
    }
  }

  //loading spinner if the component perform
  if (loading)
  {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="border  p-5 rounded-md">
      {/* Header */}
      <div className="space-y-6 mb-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">
              Organizations Management
            </h1>
            <p className="text-gray-500 text-md italic">
              Manage organizations information and settings
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#B91434]" />
        <input 
          type="text" 
          placeholder="Search companies..." 
          className="pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#B91434]/20 focus:border-[#B91434] transition-all"
        /> */}
            </div>

            <PermissionCheck permission="companies.create">
              <Button
                variant="outline"
                onClick={() => setIsAddOpen(true)}
                className="border-[#B91434] text-[#B91434] hover:bg-[#B91434] hover:text-white transition-colors"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Company
              </Button>
            </PermissionCheck>
          </div>
        </div>
        <hr className="border-gray-100" />
      </div>

      {/* Table */}
      <DataTable
        columns={columns(handleViewCompany, handleEditCompany, handleDeleteCompany)}
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

      {/* Add new company */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl">
          <CompanyForm
            onSubmit={async (data) =>
            {
              try
              {
                await createOrganization(data);
                setIsAddOpen(false);
                if (onRefresh)
                {
                  await onRefresh(); // Refresh data instead of full page reload
                }
              } catch (error)
              {
                console.error("Failed to create company:", error);
                alert("Failed to create company. Please try again.");
              }
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
              onSubmit={async (data) =>
              {
                try
                {
                  await updateOrganization(companyToEdit._id, data);
                  setIsEditOpen(false);
                  setCompanyToEdit(null);
                  if (onRefresh)
                  {
                    await onRefresh(); // Refresh data instead of full page reload
                  }
                } catch (error)
                {
                  console.error("Failed to update organization:", error);
                  alert("Failed to update organization. Please try again.");
                }
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
