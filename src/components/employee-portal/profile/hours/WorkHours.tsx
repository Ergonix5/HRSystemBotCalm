import React, { useState } from "react";
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Edit3
} from "lucide-react";
import { Button } from "../../../ui/button";
import { Card, CardContent, CardHeader } from "../../../ui/card";
import { Input } from "../../../ui/input";
import { Progress } from "../../../ui/progress";

export default function WorkHours() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');

  const weeklyHours = [
    { date: '2024-01-15', hours: 8, description: 'Development work' },
    { date: '2024-01-16', hours: 7.5, description: 'Client meetings' },
    { date: '2024-01-17', hours: 8, description: 'Code review' },
    { date: '2024-01-18', hours: 6, description: 'Testing' },
    { date: '2024-01-19', hours: 4, description: 'Documentation' },
  ];

  const totalHours = weeklyHours.reduce((sum, day) => sum + day.hours, 0);
  const targetHours = 40;
  const remainingHours = Math.max(0, targetHours - totalHours);

  const handleSubmit = () => {
    if (!hours || !description) return;
    // Add logic to save hours
    setHours('');
    setDescription('');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Work Hours</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Track your weekly hours - Target: 40 hours</p>
        </div>
          <Button variant="custom">+ Log Hours</Button>
      </div>

      {/* Weekly Progress */}
      <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">This Week</p>
          <Clock className="h-4 w-4 text-slate-600" />
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{totalHours}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">/ {targetHours} hours</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">
            {remainingHours > 0 ? `${remainingHours} hours remaining` : 'Target completed!'}
          </p>
          <Progress value={(totalHours / targetHours) * 100} className="bg-slate-200 dark:bg-slate-700 [&>div]:bg-slate-800 [&>div]:dark:bg-slate-600" />
        </CardContent>
      </Card>

      {/* Log Hours Form */}
      <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardHeader>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Log Hours</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-9 border-slate-300 dark:border-slate-600"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Hours</label>
              <Input
                type="number"
                step="0.5"
                max="24"
                placeholder="8.0"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="border-slate-300 dark:border-slate-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
            <Input
              placeholder="What did you work on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-slate-300 dark:border-slate-600"
            />
          </div>
          <Button 
            onClick={handleSubmit}
            disabled={!hours || !description}
            className="bg-slate-800 hover:bg-slate-900 text-white"
          >
            Save Hours
          </Button>
        </CardContent>
      </Card>

      {/* Hours Log */}
      <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardHeader>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Recent Entries</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weeklyHours.map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-100">{entry.description}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 dark:text-slate-100">{entry.hours}h</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit3 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}