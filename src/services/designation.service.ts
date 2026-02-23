import { Designation } from "../app/types/types"
import { apiFetch } from "./apiClient"

export async function getDesignations(): Promise<Designation[]> {
  try {
    const result = await apiFetch<any>("/api/Designation")

    return (
      result.data?.map((des: any) => ({
        _id: des._id,
        designation_id: des.designation_id || des._id,
        title: des.title,
        description: des.description,
        status: des.status,
      })) || []
    )
  } catch (error: any) {
    console.error("getDesignations error:", error)
    throw new Error(error.message || "Failed to fetch designations")
  }
}

export async function createDesignation(data: any) {
  return apiFetch("/api/Designation", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateDesignation(id: string, data: any) {
  return apiFetch(`/api/Designation/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteDesignation(id: string) {
  return apiFetch(`/api/Designation/${id}`, {
    method: "DELETE",
  })
}
