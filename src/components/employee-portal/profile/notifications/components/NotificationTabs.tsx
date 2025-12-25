import { Badge } from "@/src/components/ui/badge";

interface NotificationTabsProps {
  filter: string;
  onFilterChange: (filter: string) => void;
  unreadCount: number;
}

const tabs = ['all', 'unread', 'read'] as const;

export function NotificationTabs({ filter, onFilterChange, unreadCount }: NotificationTabsProps) {
  return (
    <div className="flex border-b border-slate-200 dark:border-slate-700 -mb-4 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onFilterChange(tab)}
          className={`px-3 lg:px-6 py-2 lg:py-3 text-xs lg:text-base font-medium capitalize transition-all relative whitespace-nowrap ${
            filter === tab 
            ? 'text-slate-800 dark:text-slate-200' 
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          {tab}
          {filter === tab && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-800 dark:bg-slate-200 rounded-full" />
          )}
          {tab === 'unread' && unreadCount > 0 && (
            <Badge variant="secondary" className="ml-1 lg:ml-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[9px] lg:text-xs">
              {unreadCount}
            </Badge>
          )}
        </button>
      ))}
    </div>
  );
}