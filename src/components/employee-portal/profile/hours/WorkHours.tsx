import React, { useState, useEffect, useRef } from 'react';
import {
  WorkHoursHeader,
  SessionTimer,
  ManualEntry,
  WeeklyProgress,
  LogHistory
} from './components';
import type { LogEntry } from './components/types';

export default function WorkHours() {
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
        <WorkHoursHeader totalHours={totalHours} targetHours={targetHours} />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-8">
            <SessionTimer 
              isTimerRunning={isTimerRunning}
              elapsedSeconds={elapsedSeconds}
              onStartTimer={() => setIsTimerRunning(true)}
              onEndTimer={handleEndTimer}
              formatTime={formatTime}
            />
            <ManualEntry 
              selectedDate={selectedDate}
              hours={hours}
              description={description}
              onDateChange={setSelectedDate}
              onHoursChange={setHours}
              onDescriptionChange={setDescription}
              onSubmit={handleManualSubmit}
            />
          </div>
          
          <div className="lg:col-span-8 space-y-8">
            <WeeklyProgress totalHours={totalHours} targetHours={targetHours} />
            <LogHistory logs={logs} onDeleteLog={deleteLog} />
          </div>
        </div>
      </main>
    </div>
  );
}