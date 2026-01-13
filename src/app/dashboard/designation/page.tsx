"use client"

import { useEffect, useState } from "react"
import { type Designation } from "../../types/types"
import { getDesignations } from "../../../services/designation.service"
import { DesignationTable } from "./designationtable"
import { Spinner } from "@/src/components/ui/spinner"

export default function DesignationPage() {
  const [designations, setDesignations] = useState<Designation[]>([]) //store the list of designations fetched from the API
  const [loading, setLoading] = useState(true) //track loading status while fetching data


  //load designations asynchronously
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
