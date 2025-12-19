import { Company } from "../app/types/types"

const BASE_URL = "/api"

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
        status: "active",
      })) || []
    )
  } catch (error) {
    console.error("API Error (getOrganizations):", error)
    return []
  }
}
