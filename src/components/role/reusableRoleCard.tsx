"use client";

import {
  Shield,
  Users,
  Lock,
  Pencil,
  UserRoundPen,
  Trash2,
  Clock,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
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
  const isActive = role.status === "Active";

  return (
    <div className=" relative flex flex-col w-full overflow-hidden transition-all duration-500 bg-white border border-slate-200 rounded-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-1.5">
      
      {/* Top Accent Strip */}
      <div className="h-1 w-full bg-gradient-to-r from-[#B91434] via-[#e21b41] to-[#B91434] " />

      <div className="relative p-6 flex flex-col flex-grow">
        {/* Background pattern */}
        {/* <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
          <Shield className="size-32" />
        </div> */}

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4">
            {/* <div className="relative flex items-center justify-center size-14 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-[#B91434] group-hover:border-[#B91434] transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[#B91434]/30">
              <Shield className="size-7 text-[#B91434] group-hover:text-white transition-colors duration-300" />
            </div> */}

            <div className="flex flex-col">
              <h3 className="text-xl font-extrabold tracking-normal uppercase text-[#B91434] transition-colors">
                {role.roleName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded uppercase">
                  ID: {role.role_id}
                </span>
                {companyName && (
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    • {companyName}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border-2 ${
            isActive 
              ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
              : "bg-red-50 text-red-600 border-red-100"
          }`}>
            <span className={`size-1.5 rounded-full ${isActive ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
            {role.status}
          </div>
        </div>

        {/* Description */}
        <div className="relative mb-6">
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 min-h-[40px] italic">
            {role.description || "No description provided for this security role."}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex flex-col p-3 rounded-xl bg-slate-50/80 border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-all">
            <div className="flex items-center gap-2 mb-1">
              <Users className="size-3.5 text-[#B91434]" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Users</span>
            </div>
            <span className="text-lg font-black text-slate-900">{role.userCount}</span>
          </div>

          <div className="flex flex-col p-3 rounded-xl bg-slate-50/80 border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-all">
            <div className="flex items-center gap-2 mb-1">
              <Lock className="size-3.5 text-[#B91434]" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Access</span>
            </div>
            <span className="text-lg font-black text-slate-900">{role.permissions.length}</span>
          </div>
        </div>

        {/* Permissions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              Capabilities
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {role.permissions.slice(0, 3).map((permId) => {
              const perm = availablePermissions.find((p) => p.id === permId);
              return perm ? (
                <div
                  key={permId}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 text-slate-600 rounded-lg shadow-sm group-hover:border-slate-300 transition-colors"
                >
                  {perm.name}
                </div>
              ) : null;
            })}

            {role.permissions.length > 3 && (
              <div className="px-2.5 py-1 text-[10px] font-bold text-[#B91434] bg-[#B91434]/5 border border-[#B91434]/20 rounded-lg flex items-center">
                +{role.permissions.length - 3} MORE
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-3">
          <button
            onClick={() => onPermissions(role)}
            className="group/btn relative w-full h-11 bg-slate-900 text-white text-xs font-black  flex items-center justify-center gap-2 overflow-hidden transition-all active:scale-[0.98] hover:bg-[#B91434] hover:shadow-lg hover:shadow-[#B91434]/30"
          >
            <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-20deg] -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
            <UserRoundPen className="size-4" />
            <span className="tracking-widest uppercase"> Permissions</span>
            <ChevronRight className="size-4 opacity-50 group-hover/btn:translate-x-1 transition-transform" />
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => onEdit(role)}
              className="flex-1 h-8 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest bg-white border border-slate-200 text-slate-700  hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98]"
            >
              <Pencil className="size-3.5" />
              Edit
            </button>

            <button
              onClick={() => onDelete(role)}
              className="flex-1 h-8 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest bg-white border border-slate-200 text-slate-400  hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all active:scale-[0.98]"
            >
              <Trash2 className="size-3.5" />
              Delete
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
            <Clock className="size-3" />
           <span>
  Updated: {formatDateTime(role.updatedAt ?? role.createdAt)}
</span>

          </div>
          <button className="text-slate-300 hover:text-slate-600 transition-colors">
            <MoreVertical className="size-4" />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </div>
  );
}
