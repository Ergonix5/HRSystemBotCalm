"use client";

import { Spinner } from "@/src/components/ui/spinner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/src/components/ui/card";
import { MetricCard } from "@/src/components/ui/metric-card";
import { CustomTooltip } from "@/src/components/ui/custom-tooltip";

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Users, CalendarDays, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAttendanceData, chartData, chartConfig } from '@/src/hooks/useAttendanceData';

// --- Main Chart Component ---

export function AttendanceAnalyticsDashboard() {
  const [mounted, setMounted] = useState(false);
  const { lastMonth, previousMonth, rateChange, isPositiveChange, latestPresenceRate, presentColor, absentColor } = useAttendanceData();

  useEffect(() => {
    setMounted(true);
  }, []);

  const ChangeIcon = isPositiveChange ? TrendingUp : TrendingDown;
  const changeStyle = isPositiveChange ? { color: presentColor } : { color: absentColor };


  // --- Loading State ---
  if (!mounted) {
    return (
      <Spinner className="mx-auto items-center" />
    );
  }

  // --- Main Chart Render ---
  return (
    <div className="p-4 sm:p-8 min-h-screen">
      <Card className="max-w-4xl mx-auto w-full">
        <CardHeader>
          <CardTitle>Employee Attendance Analytics - Professional View</CardTitle>
          <CardDescription>Side-by-side comparison of present and absent days (Jan - {lastMonth.month} 2024)</CardDescription>
        </CardHeader>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 pb-4">
          <MetricCard title="Latest Rate" value={`${latestPresenceRate}%`} icon={Users} style={{ color: '#2563EB' }} description={`Attendance Rate for ${lastMonth.month}`} />
          <MetricCard title="Total Present" value={lastMonth.present} icon={CalendarDays} style={{ color: presentColor }} description={`${lastMonth.month} Days Present`} />
          <MetricCard title="Total Absent" value={lastMonth.absent} icon={AlertTriangle} style={{ color: absentColor }} description={`${lastMonth.month} Days Absent`} />
          <MetricCard title="Rate Change" value={`${isPositiveChange ? '+' : ''}${Math.abs(rateChange).toFixed(2)}%`} icon={ChangeIcon} style={changeStyle} description={`vs. ${previousMonth.month} Presence Rate`} />
        </div>

        <CardContent className="h-88 md:h-100">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              // Setting a small gap between bar groups (months)
              barCategoryGap="10%"
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" tickLine={false} tickMargin={10} axisLine={false} />
              <YAxis allowDecimals={false} stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" wrapperStyle={{ paddingTop: '10px', paddingBottom: '20px' }} />
              <Bar dataKey="present" name={chartConfig.present.label} fill={chartConfig.present.color} radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" name={chartConfig.absent.label} fill={chartConfig.absent.color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>

        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-semibold" style={changeStyle}>
            {isPositiveChange ? 'Improvement' : 'Decline'} in attendance rate by {Math.abs(rateChange).toFixed(2)}%
            <ChangeIcon className="h-4 w-4" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}



export const StudentAttendanceChart = AttendanceAnalyticsDashboard;
export default AttendanceAnalyticsDashboard;