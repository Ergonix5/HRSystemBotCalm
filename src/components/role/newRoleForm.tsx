"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Users ,  Settings ,FileSliders, ChartNoAxesCombined,Lock, X} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { type Permission, type Company } from "@/src/app/types/types";

interface NewRoleFormProps {
  availablePermissions: Permission[];
  groupedPermissions: Record<string, Permission[]>;
  selectedPermissions: string[];
  setSelectedPermissions: (permissions: string[]) => void;
  formData: { roleName: string; description: string; status?: string; companyId?: string };
  setFormData: (data: { roleName: string; description: string; status?: string; companyId?: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  togglePermission: (id: string) => void;
  isSubmitting?: boolean;
  companies?: Company[];
}

export default function NewRoleForm({
  groupedPermissions,
  selectedPermissions,
  formData,
  setFormData,
  onSubmit,
  onCancel,
  togglePermission,
  isSubmitting = false,
  companies = [],
}: NewRoleFormProps) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Users":
        return <span><Users className="w-4 h-4 text-[#B91434]"/></span>;
      case "Content":
        return <span><FileSliders className="w-4 h-4 text-[#B91434]"/></span>;
      case "Reports":
        return <span><ChartNoAxesCombined className="w-4 h-4 text-[#B91434]"/></span>;
      case "Settings":
        return <span><Settings className="w-4 h-4 text-[#B91434]"/></span>;
      default:
        return <span> <Lock className="w-4 h-4 text-[#B91434]"/></span>;
    }
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl  mx-auto bg-white border border-black/10 shadow-xl overflow-hidden flex flex-col sm:flex-row">
      {/* Left Accent Border */}
      <div className="w-full sm:w-[6px] h-[6px] sm:h-auto bg-[#B91434] flex-shrink-0" />
      
      <div className="flex-grow">
        {/* Header */}
        <div className="bg-neutral-50 p-4 sm:p-6 md:p-8 border-b border-neutral-100 relative w-full">
          <h2 className="text-2xl sm:text-2xl md:text-3xl font-black text-black tracking-tighter uppercase">
            Create New Role
          </h2>
          <p className="text-neutral-500 text-xs sm:text-sm mt-2 font-medium">
            Define a new role with specific permissions.
          </p>
          
          {/* Close Button */}
          <button 
            type="button"
            onClick={onCancel}
            className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 text-neutral-400 hover:text-black transition-colors hover:bg-neutral-200"
            aria-label="Close form"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>

    <form onSubmit={onSubmit} className="p-4 sm:p-6 md:p-8 flex-grow">

      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="grid gap-2">
            <Label htmlFor="roleName">Role Name *</Label>
            <Input
              id="roleName"
              name="roleName"
              placeholder="Enter role name"
              value={formData.roleName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status *</Label>
            <Select value={formData.status || "Active"} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="companyId">Company *</Label>
          <Select value={formData.companyId || ""} onValueChange={(value) => setFormData({ ...formData, companyId: value })}>
            <SelectTrigger id="companyId">
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company._id} value={company._id}>
                  {company.company_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Enter role description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label>Permissions</Label>
          <div className="border rounded-md p-4 space-y-4 max-h-75 overflow-y-auto">
            {Object.entries(groupedPermissions).map(([category, permissions]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-2">
                  {getCategoryIcon(category)}
                  <span className="font-medium text-sm text-[#B91434]">{category}</span>
                </div>
                <div className="space-y-2 ml-6">
                  {permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          {permission.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {permission.description}
                        </div>
                      </div>
                      <Switch
                        checked={selectedPermissions.includes(permission.id)}
                        onCheckedChange={() => togglePermission(permission.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t flex-col-reverse sm:flex-row">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} className="border-black text-black hover:bg-neutral-50 w-full sm:w-auto">
          Cancel
        </Button>
        <Button type="submit" className="bg-[#B91434] hover:bg-black w-full sm:w-auto" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Role'}
        </Button>
      </div>
    </form>
    </div>
    </div>
  );
}