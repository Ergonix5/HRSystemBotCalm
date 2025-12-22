import { Designation , Company,Employee } from "../app/types/types"

const BASE_URL = "/api"

//fetch organizations
export async function getOrganizations(): Promise<Company[]> {
  try {
    const response = await fetch(`${BASE_URL}/Organization`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch organizations")
    }

    const result = await response.json()

    // Transform backend → frontend type
    return (
      result.data?.map((org: any) => ({
        company_id: org.organization_id || org._id,
        company_name: org.name,
        company_description: org.description,
        status: "Active",
      })) || []
    )
  } catch (error) {
    console.error("API Error (getOrganizations):", error)
    return []
  }
}


//fetch designations

export async function getDesignations(): Promise<Designation[]> {
  try {
    const response = await fetch(`${BASE_URL}/Designation`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch designations")
    }

    const result = await response.json()

    // Transform backend → frontend type
    return (
      result.data?.map((des: any) => ({
        designation_id: des.designation_id || des._id,
        title: des.title,
        company_name:
          des.company?.name || des.company_name || "N/A",
        description: des.description,
        status: des.status === false ? "Inactive" : "Active",
      })) || []
    )
  } catch (error) {
    console.error("API Error (getDesignations):", error)
    return []
  }
}

//fetch employees 
export async function getEmployees(): Promise<Employee[]> {
  try {
    const response = await fetch(`${BASE_URL}/employee/all`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch employees")
  
    }

    const result = await response.json()

    // Transform backend → frontend
    return (
      result.data?.map((emp: any) => ({
        employee_id: emp.employee_id,        
        company_id: emp.company_id,          
        // role_id: emp.role_id,                
        designation_id: emp.designation_id,
         first_name: emp.first_name,
        last_name: emp.last_name,
        email: emp.email,
        phone: emp.phone,
        address: emp.address,
        date_of_birth: emp.date_of_birth,
        join_date: emp.join_date,
        profile_pic: emp.profile_pic,
        status: emp.status === false ? "Inactive" : "Active",
      })) || []
    )
  } catch (error) {
    console.error("API Error (getEmployees):", error)
    return []
  }
}