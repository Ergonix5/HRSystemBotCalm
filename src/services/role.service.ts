import { Role } from "../app/types/types"
import { apiFetch } from "./apiClient"

export async function getRoles(organizationId: string): Promise<Role[]> {
  const result = await apiFetch<any>(`/api/Role?organizationId=507f1f77bcf86cd799439011`)

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
}

interface CreateRoleResponse {
  success: boolean;
  data?: any;
  message?: string;
}

export async function createRole(data: any): Promise<CreateRoleResponse> {
  return apiFetch<CreateRoleResponse>("/api/Role", {
    method: "POST",
    body: JSON.stringify(data),
  })
}
