"use client"

import { useEffect, useState } from "react"
import { type Employee } from "../../types/types"
import { getEmployees } from "../../../services/employee.service"
import { EmployeeTable } from "./employeetable"
import { Spinner } from "@/src/components/ui/spinner"

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]) //store the list of employees fetched from the API
  const [loading, setLoading] = useState(true) //track loading status while fetching data
  const [error, setError] = useState<string | null>(null)


  //load employees asynchronously
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)
        const data = await getEmployees()
        setEmployees(data)
      } catch (err: any) {
        console.error("Failed to load employees:", err)
        setError(err.message || "Failed to load employees")
        setEmployees([])
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

    // loading spinner when data is fetching
  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <Spinner />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error loading employees</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }

  // Render the employee table once data is loaded
  return (
    <div className="p-6 bg-white">
      <EmployeeTable employees={employees} />
    </div>
  )
}
