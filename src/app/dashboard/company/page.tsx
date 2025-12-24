"use client"

import { useEffect, useState } from "react"
import { DashboardCard } from "../../../components/dashboard/dashboard-card"
import { Building2, CheckCircle, XCircle } from "lucide-react"
import { CompanyTable } from "./companytable"
import { type Company } from "../../types/types"
import { getOrganizations } from "@/src/lib/api"
import { Spinner } from "@/src/components/ui/spinner"

export default function CompanyPage() {
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
  const activeCompanies = organizations.filter(o => o.status === "Active").length
  const inactiveCompanies = organizations.filter(o => o.status === "Inactive").length

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Dashboard cards */}
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

      {/* Company table */}
      <CompanyTable organizations={organizations} />
    </div>
  )
}
