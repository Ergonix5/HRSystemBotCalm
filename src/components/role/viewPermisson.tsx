"use client";

import { ScrollArea } from '../ui/scroll-area';
import { DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '../ui/dialog';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';
import { type Permission, type Role } from '@/src/app/types/types';

interface ViewPermissionProps {
  selectedRole: Role | null;
  groupedPermissions: Record<string, Permission[]>;
  selectedPermissions: string[];
  setSelectedPermissions: React.Dispatch<React.SetStateAction<string[]>>;
  onClose: () => void;
  onUpdate: () => void;
}

export default function ViewPermission({
  selectedRole,
  groupedPermissions,
  selectedPermissions,
  setSelectedPermissions,
  onClose,
  onUpdate,
}: ViewPermissionProps) {

const togglePermission = (id: string) => {
  setSelectedPermissions((prev: string[]) => 
    prev.includes(id) ? prev.filter((p: string) => p !== id) : [...prev, id]
  );
};

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Users': return <span>👥</span>;
      case 'Content': return <span>📄</span>;
      case 'Reports': return <span>📊</span>;
      case 'Settings': return <span>⚙️</span>;
      default: return <span>🔒</span>;
    }
  };

  if (!selectedRole) return null;

  return (
    <div className="flex flex-col max-h-[90vh] overflow-hidden">
      <DialogHeader>
        <DialogTitle>Manage Permissions - {selectedRole.roleName}</DialogTitle>
        <DialogDescription>Configure access permissions for this role.</DialogDescription>
      </DialogHeader>

      <ScrollArea className="flex-1 pr-4 py-4 max-h-[60vh]">
        <div className="space-y-4">
          {Object.entries(groupedPermissions).map(([category, permissions]) => (
            <div key={category} className="border rounded-md p-4">
              <div className="flex items-center gap-2 mb-3">
                {getCategoryIcon(category)}
                <span className="font-medium">{category}</span>
                <Badge variant="secondary" className="text-xs ml-auto">
                  {permissions.filter(p => selectedPermissions.includes(p.id)).length}/{permissions.length}
                </Badge>
              </div>
              <div className="space-y-3">
                {permissions.map(permission => (
                  <div key={permission.id} className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                    <div className="flex-1 flex items-center gap-2">
                      {selectedPermissions.includes(permission.id) ? (
                        <CheckCircle2 className="size-4 text-green-600" />
                      ) : (
                        <XCircle className="size-4 text-gray-400" />
                      )}
                      <span className="text-sm font-medium">{permission.name}</span>
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
      </ScrollArea>

      <DialogFooter className="border-t pt-4">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={onUpdate} className='bg-[#B91434]'>Update Permissions</Button>
      </DialogFooter>
    </div>
  );
}
