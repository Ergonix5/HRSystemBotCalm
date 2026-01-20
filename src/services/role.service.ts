import { Role } from "../app/types/types"
import { apiFetch } from "./apiClient"

export async function getRoles(organizationId: string): Promise<Role[]> {
  const result = await apiFetch<any>(`/api/Role?organizationId=${organizationId}`)

  return (
    result.data?.map((role: any) => ({
      _id: role._id,
      role_id: role.role_id || role._id,
      roleName: role.role_name,
      description: role.description,
      status: role.status === "Active" ? "Active" : "Inactive",
      userCount: role.user_count || 0,
      permissions: role.permissions || [],
      color: role.color || "gray",
      createdAt: role.createdAt || role.created_at,
      updatedAt: role.updatedAt || role.updated_at,
      organization: role.organization?._id || (role.organization || null),
      organizationName: role.organization?.name || role.organization?.company_name || "",
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

interface UpdateRoleResponse {
  success: boolean;
  data?: any;
  message?: string;
}

export async function updateRole(roleId: string, data: any): Promise<UpdateRoleResponse> {
  return apiFetch<UpdateRoleResponse>(`/api/Role/${roleId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteRole(roleId: string) {
  return apiFetch(`/api/Role/${roleId}`, {
    method: "DELETE",
  })
}

