import { Employee } from "@/src/app/types/types"
import { DetailsModal } from "./detailsDialog"

interface Props {
  employee: Employee | null
  isOpen: boolean
  onClose: () => void
}

export function EmployeeDetailsModal({ employee, isOpen, onClose }: Props) {
  if (!employee) return null

  const details = [
    { label: "Employee ID", value: employee.employee_id },
    { label: "Company ID", value: employee.company_id },
    { label: "Role ID", value: employee.role_id },
    { label: "Designation ID", value: employee.designation_id },
    { label: "First Name", value: employee.first_name, primary: true },
    { label: "Last Name", value: employee.last_name },
    { label: "Email", value: employee.email },
    { label: "Phone", value: employee.phone },
    { label: "Address", value: employee.address },
    { label: "Date of Birth", value: employee.date_of_birth },
    { label: "Join Date", value: employee.join_date },
    { label: "Status", value: employee.status, isStatus: true },
  ]

  return (
    <DetailsModal
      title="Employee Details"
      subtitle="Employee information overview"
      isOpen={isOpen}
      onClose={onClose}
      details={details}
      headerImage={employee.profile_pic}
    />
  )
}
