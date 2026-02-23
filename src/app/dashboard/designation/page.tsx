"use client"

import { useEffect, useState } from "react"
import { type Designation } from "../../types/types"
import { getDesignations } from "../../../services/designation.service"
import { DesignationTable } from "./designationtable"
import { Spinner } from "@/src/components/ui/spinner"

export default function DesignationPage() {
  const [designations, setDesignations] = useState<Designation[]>([]) //store the list of designations fetched from the API
  const [loading, setLoading] = useState(true) //track loading status while fetching data
  const [error, setError] = useState<string | null>(null)


  //load designations asynchronously
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)
        const data = await getDesignations()
        setDesignations(data)
      } catch (err: any) {
        console.error("Failed to load designations:", err)
        setError(err.message || "Failed to load designations")
        setDesignations([])
      } finally {
        setLoading(false)
      }
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

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error loading designations</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white">
      <DesignationTable designations={designations} />
    </div>
  )
}
