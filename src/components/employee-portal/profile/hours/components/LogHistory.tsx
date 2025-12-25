import { History } from 'lucide-react';
import { LogEntry as LogEntryType } from './types';
import LogEntry from './LogEntry';

interface LogHistoryProps {
  logs: LogEntryType[];
  onDeleteLog: (id: number) => void;
}

export default function LogHistory({ logs, onDeleteLog }: LogHistoryProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#717171] flex items-center gap-2">
          <History size={14} /> Log History
        </h3>
      </div>
      
      <div className="space-y-3">
        {logs.map((log) => (
          <LogEntry key={log.id} log={log} onDelete={onDeleteLog} />
        ))}
        {logs.length === 0 && (
          <div className="py-20 text-center bg-white border border-dashed border-gray-200 rounded-lg">
            <p className="text-[13px] text-gray-400 font-medium">No work hours logged yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}