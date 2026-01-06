import { Timer, Play, Square } from 'lucide-react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';

interface SessionTimerProps {
  isTimerRunning: boolean;
  elapsedSeconds: number;
  onStartTimer: () => void;
  onEndTimer: () => void;
  formatTime: (seconds: number) => string;
}

export default function SessionTimer({ 
  isTimerRunning, 
  elapsedSeconds, 
  onStartTimer, 
  onEndTimer, 
  formatTime 
}: SessionTimerProps) {
  return (
    <Card>
      <CardContent>
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
            <Button onClick={onStartTimer} className="w-full">
              <Play size={14} fill="currentColor" /> Start Timer
            </Button>
          ) : (
            <Button onClick={onEndTimer} variant="outline" className="w-full">
              <Square size={14} fill="currentColor" /> Finish & Log
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}