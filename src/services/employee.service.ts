import { Employee } from "../app/types/types"
import { apiFetch } from "./apiClient"

export async function getEmployees(): Promise<Employee[]> {
  const result = await apiFetch<any>("/api/employee/all")

  return (
    result.data?.map((emp: any) => ({
      employee_id: emp.employee_id,
      company_id: emp.company_id,
      designation_id: emp.designation_id,
      first_name: emp.first_name,
      last_name: emp.last_name,
      email: emp.email,
      phone: emp.phone,
      address: emp.address,
      date_of_birth: emp.date_of_birth,
      join_date: emp.join_date,
      profile_pic: emp.profile_pic,
      status: emp.status ? "Active" : "Inactive",
    })) || []
  )
}

export async function createEmployee(data: any) {
  return apiFetch("/api/employee", {
    method: "POST",
    body: JSON.stringify(data),
  })
}
