"use client"

import { Button } from "../../components/ui/button"
import { Eye, Edit, Trash2 } from "lucide-react"

interface TableActionsProps {
  id: string              
  type?: "company" | "designation" |"employee"
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export const TableActions: React.FC<TableActionsProps> = ({
  id,
  type,
  onView,
  onEdit,
  onDelete,
}) => {
  const handleView = () => onView ? onView(id) : console.log("View", type, id)
  const handleEdit = () => onEdit ? onEdit(id) : console.log("Edit", type, id)
  const handleDelete = () => onDelete ? onDelete(id) : console.log("Delete", type, id)

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={handleView}>
        <Eye className="h-4 w-4 text-blue-600" />
      </Button>
      <Button variant="ghost" size="sm" onClick={handleEdit}>
        <Edit className="h-4 w-4 text-green-600" />
      </Button>
      <Button variant="ghost" size="sm" onClick={handleDelete}>
        <Trash2 className="h-4 w-4 text-red-600" />
      </Button>
    </div>
  )
}
