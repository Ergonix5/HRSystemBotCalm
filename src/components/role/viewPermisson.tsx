"use client";

import { ScrollArea } from '../ui/scroll-area';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CheckCircle2, XCircle, X } from 'lucide-react';
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
      case 'Users': return <span></span>;
      case 'Content': return <span></span>;
      case 'Reports': return <span></span>;
      case 'Settings': return <span></span>;
      default: return <span></span>;
    }
  };

  if (!selectedRole) return null;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white border border-black/10 shadow-xl overflow-hidden flex max-h-[90vh]">
      {/* Left Accent Border */}
      <div className="w-[6px] bg-[#B91434] flex-shrink-0" />
      
      <div className="flex-grow flex flex-col">
        {/* Header */}
        <div className="bg-neutral-50 p-8 border-b border-neutral-100 relative">
          <h2 className="text-3xl font-black text-black tracking-tighter uppercase">
            Manage Permissions - {selectedRole.roleName}
          </h2>
          <p className="text-neutral-500 text-sm mt-2 font-medium">
            Configure access permissions for this role.
          </p>
          
          {/* Close Button */}
          <button 
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-black transition-colors hover:bg-neutral-200"
            aria-label="Close form"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>

      <div className="flex flex-col flex-1 overflow-hidden p-8">

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

      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onClose} className="border-black text-black hover:bg-neutral-50">Cancel</Button>
        <Button onClick={onUpdate} className='bg-[#B91434] hover:bg-black'>Update Permissions</Button>
      </div>
      </div>
      </div>
    </div>
  );
}
