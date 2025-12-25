import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { ChevronDown, Plane, Stethoscope, User, MoreHorizontal } from "lucide-react";
import type { LeaveBalances } from "./types";

interface LeaveTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
  balances: LeaveBalances;
}

const leaveTypes = [
  { id: "Vacation", icon: Plane, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "Sick Leave", icon: Stethoscope, color: "text-emerald-500", bg: "bg-emerald-50" },
  { id: "Personal", icon: User, color: "text-purple-500", bg: "bg-purple-50" },
  { id: "Other", icon: MoreHorizontal, color: "text-slate-500", bg: "bg-slate-50" },
];

export function LeaveTypeSelector({ selectedType, onTypeChange, balances }: LeaveTypeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedData = leaveTypes.find(t => t.id === selectedType) || leaveTypes[0];

  return (
    <div className="relative">
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
        Type of Leave
      </label>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3.5 bg-white border-2 border-gray-100 rounded-xl hover:border-[#B91434]/30 h-auto"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${selectedData.bg} ${selectedData.color}`}>
            <selectedData.icon className="h-5 w-5" />
          </div>
          <div className="text-left">
            <div className="text-sm font-bold text-gray-900">{selectedType || "Select Leave"}</div>
            <div className="text-[10px] text-gray-500">{balances[selectedType] || 0} days remaining</div>
          </div>
        </div>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2">
          {leaveTypes.map((type) => (
            <Button
              key={type.id}
              variant="ghost"
              onClick={() => {
                onTypeChange(type.id);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg h-auto justify-start"
            >
              <div className={`p-2 rounded-lg ${type.bg} ${type.color}`}>
                <type.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-semibold text-gray-900">{type.id}</div>
                <div className="text-xs text-gray-500">{balances[type.id]} days available</div>
              </div>
              {selectedType === type.id && <div className="w-2 h-2 rounded-full bg-[#B91434]" />}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}