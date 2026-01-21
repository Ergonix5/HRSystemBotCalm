"use client";

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { X } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../ui/select';
import { type Role, type Company } from '@/src/app/types/types';

interface EditRoleProps {
  selectedRole: Role | null;
  formData: { roleName: string; description: string; status?: string; companyId?: string };
  setFormData: (data: { roleName: string; description: string; status?: string; companyId?: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  companies?: Company[];
}

export default function EditRole({ selectedRole, formData, setFormData, onSubmit, onCancel, companies = [] }: EditRoleProps) {
  if (!selectedRole) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mx-auto bg-white border border-black/10 shadow-xl overflow-hidden flex flex-col sm:flex-row">
      {/* Left Accent Border */}
      <div className="w-full sm:w-[6px] h-[6px] sm:h-auto bg-[#B91434] flex-shrink-0" />
      
      <div className="flex-grow">
        {/* Header */}
        <div className="bg-neutral-50 p-4 sm:p-6 md:p-8 border-b border-neutral-100 relative w-full">
          <h2 className="text-2xl sm:text-2xl md:text-3xl font-black text-black tracking-tighter uppercase">
            Edit Role
          </h2>
          <p className="text-neutral-500 text-xs sm:text-sm mt-2 font-medium">
            Update the role details below.
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
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
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
            <Label htmlFor="edit-status">Status *</Label>
            <Select value={formData.status || "active"} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger id="edit-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="edit-companyId">Company *</Label>
          <Select value={formData.companyId || ""} onValueChange={(value) => setFormData({ ...formData, companyId: value })}>
            <SelectTrigger id="edit-companyId">
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

      <div className="flex justify-end gap-4 pt-6 border-t flex-col-reverse sm:flex-row">
        <Button type="button" variant="outline" onClick={onCancel} className="border-black text-black hover:bg-neutral-50 w-full sm:w-auto">Cancel</Button>
        <Button type="submit" className='bg-[#B91434] text-white hover:bg-black w-full sm:w-auto'>Save Changes</Button>
      </div>
    </form>
    </div>
    </div>
  );
}
