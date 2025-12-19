import { Designation } from "../../app/types/types"
import { DetailsModal } from "./detailsDialog"

interface Props {
  designation: Designation | null
  isOpen: boolean
  onClose: () => void
}

export function DesignationDetailsModal({ designation, isOpen, onClose }: Props) {
  if (!designation) return null

  const details = [
    { label: "Designation ID", value: designation.designation_id },
    { label: "Title", value: designation.title, primary: true },
    { label: "Company Name", value: designation.company_name },
    { label: "Description", value: designation.description || "N/A" },
    { label: "Status", value: designation.status, isStatus: true },
  ]

  return (
    <DetailsModal
      title="Designation Details"
      subtitle="Designation information overview"
      isOpen={isOpen}
      onClose={onClose}
      details={details}
    />
  )
}
