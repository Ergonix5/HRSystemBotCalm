"use client"
import { useState, useMemo } from "react";
import HeaderSection from '../../../components/role/headerSection';
import ReusableRoleCard from '../../../components/role/reusableRoleCard';
import NewRoleForm from '../../../components/role/newRoleForm';
import ViewPermission from '../../../components/role/viewPermisson';
import EditRole from '../../../components/role/EditRole';
import DeleteDialog from "../../../components/role/deleteRoleDialog";
import { Plus, Search, Filter } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../components/ui/select';
import { Button } from '../../../components/ui/button';
import { type Role, type Permission } from '@/src/app/types/types';
import { initialRoles, availablePermissions } from "./role";
import { Dialog, DialogContent } from '../../../components/ui/dialog';

export default function Page() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ roleName: '', description: '' });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const groupedPermissions = useMemo(() => {
    return availablePermissions.reduce((acc, permission) => {
      if (!acc[permission.category]) acc[permission.category] = [];
      acc[permission.category].push(permission);
      return acc;
    }, {} as Record<string, Permission[]>);
  }, []);

  const formatDateTime = (dateString: string) => new Date(dateString).toLocaleString();

    // Filter and search logic
 const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const matchesSearch = 
        role.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.role_id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || role.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [roles, searchTerm, statusFilter]);


  return (
    <div className="p-6">
    <div className="border p-5 rounded-md">
     
      <HeaderSection title ="Roles and Permissions" description="Manage user roles and access control" onAddClick={() => setIsAddDialogOpen(true)} />

      {/* Search + Filter */}
     <div className="flex items-center gap-3 mb-6">
  {/* Search */}
  <div className="relative flex-1">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
    <Input
      placeholder="Search roles..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="pl-9 w-full"
    />
  </div>

  {/* Filter */}
  <div className="flex items-center gap-2">
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
</div>

      {/* Add Role Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <NewRoleForm
            availablePermissions={availablePermissions}
            groupedPermissions={groupedPermissions}
            selectedPermissions={selectedPermissions}
            setSelectedPermissions={setSelectedPermissions}
            formData={formData}
            setFormData={setFormData}
            togglePermission={id => setSelectedPermissions(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])}
            onSubmit={e => e.preventDefault()}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Role Cards */}
      <div className="grid grid-cols-1  lg:grid-cols-3 2xl:grid-cols-4 gap-5">
        {filteredRoles.length > 0 ? (
          filteredRoles.map((role: Role) => (
            <ReusableRoleCard
              key={role.role_id}
              role={role}
              availablePermissions={availablePermissions}
              formatDateTime={formatDateTime}
              onEdit={r => { setSelectedRole(r); setIsEditDialogOpen(true); }}
              onPermissions={r => { setSelectedRole(r); setSelectedPermissions(r.permissions); setIsPermissionsDialogOpen(true); }}
              onDelete={r => { setSelectedRole(r); setIsDeleteDialogOpen(true); }}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground">
            No roles found.
          </div>
        )}
      </div>

      {/* Dialogs */}
      <Dialog open={isPermissionsDialogOpen} onOpenChange={setIsPermissionsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <ViewPermission
            selectedRole={selectedRole}
            groupedPermissions={groupedPermissions}
            selectedPermissions={selectedPermissions}
            setSelectedPermissions={setSelectedPermissions}
            onClose={() => setIsPermissionsDialogOpen(false)}
            onUpdate={() => {
              if (selectedRole) {
                setRoles(prev => prev.map(role => 
                  role.role_id === selectedRole.role_id 
                    ? { ...role, permissions: selectedPermissions }
                    : role
                ));
                setIsPermissionsDialogOpen(false);
              }
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <EditRole
            selectedRole={selectedRole}
            formData={formData}
            setFormData={setFormData}
            onSubmit={e => e.preventDefault()}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <DeleteDialog
        selectedRole={selectedRole}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={() => {}}
      />
    </div></div>
  );
}
