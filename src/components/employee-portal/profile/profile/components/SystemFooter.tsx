import { Lock } from "lucide-react";
import type { SystemData } from "./types";

interface SystemFooterProps {
  systemData: SystemData;
}

export function SystemFooter({ systemData }: SystemFooterProps) {
  return (
    <div className="flex justify-between items-center py-6 border-t border-black/5 text-[10px] font-bold uppercase tracking-widest text-black/30">
      <div className="flex items-center gap-2">
        <span>{systemData.company}</span>
        <Lock size={10} className="opacity-50" />
      </div>
      <div className="flex gap-4 text-black/30">
        <span className="text-[#B91434]">Verified Secure</span>
        <span>2025</span>
      </div>
    </div>
  );
}