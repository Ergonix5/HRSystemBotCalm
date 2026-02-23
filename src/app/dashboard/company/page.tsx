"use client"

import { useEffect, useState } from "react"
import { DashboardCard } from "../../../components/dashboard/dashboard-card"
import { Building2, CheckCircle, XCircle } from "lucide-react"
import { CompanyTable } from "./companytable"
import { type Company } from "../../types/types"
import { getOrganizations } from "../../../services/organization.service"
import { Spinner } from "@/src/components/ui/spinner"

export default function CompanyPage()
{
  const [organizations, setOrganizations] = useState<Company[]>([]) //store the list of companies fetched from the API
  const [loading, setLoading] = useState(true) //track loading status while fetching data
  const [error, setError] = useState<string | null>(null)


  //load companies asynchronously
  const loadData = async () =>
  {
    try {
      setLoading(true)
      setError(null)
      const data = await getOrganizations()
      setOrganizations(data)
    } catch (err: any) {
      console.error("Failed to load organizations:", err)
      setError(err.message || "Failed to load organizations")
      setOrganizations([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() =>
  {
    loadData()
  }, [])

  // Compute dashboard statistics
  const totalCompanies = organizations.length
  const activeCompanies = organizations.filter(o => o.status === "Active").length
  const inactiveCompanies = organizations.filter(o => o.status === "Inactive").length


  // loading spinner while data is being fetched
  if (loading)
  {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <Spinner />
      </div>
    )
  }

  // Error state
  if (error)
  {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error loading organizations</p>
          <p className="text-sm mt-1">{error}</p>
          <button 
            onClick={loadData}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 ">
      {/* Dashboard cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <DashboardCard
          title="Total Companies"
          value={totalCompanies.toString()}
          subtitle="All organizations"
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
      <CompanyTable organizations={organizations} onRefresh={loadData} />
    </div>
  )
}
