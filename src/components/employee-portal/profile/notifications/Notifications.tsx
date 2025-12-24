import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Info, 
  MoreHorizontal,
  Check,
  Trash2
} from "lucide-react";
import { useNotifications } from '../../../../contexts/NotificationContext';


const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="px-4 lg:px-8 py-4 lg:py-6 border-b border-slate-200 dark:border-slate-700 flex flex-col gap-4">
    {children}
  </div>
);

const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg lg:text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
    
    {children}
  </h2>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="p-0">
    {children}
  </div>
);



export default function Notifications() {
  const [filter, setFilter] = useState('all');
  const { notifications, setNotifications } = useNotifications();

  const filteredNotifications = useMemo(() => {
    if (filter === 'unread') return notifications.filter(n => n.unread);
    if (filter === 'read') return notifications.filter(n => !n.unread);
    return notifications;
  }, [filter, notifications]);

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, unread: false } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

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

  return (
    <div className="w-full max-w-6xl mx-auto p-4 lg:p-8">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 mb-10">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 ">Notications</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Manage your time off requests and view balance.</p>
        </div>
       
      </div>
      <Card>
        <CardHeader>
        
          {/* Tabs UI */}
          <div className="flex border-b border-slate-200 dark:border-slate-700 -mb-4 overflow-x-auto">
            {['all', 'unread', 'read'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
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
                {tab === 'unread' && notifications.some(n => n.unread) && (
                   <span className="ml-1 lg:ml-2 px-1 lg:px-2 py-0.5 lg:py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[9px] lg:text-xs rounded-full">
                     {notifications.filter(n => n.unread).length}
                   </span>
                )}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div 
                  key={notification.id}
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
                    
                    {/* Action Buttons (Visible on Hover/Touch) */}
                    <div className="mt-2 lg:mt-4 flex flex-col lg:flex-row gap-2 lg:gap-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      {notification.unread && (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="text-[10px] lg:text-sm flex items-center gap-1 text-slate-600 dark:text-slate-300 font-semibold"
                        >
                          <Check className="w-2.5 h-2.5 lg:w-4 lg:h-4" /> Mark as read
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(notification.id)}
                        className="text-[10px] lg:text-sm flex items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-2.5 h-2.5 lg:w-4 lg:h-4" /> Dismiss
                      </button>
                    </div>
                  </div>

                {/* Unread Indicator */}
                  {notification.unread && (
                    <div className="absolute mt-[-10] right-3 lg:top-6 lg:right-6 w-1.5 h-1.5 lg:w-3 lg:h-3 bg-[#B91434] dark:bg-slate-200 rounded-full" />
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 lg:p-16 text-center">
                
                <p className="text-slate-500 dark:text-slate-400 text-xs lg:text-base font-medium">No {filter !== 'all' ? filter : ''} notifications found</p>
              </div>
            )}
          </div>
        </CardContent>
        
        {filteredNotifications.length > 0 && (
          <div className="px-4 lg:px-8 py-3 lg:py-4 bg-slate-50 dark:bg-slate-700 border-t border-slate-200 dark:border-slate-700">
            <p className="text-[10px] lg:text-sm text-slate-400 dark:text-slate-500 text-center italic">
              Showing {filteredNotifications.length} notifications
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}