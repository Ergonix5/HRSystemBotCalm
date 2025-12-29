"use client"

import { useEffect, useState } from "react"
import { type Employee } from "../../types/types"
import { getEmployees } from "@/src/lib/api"
import { EmployeeTable } from "./employeetable"
import { Spinner } from "@/src/components/ui/spinner"

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]) //store the list of employees fetched from the API
  const [loading, setLoading] = useState(true) //track loading status while fetching data


  //load employees asynchronously
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const data = await getEmployees()
      setEmployees(data)
      setLoading(false)
    }
    loadData()
  }, [])

    // loading spinner when dta is feching
  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <Spinner />
      </div>
    )
  }

  // Render the employee table once data is loaded
  return (
    <div className="p-6">
      <EmployeeTable employees={employees} />
    </div>
  )
}
