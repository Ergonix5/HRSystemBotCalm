'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Users, CalendarDays, AlertTriangle } from 'lucide-react';
import { Spinner } from '@/src/components/ui/spinner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line, // Added for the line chart overlay
} from 'recharts';

// --- UI Components (using inline Tailwind for single-file mandate) ---

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white shadow-xl rounded-xl p-6 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`mb-4 border-b border-gray-100 pb-4 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`text-2xl font-bold text-gray-900 ${className}`}>
    {children}
  </h2>
);

const CardDescription = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-sm text-gray-500 mt-1 ${className}`}>
    {children}
  </p>
);

const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-0 ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`mt-6 pt-4 border-t border-gray-100 ${className}`}>
    {children}
  </div>
);

// --- Configuration and Data ---

// Helper function to calculate the rate
const calculateRate = (present: number, absent: number) => {
    const total = present + absent;
    return total > 0 ? parseFloat((present / total * 100).toFixed(1)) : 0;
}

// Extended chart data for 12 months, including the calculated presence rate
const rawChartData = [
  { month: "Jan", present: 186, absent: 20 },
  { month: "Feb", present: 305, absent: 15 },
  { month: "Mar", present: 237, absent: 25 },
  { month: "Apr", present: 273, absent: 18 },
  { month: "May", present: 209, absent: 22 },
  { month: "Jun", present: 214, absent: 16 },
  // New Data (July to December)
  { month: "Jul", present: 280, absent: 15 }, 
  { month: "Aug", present: 260, absent: 28 }, 
  { month: "Sep", present: 255, absent: 12 }, 
  { month: "Oct", present: 210, absent: 18 }, 
  { month: "Nov", present: 195, absent: 10 }, 
  { month: "Dec", present: 170, absent: 30 },
];

const chartData = rawChartData.map(item => ({
    ...item,
    rate: calculateRate(item.present, item.absent),
}));

const chartConfig = {
  present: {
    label: "Days Present",
    color: "#1F4E79", // Deep Professional Blue
  },
  absent: {
    label: "Days Absent",
    color: "#D54830", // Rich Brick Red
  },
  rate: {
    label: "Presence Rate (%)",
    color: "#FFC000", // Bright Yellow/Gold for contrast line
  }
};

// --- Custom Tooltip Component for Recharts ---

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
  if (active && payload && payload.length) {
    const presentData = payload.find(p => p.dataKey === 'present');
    const absentData = payload.find(p => p.dataKey === 'absent');
    const rateData = payload.find(p => p.dataKey === 'rate');
    
    const presentValue = presentData ? presentData.value : 0;
    const absentValue = absentData ? absentData.value : 0;
    const rateValue = rateData ? rateData.value : 0;
    const total = presentValue + absentValue;

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg text-sm">
        <p className="font-semibold text-lg mb-2 text-gray-900">{label}</p>
        <p className="text-gray-700">
          <span className="font-medium" style={{ color: chartConfig.present.color }}>Present:</span> {presentValue} days
        </p>
        <p className="text-gray-700">
          <span className="font-medium" style={{ color: chartConfig.absent.color }}>Absent:</span> {absentValue} days
        </p>
        <p className="mt-2 pt-2 border-t border-gray-100 font-bold text-gray-800">
          <span style={{ color: chartConfig.rate.color }}>Rate:</span> {rateValue}% (Total {total})
        </p>
      </div>
    );
  }
  return null;
};

// --- Main Chart Component ---

export function AttendanceAnalyticsDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Client-side rendering check for Recharts
    setMounted(true);
  }, []);

  // --- Dynamic Calculations ---
  // Using the last two entries for comparison (Dec and Nov)
  const lastMonthIndex = chartData.length - 1; // Dec
  const previousMonthIndex = chartData.length - 2; // Nov

  // Handle case where there might be less than 2 months of data
  const lastMonth = chartData[lastMonthIndex] || { month: 'N/A', present: 0, absent: 0, rate: 0 };
  const previousMonth = chartData[previousMonthIndex] || { month: 'N/A', present: 0, absent: 0, rate: 0 };

  const presenceRateLastMonth = lastMonth.rate;
  const presenceRatePreviousMonth = previousMonth.rate;

  const rateChange = presenceRateLastMonth - presenceRatePreviousMonth;
  const isPositiveChange = rateChange >= 0;

  const latestPresenceRate = presenceRateLastMonth.toFixed(1);

  const presentColor = chartConfig.present.color; // #1F4E79
  const absentColor = chartConfig.absent.color; // #D54830
  
  const ChangeIcon = isPositiveChange ? TrendingUp : TrendingDown;
  // Deep Blue for improvement, Brick Red for decline
  const changeStyle = isPositiveChange 
    ? { color: presentColor } 
    : { color: absentColor }; 

  // Metric styles
  const rateMetricStyle = { color: '#2563EB' }; // Keeping latest rate blue (neutral)
  const presentMetricStyle = { color: presentColor };
  const absentMetricStyle = { color: absentColor };


  // --- Loading State ---
  if (!mounted) {
    return (
      <Card className="max-w-3xl mx-auto w-full">
        <CardHeader>
          <CardTitle>Employee Attendance Analytics</CardTitle>
          <CardDescription>Visualizing Monthly Attendance & Absence</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-87 w-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Spinner />
              <p className="text-sm text-muted-foreground">Loading Attendance Data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // --- Main Chart Render ---
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Employee Attendance Analytics</CardTitle>
        <CardDescription>Side-by-side comparison of days Present/Absent and the overall Presence Rate (Jan - Dec 2024)</CardDescription>
      </CardHeader>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 pb-4">
          <MetricCard title="Latest Rate" value={`${latestPresenceRate}%`} icon={Users} style={rateMetricStyle} description={`Attendance Rate for ${lastMonth.month}`} />
          <MetricCard title="Total Present" value={lastMonth.present} icon={CalendarDays} style={presentMetricStyle} description={`${lastMonth.month} Days Present`} />
          <MetricCard title="Total Absent" value={lastMonth.absent} icon={AlertTriangle} style={absentMetricStyle} description={`${lastMonth.month} Days Absent`} />
          <MetricCard
            title="Rate Change"
            value={`${isPositiveChange ? '+' : ''}${Math.abs(rateChange).toFixed(2)}%`}
            icon={ChangeIcon}
            style={changeStyle}
            description={`vs. ${previousMonth.month} Presence Rate`}
          />
        </div>

        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barCategoryGap="10%"
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280" 
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              {/* Primary Y-Axis for Bar Data (Days) */}
              <YAxis 
                allowDecimals={false} 
                stroke="#6b7280" 
                yAxisId="left" 
                orientation="left" 
              />
              {/* Secondary Y-Axis for Line Data (Rate) */}
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke={chartConfig.rate.color} // Match color with the line
                domain={[80, 100]} // Focus the rate axis on the relevant range
                tickFormatter={(value) => `${value}%`}
              />
              
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                wrapperStyle={{ paddingTop: '10px', paddingBottom: '20px' }}
              />
              
              {/* Bar Data (Days Present/Absent) */}
              <Bar
                yAxisId="left"
                dataKey="present"
                name={chartConfig.present.label}
                fill={chartConfig.present.color}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="left"
                dataKey="absent"
                name={chartConfig.absent.label}
                fill={chartConfig.absent.color}
                radius={[4, 4, 0, 0]}
              />

              {/* Line Data (Presence Rate Trend) */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="rate"
                name={chartConfig.rate.label}
                stroke={chartConfig.rate.color} // #FFC000
                strokeWidth={3}
                dot={true}
                activeDot={{ r: 6 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>

        <CardFooter className="flex-col items-start gap-2 text-sm">
          {/* Use inline style object for dynamic trend color */}
          <div className="flex gap-2 leading-none font-semibold" style={changeStyle}>
            {isPositiveChange ? 'Improvement' : 'Decline'} in attendance rate by {Math.abs(rateChange).toFixed(2)}%
            <ChangeIcon className="h-4 w-4" />
          </div>
          <div className="text-gray-500 leading-none">
            The line graph shows the monthly Presence Rate trend, measured against the right Y-axis (80% to 100%).
          </div>
        </CardFooter>
    </Card>
  );
}

// A helper component for displaying key metrics
const MetricCard = ({ title, value, icon: Icon, style, description }: { title: string; value: string | number; icon: React.ComponentType<any>; style?: React.CSSProperties; description: string }) => (
  <div className="flex flex-col space-y-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium text-gray-500">{title}</span>
      <Icon className="h-4 w-4" style={style} />
    </div>
    <div className="text-2xl font-bold text-gray-900">
      {value}
    </div>
    <p className="text-xs text-gray-400 truncate">{description}</p>
  </div>
);

// The default export must be the main component
export default function App() {
    return (
        <div className="font-sans antialiased bg-gray-50">
            <AttendanceAnalyticsDashboard />
        </div>
    );
}