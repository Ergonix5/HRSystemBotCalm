// app/employees/columns.tsx
"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../../../components/ui/button"
import { Checkbox } from "../../../components/ui/checkbox"
import { ArrowUpDown } from "lucide-react"
import { Employee } from "../../types/types"  // Make sure you have Employee type
import { TableActions } from "../../../components/table/table_actions"

export const columns: ColumnDef<Employee>[] = [
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
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name <ArrowUpDown />
      </Button>
    ),
  },
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
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "company_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Company <ArrowUpDown />
      </Button>
    ),
  },
  {
    accessorKey: "designation",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Designation <ArrowUpDown />
      </Button>
    ),
  },
  {
    accessorKey: "join_date",
    header: "Join Date",
    cell: ({ row }) => {
      const date = row.getValue("join_date") as string
      return <span>{new Date(date).toLocaleDateString()}</span>
    },
  },
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
}
]
