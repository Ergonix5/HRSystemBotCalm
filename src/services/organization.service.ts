import { Company } from "../app/types/types"
import { apiFetch } from "./apiClient"

export async function getOrganizations(): Promise<Company[]> {
  try {
    const result = await apiFetch<any>("/api/Organization")

    return (
      result.data?.map((org: any) => ({
        _id: org._id,
        company_id: org.organization_id || org._id,
        company_name: org.name,
        company_description: org.description,
        status: org.status,
      })) || []
    )
  } catch (error: any) {
    console.error("getOrganizations error:", error)
    throw new Error(error.message || "Failed to fetch organizations")
  }
}

export async function createOrganization(data: any) {
  return apiFetch("/api/Organization", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateOrganization(id: string, data: any) {
  return apiFetch(`/api/Organization/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteOrganization(id: string) {
  return apiFetch(`/api/Organization/${id}`, {
    method: "DELETE",
  })
}
