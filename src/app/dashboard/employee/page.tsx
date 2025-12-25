"use client"

import { useEffect, useState } from "react"
import { type Employee } from "../../types/types"
import { getEmployees } from "@/src/lib/api"
import { EmployeeTable } from "./employeetable"
import { Spinner } from "@/src/components/ui/spinner"

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const data = await getEmployees()
      setEmployees(data)
      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="p-6">
      <EmployeeTable employees={employees} />
    </div>
  )
}
