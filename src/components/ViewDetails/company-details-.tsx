import { Company } from "../../app/types/types"
import { DetailsModal } from "./detailsDialog"

interface Props {
  company: Company | null
  isOpen: boolean
  onClose: () => void
}

export function CompanyDetailsModal({ company, isOpen, onClose }: Props) {
  if (!company) return null

  const details = [
    { label: "Company ID", value: company.company_id },
    { label: "Company Name", value: company.company_name, primary: true },
    { label: "Description", value: company.company_description },
    { label: "Status", value: company.status, isStatus: true },
  ]

  return (
    <DetailsModal
      title="Company Details"
      subtitle="Overview of company information"
      isOpen={isOpen}
      onClose={onClose}
      details={details}
      headerImage={company.company_logo}
    />
  )
}
