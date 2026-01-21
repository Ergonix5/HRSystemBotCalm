import React from 'react';
import { 
  ShieldCheck, 
  Info, 
  AlertCircle, 
  AlertTriangle, 
  Zap, 
  User, 
  Database, 
  Clock, 
  MoreVertical, 
  Settings, 
  ArrowUpRight 
} from 'lucide-react';

export interface LogCardProps {
  status: "Success" | "Info" | "Warning" | "Error" | "Critical";
  type: string;
  module: string;
  title: string;
  description: string;
  meta: string;
  time: string;
}

const statusConfig = {
  Success: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-100',
    icon: <ShieldCheck className="w-4 h-4" />
  },
  Info: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-100',
    icon: <Info className="w-4 h-4" />
  },
  Warning: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-100',
    icon: <AlertTriangle className="w-4 h-4" />
  },
  Error: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-100',
    icon: <AlertCircle className="w-4 h-4" />
  },
  Critical: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-100',
    icon: <Zap className="w-4 h-4" />
  }
};

export const LogCard: React.FC<LogCardProps> = ({ 
  status, 
  type, 
  module, 
  title, 
  description, 
  meta, 
  time 
}) => {
  const config = statusConfig[status] || statusConfig.Info;

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:border-gray-300 transition-all duration-200 overflow-hidden">
      <div className="p-5">
        {/* Tags + Time */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${config.bg} ${config.text} border ${config.border}`}>
              {config.icon}
              {status}
            </div>
            
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
              <User className="w-3 h-3" />
              {type}
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
              <Database className="w-3 h-3" />
              {module}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
              <Clock className="w-3.5 h-3.5" />
              {time}
            </div>
            <button className="text-gray-400 hover:text-gray-600 focus:outline-none">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-gray-900 leading-tight">
            {title}
          </h3>
          
          <div className="relative">
            <p className="text-sm text-gray-600 leading-relaxed bg-[#fcfcfc] border-l-2 border-[#B91434] p-3 rounded-r-md">
              {description}
            </p>
          </div>

          {/* Meta + Action */}
          <div className="pt-2 flex items-center justify-between border-t border-gray-50 mt-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 italic">
              <Settings className="w-3 h-3" />
              {meta}
            </div>
            <button className="text-xs font-semibold text-[#B91434] hover:underline flex items-center gap-1">
              View Details <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};