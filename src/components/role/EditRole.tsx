"use client";

import { DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { type Role } from '@/src/app/types/types';

interface EditRoleProps {
  selectedRole: Role | null;
  formData: { roleName: string; description: string };
  setFormData: (data: { roleName: string; description: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function EditRole({ selectedRole, formData, setFormData, onSubmit, onCancel }: EditRoleProps) {
  if (!selectedRole) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={onSubmit}>
      <DialogHeader>
        <DialogTitle>Edit Role</DialogTitle>
        <DialogDescription>Update the role details below.</DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="edit-roleName">Role Name *</Label>
          <Input
            id="edit-roleName"
            name="roleName"
            value={formData.roleName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="edit-description">Description *</Label>
          <Textarea
            id="edit-description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            required
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className='bg-[#B91434] text-white hover:bg-white hover:text-[#B91434] hover:border-[#B91434] border-1 hover:border-1 '>Save Changes</Button>
      </DialogFooter>
    </form>
  );
}
