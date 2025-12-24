"use client"

import { useEffect, useState } from "react"
import { type Designation } from "../../types/types"
import { getDesignations } from "@/src/lib/api"
import { DesignationTable } from "./designationtable"
import { Spinner } from "@/src/components/ui/spinner"

export default function DesignationPage() {
  const [designations, setDesignations] = useState<Designation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const data = await getDesignations()
      setDesignations(data)
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
      <DesignationTable designations={designations} />
    </div>
  )
}
