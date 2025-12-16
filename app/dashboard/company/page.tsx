"use client"

import { DashboardCard } from "@/components/dashboard/dashboard-card"
import { DataTable } from "./data-table"
import { CompanyType } from "../../../types/company-types"
import { Building2, CheckCircle, XCircle } from "lucide-react"
import { columns } from "./colomns"

const data: CompanyType[] = [
  {
    id: "1",
    name: "Tech Corp",
    email: "contact@techcorp.com",
    status: "active"
  },
  {
    id: "2",
    name: "Business Solutions",
    email: "info@bizsolve.com",
    status: "active"
  },
  {
    id: "3",
    name: "Startup Inc",
    email: "hello@startup.com",
    status: "inactive"
  },{
    id: "2",
    name: "Business Solutions",
    email: "info@bizsolve.com",
    status: "active"
  },{
    id: "2",
    name: "Business Solutions",
    email: "info@bizsolve.com",
    status: "active"
  },{
    id: "2",
    name: "Business Solutions",
    email: "info@bizsolve.com",
    status: "active"
  },{
    id: "2",
    name: "Business Solutions",
    email: "info@bizsolve.com",
    status: "active"
  },{
    id: "2",
    name: "Business Solutions",
    email: "info@bizsolve.com",
    status: "active"
  },
]



export default function Company() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Companies</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <DashboardCard title="Total Companies" value="3" icon={Building2} />
        <DashboardCard title="Active" value="2" icon={CheckCircle} />
        <DashboardCard title="Inactive" value="1" icon={XCircle} />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
