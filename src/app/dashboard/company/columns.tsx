// app/columns.tsx
"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../../../components/ui/button"
import { Checkbox } from "../../../components/ui/checkbox"
import { Eye, Edit, Trash2, ArrowUpDown } from "lucide-react"
import { Company } from "../../types/types"
import { TableActions } from "../../../components/table/table_actions" 

export const columns = (onView: (id: string) => void, onEdit: (id: string) => void): ColumnDef<Company>[] => [
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
    accessorKey: "company_id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Company ID <ArrowUpDown />
      </Button>
    ),
  },
  {
    accessorKey: "company_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Company Name <ArrowUpDown />
      </Button>
    ),
  },
  {
    accessorKey: "company_description",
    header: "Description",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <span
          className={`capitalize px-2 py-1 rounded-full text-xs font-medium ${
            status === "Active" 
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
      id={row.original.company_id}
      type="company"
      onView={onView}
      onEdit={onEdit}
      onDelete={(id) => console.log("Delete company", id)}
    />
  ),
}

]
