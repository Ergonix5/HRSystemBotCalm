"use client";

import { useState, useMemo, useEffect } from "react";
import HeaderSection from "../../../components/role/headerSection";
import ReusableRoleCard from "../../../components/role/reusableRoleCard";
import NewRoleForm from "../../../components/role/newRoleForm";
import ViewPermission from "../../../components/role/viewPermisson";
import EditRole from "../../../components/role/EditRole";
import DeleteDialog from "../../../components/role/deleteRoleDialog";

import { Search } from "lucide-react";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/select";

import { type Role, type Permission, type Company } from "@/src/app/types/types";
import { availablePermissions } from "./role";
import { createRole, getRoles, updateRole, deleteRole } from "../../../services/role.service";
import { getOrganizations } from "../../../services/organization.service";

export default function Page() {
  //  STATE 
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [formData, setFormData] = useState<{
    roleName: string;
    description: string;
    status: string;
    companyId: string;
    roleId: string;
  }>({
    roleName: "",
    description: "",
    status: "Active",
    companyId: "",
    roleId: "",
  });

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);

  //  FETCH ROLES & COMPANIES
  useEffect(() => {
    const fetchData = async () => {
      // replace with actual current organization id when available
      const orgId = "507f1f77bcf86cd799439011";
      const [rolesData, companiesData] = await Promise.all([
        getRoles(orgId),
        getOrganizations(),
      ]);
      setRoles(rolesData);
      setCompanies(companiesData);
    };

    fetchData();
  }, []);

  //  HELPERS 
  const generateRoleId = () => {
    const existingNumbers = roles
      .map(r => {
        const match = r.role_id.match(/ROLE(\d+)/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter(n => n > 0);

    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    return `ROLE${String(nextNumber).padStart(3, '0')}`;
  };

  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleString();

  const getCompanyName = (companyId: string) => {
    const company = companies.find(c => c._id === companyId);
    return company?.company_name || "Unknown Company";
  };

  //  CREATE ROLE 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.roleName.trim() || !formData.description.trim() || !formData.companyId || !formData.roleId) return;

    setIsSubmitting(true);

    try {
      const company = companies.find((c) => c._id === formData.companyId);
      const payload = {
        organization: formData.companyId,
        company_name: company?.company_name || "",
        role_id: formData.roleId,
        role_name: formData.roleName.trim(),
        description: formData.description.trim(),
        permissions: selectedPermissions,
        status: formData.status,
      };

      const response = await createRole(payload);

      if (response?.success && response.data) {
        const created = response.data;
        const newRole: Role = {
          _id: created._id,
          role_id: created.role_id || created._id,
          roleName: created.role_name,
          description: created.description || "",
          status: created.status === "Active" ? "Active" : "Inactive",
          userCount: created.user_count || 0,
          permissions: created.permissions || [],
          color: created.color || "blue",
          createdAt: created.createdAt || created.created_at || new Date().toISOString(),
          updatedAt: created.updatedAt || created.updated_at || new Date().toISOString(),
          organization: created.organization?._id || created.organization,
          organizationName: created.organization?.name || created.company_name || "",
        };

        setRoles((prev) => [newRole, ...prev]);
        setFormData({ roleName: "", description: "", status: "Active", companyId: "", roleId: "" });
        setSelectedPermissions([]);
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      console.error("Create role failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // EDIT ROLE - save changes
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole?._id) return;
    try {
      const company = companies.find((c) => c._id === formData.companyId);
      const payload = {
        organization: formData.companyId,
        company_name: company?.company_name || "",
        role_id: formData.roleId,
        role_name: formData.roleName.trim(),
        description: formData.description.trim(),
        permissions: selectedPermissions,
        status: formData.status,
      };

      const res = await updateRole(selectedRole._id, payload);
      if (res?.success && res.data) {
        const updated = res.data;
        setRoles((prev) => prev.map((r) => (r._id === updated._id ? {
          ...r,
          role_id: updated.role_id || updated._id,
          roleName: updated.role_name,
          description: updated.description || "",
          status: updated.status === "Active" ? "Active" : "Inactive",
          permissions: updated.permissions || [],
          organization: updated.organization?._id || updated.organization,
          organizationName: updated.organization?.name || updated.company_name || "",
          updatedAt: updated.updatedAt || updated.updated_at || new Date().toISOString(),
        } : r)));
        setIsEditDialogOpen(false);
      }
    } catch (err) {
      console.error("Update role failed:", err);
      alert("Failed to update role. Please try again.");
    }
  };

  //  GROUP PERMISSIONS 
  const groupedPermissions = useMemo(() => {
    return availablePermissions.reduce((acc, permission) => {
      if (!acc[permission.category]) acc[permission.category] = [];
      acc[permission.category].push(permission);
      return acc;
    }, {} as Record<string, Permission[]>);
  }, []);

  //  FILTER ROLES 
  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const matchesSearch =
        role.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.role_id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || role.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [roles, searchTerm, statusFilter]);

  //  UI 
  return (
    <div className="p-6">
      <div className="border p-5 rounded-md">
        <HeaderSection
          title="Roles and Permissions"
          description="Manage user roles and access control"
          onAddClick={() => setIsAddDialogOpen(true)}
        />

        {/* Search + Filter */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Add Role Dialog */}
        {isAddDialogOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <NewRoleForm
                availablePermissions={availablePermissions}
                groupedPermissions={groupedPermissions}
                selectedPermissions={selectedPermissions}
                setSelectedPermissions={setSelectedPermissions}
                formData={formData}
                setFormData={(data) =>
                  setFormData((prev) => ({
                    ...prev,
                    ...data,
                    roleId: prev.roleId || generateRoleId(),
                  }))
                }
                togglePermission={(id) =>
                  setSelectedPermissions((prev) =>
                    prev.includes(id)
                      ? prev.filter((p) => p !== id)
                      : [...prev, id]
                  )
                }
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                onCancel={() => setIsAddDialogOpen(false)}
                companies={companies}
              />
            </div>
          </div>
        )}

        {/* Role Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
          {filteredRoles.length ? (
            filteredRoles.map((role, index) => (
              <ReusableRoleCard
                key={`${role.role_id}-${index}`}
                role={role}
                availablePermissions={availablePermissions}
                formatDateTime={formatDateTime}
                companyName={getCompanyName((role as any).organization || "")}
                onEdit={(r) => {
                  setSelectedRole(r);
                  setFormData({
                    roleName: r.roleName,
                    description: r.description,
                    status: r.status.toLowerCase(),
                    companyId: (r as any).organization || "",
                    roleId: r.role_id,
                  });
                  setIsEditDialogOpen(true);
                }}
                onPermissions={(r) => {
                  setSelectedRole(r);
                  setSelectedPermissions(r.permissions);
                  setIsPermissionsDialogOpen(true);
                }}
                onDelete={(r) => {
                  setSelectedRole(r);
                  setIsDeleteDialogOpen(true);
                }}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground">
              No roles found.
            </div>
          )}
        </div>

        {/* Permissions Dialog */}
        {isPermissionsDialogOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="max-w-4xl max-h-[90vh] overflow-hidden">
              <ViewPermission
                selectedRole={selectedRole}
                groupedPermissions={groupedPermissions}
                selectedPermissions={selectedPermissions}
                setSelectedPermissions={setSelectedPermissions}
                onClose={() => setIsPermissionsDialogOpen(false)}
                onUpdate={async () => {
                  if (!selectedRole?._id) return;
                  try {
                    await updateRole(selectedRole._id, { permissions: selectedPermissions });
                    setRoles((prev) =>
                      prev.map((role) =>
                        role._id === selectedRole._id
                          ? { ...role, permissions: selectedPermissions }
                          : role
                      )
                    );
                    setIsPermissionsDialogOpen(false);
                  } catch (err) {
                    console.error('Failed to update permissions', err);
                    alert('Failed to update permissions.');
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Edit Dialog */}
        {isEditDialogOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="max-w-2xl">
              <EditRole
                selectedRole={selectedRole}
                formData={formData}
                setFormData={(data) =>
                  setFormData((prev) => ({
                    ...prev,
                    ...data,
                    roleId: prev.roleId, // keep roleId intact
                  }))
                }
                onSubmit={handleEditSubmit}
                onCancel={() => setIsEditDialogOpen(false)}
                companies={companies}
              />
            </div>
          </div>
        )}

        {/* Delete Dialog */}
        <DeleteDialog
          selectedRole={selectedRole}
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onDelete={async () => {
            if (selectedRole?._id) {
              try {
                await deleteRole(selectedRole._id);
                setRoles((prev) => prev.filter((r) => r._id !== selectedRole._id));
                setIsDeleteDialogOpen(false);
                setSelectedRole(null);
              } catch (error) {
                console.error("Failed to delete role:", error);
                alert("Failed to delete role. Please try again.");
              }
            }
          }}
        />
      </div>
    </div>
  );
}
