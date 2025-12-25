import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, Calendar, CheckCircle2, 
  Plus, Play, Square, History, 
  Trash2, Timer, User, 
  MoreHorizontal
} from 'lucide-react';

// --- Types ---
interface LogEntry {
  id: number;
  date: string;
  hours: number;
  description: string;
  ticket: string;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  className?: string;
  disabled?: boolean;
}

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

// --- Light Theme Design Tokens ---
const colors = {
  primary: "#B91434",
  text: "#1A1A1A",
  subtle: "#717171",
  border: "#F0F0F0",
  bg: "#FFFFFF",
  lightAccent: "#FFF5F6"
};

// --- Minimalist UI Components ---
const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-white border border-[#F0F0F0] rounded-lg ${className}`}>
    {children}
  </div>
);

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = "primary", className = "", disabled = false }) => {
  const variants: Record<string, string> = {
    primary: "bg-[#B91434] text-white hover:bg-[#A0122D] shadow-sm",
    secondary: "bg-white border border-[#F0F0F0] text-[#1A1A1A] hover:bg-gray-50",
    ghost: "bg-transparent text-[#717171] hover:text-[#B91434]",
    outline: "bg-transparent border border-[#B91434] text-[#B91434] hover:bg-[#FFF5F6]"
  };
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`px-5 py-2.5 transition-all duration-200 rounded-md flex items-center justify-center gap-2 font-semibold text-[13px] disabled:opacity-30 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const InputField: React.FC<InputFieldProps> = ({ label, ...props }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-[11px] font-bold uppercase tracking-wider text-[#717171]">
      {label}
    </label>
    <input 
      {...props} 
      className="w-full bg-white border border-[#F0F0F0] focus:border-[#B91434] focus:ring-1 focus:ring-[#B91434] px-4 py-2.5 text-[14px] outline-none rounded-md transition-all placeholder:text-gray-300"
    />
  </div>
);

export default function JiraWorkHours() {
  // --- State Management ---
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [hours, setHours] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 1, date: '2025-12-24', hours: 4.5, description: 'Client review and design adjustments', ticket: 'UI-01' },
    { id: 2, date: '2025-12-24', hours: 2.0, description: 'Weekly sync and sprint planning', ticket: 'DEV-04' },
  ]);

  const targetHours = 40;
  const totalHours = logs.reduce((sum, log) => sum + log.hours, 0);

  // --- Timer Logic ---
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => setElapsedSeconds(prev => prev + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEndTimer = () => {
    const decimalHours = parseFloat((elapsedSeconds / 3600).toFixed(2));
    if (decimalHours > 0.01) {
      const newLog: LogEntry = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        hours: decimalHours,
        description: `Active session: ${formatTime(elapsedSeconds)}`,
        ticket: 'SESSION'
      };
      setLogs([newLog, ...logs]);
    }
    setIsTimerRunning(false);
    setElapsedSeconds(0);
  };

  const handleManualSubmit = () => {
    if (!hours || !description) return;
    const newLog: LogEntry = {
      id: Date.now(),
      date: selectedDate,
      hours: parseFloat(hours),
      description,
      ticket: 'MANUAL'
    };
    setLogs([newLog, ...logs]);
    setHours('');
    setDescription('');
  };

  const deleteLog = (id: number) => {
    setLogs(logs.filter(log => log.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-[#1A1A1A]">
      <main className="max-w-5xl mx-auto p-6 md:p-12">
        
        {/* Light Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">Track your working time on here</h1>
            <p className="text-[#717171] text-[14px] mt-1">Track and manage your weekly work hours</p>
          </div>
          <div className="flex items-center gap-8 bg-white p-4 rounded-xl border border-[#F0F0F0] shadow-sm">
            <div className="text-center px-4 border-r border-[#F0F0F0]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#717171] mb-1">Target</p>
              <p className="text-xl font-bold">40.0</p>
            </div>
            <div className="text-center px-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#B91434] mb-1">Logged</p>
              <p className="text-xl font-bold text-[#B91434]">{totalHours.toFixed(1)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Column */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Session Timer */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#717171] flex items-center gap-2">
                  <Timer size={14} /> Active Session
                </span>
                {isTimerRunning && (
                  <span className="w-2 h-2 bg-[#B91434] rounded-full animate-pulse" />
                )}
              </div>
              <div className="text-4xl font-bold mb-8 text-center tabular-nums text-[#1A1A1A]">
                {formatTime(elapsedSeconds)}
              </div>
              <div className="flex flex-col gap-2">
                {!isTimerRunning ? (
                  <Button onClick={() => setIsTimerRunning(true)} variant="primary" className="w-full">
                    <Play size={14} fill="currentColor" /> Start Timer
                  </Button>
                ) : (
                  <Button onClick={handleEndTimer} variant="outline" className="w-full">
                    <Square size={14} fill="currentColor" /> Finish & Log
                  </Button>
                )}
              </div>
            </Card>

            {/* Manual Entry */}
            <Card className="p-6">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#717171] mb-6 flex items-center gap-2">
                <Plus size={14} /> Add Manual Entry
              </h3>
              <div className="space-y-5">
                <InputField 
                  label="Work Date" 
                  type="date" 
                  value={selectedDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedDate(e.target.value)}
                />
                <InputField 
                  label="Hours" 
                  type="number"
                  step="0.25"
                  placeholder="0.0"
                  value={hours}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHours(e.target.value)}
                />
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#717171]">Description</label>
                  <textarea 
                    className="w-full bg-white border border-[#F0F0F0] focus:border-[#B91434] focus:ring-1 focus:ring-[#B91434] px-4 py-2 text-[14px] outline-none rounded-md min-h-25 transition-all"
                    placeholder="Briefly describe your task..."
                    value={description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleManualSubmit} 
                  className="w-full"
                  disabled={!hours || !description}
                  variant="secondary"
                >
                  Save Entry
                </Button>
              </div>
            </Card>
          </div>

          {/* List Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Weekly Progress Bar */}
            <div className="bg-white p-6 rounded-lg border border-[#F0F0F0] shadow-sm">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#717171]">Weekly Progress</h3>
                  <span className="text-[13px] font-bold text-[#B91434]">{Math.min(100, (totalHours/targetHours)*100).toFixed(0)}%</span>
               </div>
               <div className="w-full h-2 bg-[#F5F5F5] rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-[#B91434] transition-all duration-1000 ease-out" 
                   style={{ width: `${Math.min(100, (totalHours/targetHours)*100)}%` }}
                 />
               </div>
            </div>

            {/* Log Archive */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#717171] flex items-center gap-2">
                  <History size={14} /> Log History
                </h3>
              </div>
              
              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="bg-white px-6 py-4 flex items-center justify-between rounded-lg border border-[#F0F0F0] hover:border-[#B91434]/20 transition-all group">
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
                        onClick={() => deleteLog(log.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-[#B91434] transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="py-20 text-center bg-white border border-dashed border-gray-200 rounded-lg">
                    <p className="text-[13px] text-gray-400 font-medium">No work hours logged yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}