import { Designation , Company,Employee, Role } from "../app/types/types"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

//fetch organizations
export async function getOrganizations(): Promise<Company[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/Organization`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch organizations")
    }

    const result = await response.json()
    console.log("API Response:", result)

    // Transform backend → frontend type
    return (
      result.data?.map((org: any) => ({
        _id: org._id,
        company_id: org.organization_id || org._id,
        company_name: org.name,
        company_description: org.description,
        status: org.status ,
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
    const response = await fetch(`${BASE_URL}/api/Designation`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch designations")
    }

    const result = await response.json()

    // Transform backend → frontend type
    return (
      result.data?.map((des: any) => ({
        _id: des._id,
        designation_id: des.designation_id || des._id,
        title: des.title,
        // company_name:
        //   des.company?.name || des.company_name || "N/A",
        description: des.description,
        status: des.status,
      })) || []
    )
  } catch (error) {
    console.error("API Error (getDesignations):", error)
    return []
  }
}

//fetch roles
export async function getRoles(): Promise<Role[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/Role?organizationId=507f1f77bcf86cd799439011`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch roles")
    }

    const result = await response.json()
    console.log("Roles API Response:", result)

    // Transform backend → frontend type
    return (
      result.data?.map((role: any) => ({
        role_id: role.role_id || role._id,
        roleName: role.role_name,
        description: role.description,
        status: role.status,
        userCount: role.user_count || 0,
        permissions: role.permissions || [],
        color: role.color || "gray",
        createdAt: role.created_at,
        updatedAt: role.updated_at,
      })) || []
    )
  } catch (error) {
    console.error("API Error (getRoles):", error)
    return []
  }
}

//fetch employees 
export async function getEmployees(): Promise<Employee[]> {
  try {
    const response = await fetch(` ${BASE_URL}/api/employee/all`, {
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

// Create new employee
export async function createEmployee(employeeData: any) {
  try {
    const response = await fetch(`${BASE_URL}/api/employee`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employeeData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to create employee")
    }

    return await response.json()
  } catch (error) {
    console.error("API Error (createEmployee):", error)
    throw error
  }
}

// Create new designation
export async function createDesignation(designationData: any) {
  try {
    const response = await fetch(`${BASE_URL}/api/Designation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(designationData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to create designation")
    }

    return await response.json()
  } catch (error) {
    console.error("API Error (createDesignation):", error)
    throw error
  }
}

// Create new organization/company
export async function createOrganization(organizationData: any) {
  try {
    const response = await fetch(`${BASE_URL}/api/Organization`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(organizationData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to create organization")
    }

    return await response.json()
  } catch (error) {
    console.error("API Error (createOrganization):", error)
    throw error
  }
}

//create new role
export async function createRole(roleData: any) {
  try {
    const response = await fetch(`${BASE_URL}/api/Role`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roleData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to create role")
    }

    return await response.json()
  } catch (error) {
    console.error("API Error (createRole):", error)
    throw error
  }
}
// Update designation
export async function updateDesignation(id: string, designationData: any) {
  try {
    const response = await fetch(`${BASE_URL}/api/Designation/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(designationData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to update designation")
    }

    return await response.json()
  } catch (error) {
    console.error("API Error (updateDesignation):", error)
    throw error
  }
}

// Update organization
export async function updateOrganization(id: string, organizationData: any) {
  try {
    const response = await fetch(`${BASE_URL}/api/Organization/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(organizationData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to update organization")
    }

    return await response.json()
  } catch (error) {
    console.error("API Error (updateOrganization):", error)
    throw error
  }
}