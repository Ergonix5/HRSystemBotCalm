"use client"

import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  ChevronDown, 
  ShieldCheck, 
  Activity,
  Info,
  AlertCircle,
  AlertTriangle,
  Zap,
  User,
  Database,
  Clock,
  MoreVertical,
  Settings,
  ArrowUpRight,
  X,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';

/**
 * LogCardProps Interface
 */
interface LogCardProps {
  status: "Success" | "Info" | "Warning" | "Error" | "Critical";
  type: string;
  module: string;
  title: string;
  description: string;
  meta: string;
  time: string;
}

const LogCard: React.FC<LogCardProps> = ({ 
  status, 
  type, 
  module, 
  title, 
  description, 
  meta, 
  time 
}) => {
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

  const config = statusConfig[status] || statusConfig.Info;

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:border-gray-300 transition-all duration-200 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text} border ${config.border}`}>
              {config.icon}
              {status}
            </div>
            
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-gray-50 text-gray-500 border border-gray-100 uppercase tracking-tight">
              <User className="w-3 h-3" />
              {type}
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-gray-50 text-gray-500 border border-gray-100 uppercase tracking-tight">
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

        <div className="space-y-3">
          <h3 className="text-base font-bold text-gray-900 leading-tight group-hover:text-[#B91434] transition-colors">
            {title}
          </h3>
          
          <div className="relative">
            <p className="text-sm text-gray-600 leading-relaxed bg-[#fcfcfc] border-l-2 border-[#B91434] p-3 rounded-r-md">
              {description}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-gray-50 mt-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium italic">
              <Settings className="w-3 h-3 text-[#B91434]" />
              {meta}
            </div>
            <button className="text-xs font-bold text-[#B91434] hover:opacity-80 flex items-center gap-1 bg-[#B91434]/5 px-3 py-1.5 rounded-lg transition-all">
              View Audit Log <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');

  const logs: LogCardProps[] = [
    {
      status: "Critical",
      type: "System",
      module: "Server",
      title: "Kernel Panic - Auto-reboot initiated",
      description: "Critical system failure on Node-04. Resources reaching 99% utilization. Failover to Node-05 successful.",
      meta: "Server: US-EAST-1 · Action: Failover",
      time: "10 mins ago"
    },
    {
      status: "Success",
      type: "User Action",
      module: "Leave Management",
      title: "Admin User - Approved leave request",
      description: "Leave request LVE-002 approved for Jane Smith (EMP-002) - Annual Leave from 2024-12-20 to 2024-12-27",
      meta: "IP: 192.168.1.101 · Tech Solutions Inc.",
      time: "Today, 02:32 PM"
    },
    {
      status: "Warning",
      type: "Performance",
      module: "Database",
      title: "Slow query detected",
      description: "Query execution time exceeded 500ms for 'SELECT * FROM employees WHERE status=active'.",
      meta: "Source: Reporting DB · Latency: 840ms",
      time: "Today, 02:20 PM"
    },
    {
      status: "Info",
      type: "Data Change",
      module: "Employee",
      title: "Admin User - Updated employee record",
      description: "Modified employee details for John Doe (EMP-001) - Updated phone number and address records.",
      meta: "IP: 192.168.1.101 · Changed: +1-555-0100 → +1-555-0101",
      time: "Today, 02:15 PM"
    },
    {
      status: "Error",
      type: "Security",
      module: "Authentication",
      title: "Failed login attempt detected",
      description: "Multiple failed login attempts detected for account user_test_01. Authentication blocked for 15 minutes.",
      meta: "IP: 45.22.11.09 · Action: Account Locked",
      time: "Today, 01:58 PM"
    }
  ];

  const displayLogs = [...logs, ...logs, ...logs];
  
  const stats = {
    total: displayLogs.length,
    success: displayLogs.filter(l => l.status === 'Success').length,
    warning: displayLogs.filter(l => l.status === 'Warning').length,
    error: displayLogs.filter(l => l.status === 'Error').length,
    critical: displayLogs.filter(l => l.status === 'Critical').length,
  };

  return (
    <div className="h-screen flex flex-col bg-[#F9FAFB] font-sans text-gray-900 overflow-hidden border border-gray-200 rounded-md">
      {/* Navbar */}
      <nav className="bg-white py-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#B91434] rounded-xl flex items-center justify-center ">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight leading-tight">Report Log</h1>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">System activity logs and audit trail</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
           
            <Button variant="outline">
              <Download className="w-3.5 h-3.5 text-[#B91434]" /> Export Logs
            </Button>
           
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 flex flex-col min-h-0 max-w-6xl w-full mx-auto p-6 space-y-4">
        {/* Advanced Filters */}
        <div className="p-5 flex-shrink-0">
          <div className="flex flex-col space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              <div className="lg:col-span-5 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search logs by ID, message, or IP..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B91434]/10 focus:border-[#B91434] transition-all"
                />
              </div>
              <div className="lg:col-span-7 flex gap-2">
                {['Modules', 'Severity', 'Companies'].map((f) => (
                  <div key={f} className="relative flex-1">
                    <select className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 focus:outline-none">
                      <option>{f}</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-gray-50">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Filter:</span>
                <span className="flex items-center gap-1 px-2 py-0.5 bg-[#B91434]/5 text-[#B91434] text-[10px] font-bold rounded-lg border border-[#B91434]/10">
                  Last 24 Hours <X className="w-2.5 h-2.5 cursor-pointer" />
                </span>
              </div>
              <button className="text-xs font-bold text-gray-400 hover:text-[#B91434] flex items-center gap-1.5">
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Log Container */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar border border-gray-200 rounded-md px-5 ">
          <div className="space-y-4 pb-6 ">
            <div className="flex items-center justify-between px-2 sticky top-0 bg-[#F9FAFB]/90 backdrop-blur-md py-3 z-10">
              <div className="flex items-center gap-2 ">
                <span className="text-xs font-black text-gray-900 uppercase tracking-widest  ">Event Timeline</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[#B91434]"></div>
              </div>
              <button className="text-[11px] font-bold text-gray-400 hover:text-gray-600 flex items-center gap-1">
                Newest First <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {displayLogs.map((log, index) => (
                <LogCard key={index} {...log} />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Performance Footer */}
      <footer className="bg-white border-t border-gray-200 flex-shrink-0 z-20 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.04)]">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-[#B91434]/5 rounded-xl border border-[#B91434]/10">
                  <Activity className="w-5 h-5 text-[#B91434]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Total Events</span>
                  <span className="text-2xl font-black text-gray-900 leading-none tabular-nums">{stats.total}</span>
                </div>
              </div>

              <div className="h-12 w-px bg-gray-100 hidden lg:block"></div>

              <div className="hidden lg:flex flex-wrap items-center gap-x-8">
                {[
                  { label: 'Success', value: stats.success, color: 'bg-green-500', text: 'text-green-600' },
                  { label: 'Warnings', value: stats.warning, color: 'bg-amber-500', text: 'text-amber-600' },
                  { label: 'Errors', value: stats.error, color: 'bg-red-500', text: 'text-red-600' },
                  { label: 'Critical', value: stats.critical, color: 'bg-purple-600', text: 'text-purple-700' }
                ].map((item) => (
                  <div key={item.label} className="flex flex-col min-w-[80px]">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${item.text}`}>{item.label}</span>
                      <span className="text-xs font-black text-gray-900">{item.value}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-in-out`}
                        style={{ width: `${(item.value / stats.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 justify-between md:justify-end">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-green-50 border border-green-100 rounded-xl">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </div>
                  <span className="text-[10px] font-black text-green-700 uppercase tracking-wider">Live Connection</span>
                </div>
                <span className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-tighter">Gateway: US-EAST-1 Active</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #B91434; }
      `}} />
    </div>
  );
}