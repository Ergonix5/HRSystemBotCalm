"use client";

import {
  Shield,
  Users,
  Lock,
  Pencil,
  UserRoundPen,
  Trash2,
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
}

export default function ReusableRoleCard({
  role,
  availablePermissions,
  onEdit,
  onPermissions,
  onDelete,
  formatDateTime,
}: ReusableRoleCardProps) {


  return (
    <div
      className="
         rounded-md  p-5 transition-all max-w-[350px]
         border-1 border-t-[#B91434] border-t-3 hover:shadow-md
      "
    >
      {/* Header */}
       <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          
            <Shield className="size-8 text-[#B91434]" />
       
          <div>
            <h3 className="font-bold text-xl text-gray-900  ">{role.roleName}</h3>
            <p className="text-[10px]  text-gray-600 uppercase ">{role.role_id}</p>
          </div>
        </div>
       <span
          className={`capitalize px-2 py-1 rounded-full text-xs font-medium ${
            role.status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {role.status}
        </span>
      
      </div>
      {/* <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="
              p-3 rounded-lg border
              bg-[#B91434]/10 border-[#B91434]/30
              text-[#B91434]
            "
          >
            <Shield className="size-6" />
          </div>

          <div>
            <h3 className="font-semibold text-base">{role.roleName}</h3>
            <p className="text-xs text-muted-foreground">{role.role_id}</p>
          </div>
        </div>

        <span
          className={`capitalize px-2 py-1 rounded-full text-xs font-medium ${
            role.status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {role.status}
        </span>
      </div> */}

      {/* Description */}
      {/* <p className="text-sm text-muted-foreground mb-4 min-h-[40px]">
        {role.description}
      </p> */}
       <p className="text-sm text-gray-700  mb-6  ">
        {role.description || "No description provided for this security role."}
      </p>

      {/* Stats */}
      {/* <div className="flex items-center gap-6 mb-4 pb-4 border-b">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-[#B91434]" />
          <span className="text-sm">
            <span className="font-semibold">{role.userCount}</span> users
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Lock className="size-4 text-[#B91434]" />
          <span className="text-sm">
            <span className="font-semibold">
              {role.permissions.length}
            </span>{" "}
            permissions
          </span>
        </div>
      </div> */}

       <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-[#B91434]">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-900">
            <Users className="size-4 text-[#B91434]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900 ">{role.userCount}</span>
            <span className="text-[10px] text-gray-400 uppercase font-medium">Users</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-900">
            <Lock className="size-4 text-[#B91434]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900 ">{role.permissions.length}</span>
            <span className="text-[10px] text-gray-400 uppercase font-medium">Permissions</span>
          </div>
        </div>
      </div>

      {/* Key Permissions */}
      <div className="mb-4 py-4">
        <p className="text-xs font-medium mb-2 text-muted-foreground">
          Key Permissions
        </p>

        <div className="flex flex-wrap gap-1.5">
          {role.permissions.slice(0, 3).map((permId) => {
            const perm = availablePermissions.find(
              (p) => p.id === permId
            );

            return (
              perm && (
                <Badge
                  key={permId}
                  variant="outline"
                  className="
                    text-xs border-[#B91434]/30 text-black
                  "
                >
                  {perm.name}
                </Badge>
              )
            );
          })}

          {role.permissions.length > 3 && (
            <span className="text-xs text-[#B91434] font-semibold self-center ml-1">
              +{role.permissions.length - 3} others
            </span>
          )}
        </div>
      </div>

     {/* Actions */}
      <div className="flex items-center gap-2">
        <Button 
          size="sm" 
          className="flex-1 font-semibold shadow-sm shadow-[#B91434]/20 bg-[#B91434] hover:bg-[#B91434]/90 transition-all" 
          onClick={() => onPermissions(role)}
        >
          <UserRoundPen className="size-4 mr-2" /> Permissions
        </Button>
          <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(role)}
        >
          <Pencil className="size-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(role)}
        >
          <Trash2 className="size-4" />
        </Button>
      
      </div>

      {/* Updated */}
      <div className="text-[10px] text-gray-400 mt-5 pt-4 border-t border-gray-50  flex justify-between items-center">
        <span>Updated: {formatDateTime(role.updatedAt)}</span>
      </div>
    </div>
  );
}
