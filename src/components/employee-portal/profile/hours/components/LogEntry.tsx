import { CheckCircle2, Calendar, User, Trash2 } from 'lucide-react';
import { LogEntry as LogEntryType } from './types';

interface LogEntryProps {
  log: LogEntryType;
  onDelete: (id: number) => void;
}

export default function LogEntry({ log, onDelete }: LogEntryProps) {
  return (
    <div className="bg-white px-6 py-4 flex items-center justify-between rounded-lg border border-[#F0F0F0] hover:border-[#B91434]/20 transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-[#FFF5F6] text-[#B91434] rounded-full flex items-center justify-center shrink-0">
          <CheckCircle2 size={18} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-bold text-[#1A1A1A]">
              {log.description}
            </span>
            <span className="text-[10px] font-bold text-[#717171] bg-[#F5F5F5] px-1.5 py-0.5 rounded">
              {log.ticket}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-[12px] text-[#717171]">
            <span className="flex items-center gap-1"><Calendar size={12}/> {log.date}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="flex items-center gap-1"><User size={12}/> Admin</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-[16px] font-bold">{log.hours.toFixed(1)}h</p>
        </div>
        <button 
          onClick={() => onDelete(log.id)}
          className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-[#B91434] transition-all"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}