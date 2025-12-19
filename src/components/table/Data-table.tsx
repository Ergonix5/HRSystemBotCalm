"use client"
import * as React from "react"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table"
import { Input } from "../../components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuItem } from "../../components/ui/dropdown-menu"
import { Button } from "../../components/ui/button"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "../../components/ui/table"
import { ChevronDown, Filter, Plus, Search ,SlidersHorizontal } from "lucide-react"
import { DataTablePagination } from "./DataTablePagination"
import { organization } from '../../app/models/organization.model';

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  filterColumn?: string
  showStatusFilter?: boolean
  showCompanyFilter?: boolean
}

export function DataTable<TData>({ columns, data, filterColumn = "company_name", showStatusFilter = false, showCompanyFilter = false }: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [selectedStatus, setSelectedStatus] = React.useState("All Status")
  const [selectedCompany, setSelectedCompany] = React.useState("All Companies")

  const table = useReactTable({
    data,
    columns,
    getRowId: (row: any) => row.company_id,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    
    <div className="w-full  space-y-4 ">

      

      <div className="flex items-center  gap-4">
        <Input
          placeholder=" Search..."
          value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
          onChange={(e) => table.getColumn(filterColumn)?.setFilterValue(e.target.value)}
          className="bg-gray-50"
        />

        {showStatusFilter && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                {selectedStatus} <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => {
                table.getColumn("status")?.setFilterValue("")
                setSelectedStatus("All Status")
              }}>
                All Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                console.log("Setting active filter")
                const statusColumn = table.getColumn("status")
                console.log("Status column:", statusColumn)
                statusColumn?.setFilterValue("active")
                setSelectedStatus("Active")
              }}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                table.getColumn("status")?.setFilterValue("inactive")
                setSelectedStatus("Inactive")
              }}>
                Inactive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        {showCompanyFilter && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                {selectedCompany} <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => {
                table.getColumn("company_name")?.setFilterValue("")
                setSelectedCompany("All Companies")
              }}>
                All Companies
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                table.getColumn("company_name")?.setFilterValue("Ergonix")
                setSelectedCompany("Ergonix")
              }}>
                Ergonix
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                table.getColumn("company_name")?.setFilterValue("Techify")
                setSelectedCompany("Techify")
              }}>
                Techify
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                table.getColumn("company_name")?.setFilterValue("BuildPro")
                setSelectedCompany("BuildPro")
              }}>
                BuildPro
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                table.getColumn("company_name")?.setFilterValue("GreenLeaf")
                setSelectedCompany("GreenLeaf")
              }}>
                GreenLeaf
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                table.getColumn("company_name")?.setFilterValue("DataFlow")
                setSelectedCompany("DataFlow")
              }}>
                DataFlow
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

       
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table.getAllColumns().filter(c => c.getCanHide()).map(column => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <div className="max-h-[500px] overflow-y-auto scrollbar-none">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-20 shadow-sm">
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id} className="border-b">
                  {headerGroup.headers.map(header => (
                    <TableHead key={header.id} className="bg-background">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <DataTablePagination table={table} />
    </div>
    
  )
}
