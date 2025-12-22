"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Users ,  Settings ,FileSliders,} from "lucide-react";
import {
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { type Permission } from "@/src/app/types/types";

interface NewRoleFormProps {
  availablePermissions: Permission[];
  groupedPermissions: Record<string, Permission[]>;
  selectedPermissions: string[];
  setSelectedPermissions: (permissions: string[]) => void;
  formData: { roleName: string; description: string };
  setFormData: (data: { roleName: string; description: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  togglePermission: (id: string) => void;
}

export default function NewRoleForm({
  groupedPermissions,
  selectedPermissions,
  formData,
  setFormData,
  onSubmit,
  onCancel,
  togglePermission,
}: NewRoleFormProps) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Users":
        return <span><Users/></span>;
      case "Content":
        return <span>📄</span>;
      case "Reports":
        return <span>📊</span>;
      case "Settings":
        return <span>⚙️</span>;
      default:
        return <span>🔒</span>;
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <DialogHeader>
        <DialogTitle>Create New Role</DialogTitle>
        <DialogDescription>
          Define a new role with specific permissions.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
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
          <div className="border rounded-md p-4 space-y-4 max-h-[300px] overflow-y-auto">
            {Object.entries(groupedPermissions).map(([category, permissions]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-2">
                  {getCategoryIcon(category)}
                  <span className="font-medium text-sm">{category}</span>
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

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#B91434]">Create Role</Button>
      </DialogFooter>
    </form>
  );
}