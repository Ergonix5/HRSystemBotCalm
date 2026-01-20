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
import { Dialog, DialogContent } from "../../../components/ui/dialog";

import { type Role, type Permission, type Company } from "@/src/app/types/types";
import { availablePermissions } from "./role";
import { createRole ,getRoles } from "../../../services/role.service";
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

  const [formData, setFormData] = useState({
    roleName: "",
    description: "",
    status: "active",
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
      const [rolesData, companiesData] = await Promise.all([
        getRoles("507f1f77bcf86cd799439011"),
        getOrganizations(),
      ]);
      console.log("Fetched roles:", rolesData);
      console.log("Fetched companies:", companiesData);
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
      const payload = {
        organization: formData.companyId,
        role_id: formData.roleId,
        role_name: formData.roleName.trim(),
        description: formData.description.trim(),
        permissions: selectedPermissions,
        status: formData.status
      };

      const response = await createRole(payload);

      if (response?.success) {
        const newRole: Role = {
          role_id: payload.role_id,
          roleName: payload.role_name,
          description: payload.description,
          status: payload.status === "active" ? "Active" : "Inactive",
          userCount: 0,
          permissions: selectedPermissions,
          color: "blue",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setRoles((prev) => [newRole, ...prev]);
        setFormData({ roleName: "", description: "", status: "active", companyId: "", roleId: "" });
        setSelectedPermissions([]);
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      console.error("Create role failed:", error);
    } finally {
      setIsSubmitting(false);
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
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (open) {
            setFormData({ ...formData, roleId: generateRoleId() });
          }
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <NewRoleForm
              availablePermissions={availablePermissions}
              groupedPermissions={groupedPermissions}
              selectedPermissions={selectedPermissions}
              setSelectedPermissions={setSelectedPermissions}
              formData={formData}
              setFormData={setFormData}
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
          </DialogContent>
        </Dialog>

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
        <Dialog
          open={isPermissionsDialogOpen}
          onOpenChange={setIsPermissionsDialogOpen}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <ViewPermission
              selectedRole={selectedRole}
              groupedPermissions={groupedPermissions}
              selectedPermissions={selectedPermissions}
              setSelectedPermissions={setSelectedPermissions}
              onClose={() => setIsPermissionsDialogOpen(false)}
              onUpdate={() => {
                if (!selectedRole) return;
                setRoles((prev) =>
                  prev.map((role) =>
                    role.role_id === selectedRole.role_id
                      ? { ...role, permissions: selectedPermissions }
                      : role
                  )
                );
                setIsPermissionsDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <EditRole
              selectedRole={selectedRole}
              formData={formData}
              setFormData={setFormData}
              onSubmit={(e) => e.preventDefault()}
              onCancel={() => setIsEditDialogOpen(false)}
              companies={companies}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <DeleteDialog
          selectedRole={selectedRole}
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onDelete={() => {}}
        />
      </div>
    </div>
  );
}
