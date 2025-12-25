import { Button } from "@/src/components/ui/button";
import { CheckCircle2, Clock, Info, Calendar, Check, Trash2 } from "lucide-react";

export interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  type: string;
  color: string;
  unread: boolean;
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'approval': return <CheckCircle2 className="w-5 h-5" />;
    case 'reminder': return <Clock className="w-5 h-5" />;
    default: return <Info className="w-5 h-5" />;
  }
};

const getColorClasses = (color: string) => {
  const maps = {
    blue: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
    yellow: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
    green: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
  };
  return maps[color as keyof typeof maps] || maps.blue;
};

export function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  return (
    <div 
      className={`group relative p-3 lg:p-6 flex gap-3 lg:gap-6 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 ${
        notification.unread ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-700/30'
      }`}
    >
      {/* Status Indicator Bar */}
      <div className={`w-1 shrink-0 rounded-full ${
        notification.unread ? 'bg-[#B91434] dark:bg-slate-200' : 'bg-transparent'
      }`} />

      {/* Icon Block */}
      <div className={`mt-1 p-1.5 lg:p-3 rounded-lg h-fit ${getColorClasses(notification.color)} bg-opacity-10 border-none`}>
        {getIcon(notification.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 lg:gap-4">
          <p className={`text-xs lg:text-base ${notification.unread ? 'font-bold text-slate-800 dark:text-slate-100' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
            {notification.title}
          </p>
          <span className="text-[10px] lg:text-sm text-slate-400 dark:text-slate-500 whitespace-nowrap flex items-center gap-1">
            <Calendar className="w-2.5 h-2.5 lg:w-4 lg:h-4" />
            {notification.time}
          </span>
        </div>
        <p className="mt-1 text-xs lg:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
          {notification.description}
        </p>
        
        {/* Action Buttons */}
        <div className="mt-2 lg:mt-4 flex flex-col lg:flex-row gap-2 lg:gap-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
          {notification.unread && (
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => onMarkAsRead(notification.id)}
              className="text-[10px] lg:text-sm h-auto p-0 text-slate-600 dark:text-slate-300 font-semibold justify-start"
            >
              <Check className="w-2.5 h-2.5 lg:w-4 lg:h-4 mr-1" /> Mark as read
            </Button>
          )}
          <Button 
            variant="ghost"
            size="sm"
            onClick={() => onDelete(notification.id)}
            className="text-[10px] lg:text-sm h-auto p-0 text-slate-400 dark:text-slate-500 hover:text-red-500 justify-start"
          >
            <Trash2 className="w-2.5 h-2.5 lg:w-4 lg:h-4 mr-1" /> Dismiss
          </Button>
        </div>
      </div>

      {/* Unread Indicator */}
      {notification.unread && (
        <div className="absolute mt-[-10] right-3 lg:top-6 lg:right-6 w-1.5 h-1.5 lg:w-3 lg:h-3 bg-[#B91434] dark:bg-slate-200 rounded-full" />
      )}
    </div>
  );
}