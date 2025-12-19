"use client"

import { useEffect, useState } from "react"
import { DataTable } from "../../../components/table/Data-table"
import { columns } from "../company/columns"
import { type Company } from "../../types/types"
import { DashboardCard } from "../../../components/dashboard/dashboard-card"
import { Building2, CheckCircle, XCircle, Plus } from "lucide-react"
import { getOrganizations } from "../../../lib/api"
import { Spinner } from "@/src/components/ui/spinner"
import { Button } from "../../../components/ui/button"

export default function Company() {
  const [organizations, setOrganizations] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const data = await getOrganizations()
      setOrganizations(data)
      setLoading(false)
    }

    loadData()
  }, [])

  const totalCompanies = organizations.length
  const activeCompanies = organizations.filter(o => o.status === "active").length
  const inactiveCompanies = organizations.filter(o => o.status === "inactive").length

  if (loading) {
    return (

      //loading spinner
      <div className="p-6 flex justify-center items-center h-64 text-lg">
       <Spinner/>
      </div>
    )
  }

  return (
    <div className="p-6">
    

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <DashboardCard
          title="Total Companies"
          value={totalCompanies.toString()}
          icon={Building2}
        />

        <DashboardCard
          title="Active"
          value={activeCompanies.toString()}
          icon={CheckCircle}
        />

        <DashboardCard
          title="Inactive"
          value={inactiveCompanies.toString()}
          icon={XCircle}
        />
      </div>

<div className="border p-5 rounded-md">
        {/* Topic */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="font-bold text-2xl mb-2">Organizations Management</h1>
          <p className="text-gray-700">Manage organizations information and settings</p>
        </div>
        <Button className="mt-4" variant="outline"><Plus />Add New Company</Button>
      </div>

    {/* data table */}
      <DataTable
        columns={columns}
        data={organizations}
        filterColumn="company_name"
        showStatusFilter={true}  /></div>
    </div>

  )
}
