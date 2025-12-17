"use client"

import { Button } from "../../components/ui/button"
import { Eye, Edit, Trash2 } from "lucide-react"

interface CompanyActionsProps {
  companyId: string
}

export const CompanyActions: React.FC<CompanyActionsProps> = ({ companyId }) => {
  const handleView = () => console.log("View", companyId)
  const handleEdit = () => console.log("Edit", companyId)
  const handleDelete = () => console.log("Delete", companyId)

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
