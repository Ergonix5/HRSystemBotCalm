"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../../../components/ui/button"
import { Checkbox } from "../../../components/ui/checkbox"
import { ArrowUpDown } from "lucide-react"
import { Employee } from "../../types/types"
import { TableActions } from "../../../components/table/table_actions"

export const columns: ColumnDef<Employee>[] = [

  /* 
     Row Selection Column
      */
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  /* 
     Employee ID
      */
  {
    accessorKey: "employee_id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Employee ID <ArrowUpDown />
      </Button>
    ),
  },

  /* 
     Full Name (Computed)
      */
  {
    id: "name",
    header: "Name",
    cell: ({ row }) =>
      `${row.original.first_name} ${row.original.last_name}`,
  },

  /* 
     Email
      */
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email <ArrowUpDown />
      </Button>
    ),
  },

  /* 
     Phone Number
      */
  {
    accessorKey: "phone",
    header: "Phone",
  },

  /* 
     Company
      */
  {
    accessorKey: "company_id",
    header: "Company",
  },

  /* 
     Designation
      */
  {
    accessorKey: "designation_id",
    header: "Designation",
  },

  /* 
     Date of Birth
      */
  {
    accessorKey: "date_of_birth",
    header: "Date of Birth",
    cell: ({ row }) => {
      const dob = row.getValue("date_of_birth") as string
      return <span>{new Date(dob).toLocaleDateString()}</span>
    },
  },

  /* 
     Join Date
      */
  {
    accessorKey: "join_date",
    header: "Join Date",
    cell: ({ row }) => {
      const date = row.getValue("join_date") as string
      return <span>{new Date(date).toLocaleDateString()}</span>
    },
  },

  /* 
     Status
      */
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <span
          className={`capitalize px-2 py-1 rounded-full text-xs font-medium ${
            status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </span>
      )
    },
  },

  /* 
     Row Actions
      */
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => (
      <TableActions
        id={row.original.employee_id}
        type="employee"
        onView={(id) => console.log("View employee", id)}
        onEdit={(id) => console.log("Edit employee", id)}
        onDelete={(id) => console.log("Delete employee", id)}
      />
    ),
  },
]
