"use client";

import {
  Shield,
  Users,
  Lock,
  Pencil,
  UserRoundPen,
  Trash2,
  Clock,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { type Role, type Permission } from "@/src/app/types/types";

interface ReusableRoleCardProps {
  role: Role;
  availablePermissions: Permission[];
  onEdit: (role: Role) => void;
  onPermissions: (role: Role) => void;
  onDelete: (role: Role) => void;
  formatDateTime: (date: string) => string;
  companyName?: string;
}

export default function ReusableRoleCard({
  role,
  availablePermissions,
  onEdit,
  onPermissions,
  onDelete,
  formatDateTime,
  companyName,
}: ReusableRoleCardProps) {
  return (
    <div className="group relative border-black/50 bg-white border  overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1 w-full flex flex-col">
      
      {/* Top Accent */}
      {/* <div className="h-1.5 w-full bg-[#B91434]" /> */}

      <div className="p-6 flex flex-col flex-grow">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4">
            <div className="flex items-center justify-center size-12 rounded-xl bg-[#B91434]/5 border border-[#B91434]/10 group-hover:bg-[#B91434] group-hover:text-white transition-colors text-[#B91434]">
              <Shield className="size-6" />
            </div>

            <div>
              <h3 className="font-bold text-lg text-black group-hover:text-[#B91434] transition-colors">
                {role.roleName}
              </h3>
              <span className="block text-[10px] font-mono text-slate-400 uppercase">
                ID: {role.role_id}
              </span>
              {companyName && (
                <span className="block text-[10px] font-bold text-slate-500 uppercase">
                  {companyName}
                </span>
              )}
            </div>
          </div>

          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
              role.status === "Active"
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-red-50 text-red-700 border-red-100"
            }`}
          >
            {role.status}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-grow">
          {role.description || "No description provided for this security role."}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-0 border border-slate-100 rounded-lg overflow-hidden mb-6">
          <div className="flex items-center gap-3 p-3 bg-slate-50/50 border-r border-slate-100">
            <Users className="size-4 text-[#B91434]" />
            <div>
              <span className="text-sm font-black text-black">
                {role.userCount}
              </span>
              <span className="block text-[9px] text-slate-400 uppercase font-bold">
                Users
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50/50">
            <Lock className="size-4 text-[#B91434]" />
            <div>
              <span className="text-sm font-black text-black">
                {role.permissions.length}
              </span>
              <span className="block text-[9px] text-slate-400 uppercase font-bold">
                Permissions
              </span>
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div className="mb-8">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Core Capabilities
          </span>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {role.permissions.slice(0, 3).map((permId) => {
              const perm = availablePermissions.find((p) => p.id === permId);
              return (
                perm && (
                  <Badge
                    key={permId}
                    variant="outline"
                    className="text-[11px] border-slate-200 text-slate-700 shadow-sm"
                  >
                    {perm.name}
                  </Badge>
                )
              );
            })}

            {role.permissions.length > 3 && (
              <span className="px-2 py-1 text-[10px] font-bold text-[#B91434] bg-[#B91434]/5 rounded border border-[#B91434]/10">
                +{role.permissions.length - 3} MORE
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-6 border-t border-slate-100">
          <Button
            onClick={() => onPermissions(role)}
            className="w-full h-10 bg-black text-white text-xs font-bold rounded-lg hover:bg-[#B91434]"
          >
            <UserRoundPen className="size-4 mr-2" />
            ASSIGN PERMISSIONS
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-[10px] font-bold uppercase"
              onClick={() => onEdit(role)}
            >
              <Pencil className="size-3 mr-1" /> Edit
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-[10px] font-bold uppercase hover:text-red-600 hover:border-red-200"
              onClick={() => onDelete(role)}
            >
              <Trash2 className="size-3 mr-1" /> Delete
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-400">
          <Clock className="size-3" />
          <span>Last modified: {formatDateTime(role.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}
