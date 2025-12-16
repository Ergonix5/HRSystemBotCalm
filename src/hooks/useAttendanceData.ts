import { useMemo } from 'react';

export interface AttendanceData {
  month: string;
  present: number;
  absent: number;
}

export const chartData: AttendanceData[] = [
  { month: "Jan", present: 186, absent: 20 },
  { month: "Feb", present: 305, absent: 15 },
  { month: "Mar", present: 237, absent: 25 },
  { month: "Apr", present: 273, absent: 18 },
  { month: "May", present: 209, absent: 22 },
  { month: "Jun", present: 214, absent: 16 },
  { month: "Jul", present: 298, absent: 12 },
  { month: "Aug", present: 265, absent: 19 },
  { month: "Sep", present: 241, absent: 21 },
  { month: "Oct", present: 287, absent: 14 },
  { month: "Nov", present: 253, absent: 17 },
  { month: "Dec", present: 276, absent: 13 },
];

export const employeeAttendanceData = [
  { name: "Present", value: 85, color: "#1F4E79" },
  { name: "Absent", value: 15, color: "#D54830" },
];

export const departmentAttendanceData = [
  { department: "Engineering", present: 92, absent: 8 },
  { department: "Marketing", present: 88, absent: 12 },
  { department: "Sales", present: 85, absent: 15 },
  { department: "HR", present: 95, absent: 5 },
  { department: "Finance", present: 90, absent: 10 },
];

export const chartConfig = {
  present: { label: "Days Present", color: "#1F4E79" },
  absent: { label: "Days Absent", color: "#D54830" },
};

export const useAttendanceData = () => {
  return useMemo(() => {
    const lastMonth = chartData[chartData.length - 1] || { month: 'N/A', present: 0, absent: 0 };
    const previousMonth = chartData[chartData.length - 2] || { month: 'N/A', present: 0, absent: 0 };

    const totalLastMonth = lastMonth.present + lastMonth.absent;
    const totalPreviousMonth = previousMonth.present + previousMonth.absent;

    const presenceRateLastMonth = totalLastMonth > 0 ? (lastMonth.present / totalLastMonth) : 0;
    const presenceRatePreviousMonth = totalPreviousMonth > 0 ? (previousMonth.present / totalPreviousMonth) : 0;

    const rateChange = (presenceRateLastMonth - presenceRatePreviousMonth) * 100;
    const isPositiveChange = rateChange >= 0;
    const latestPresenceRate = (presenceRateLastMonth * 100).toFixed(1);

    return {
      chartData,
      employeeAttendanceData,
      departmentAttendanceData,
      lastMonth,
      previousMonth,
      rateChange,
      isPositiveChange,
      latestPresenceRate,
      presentColor: chartConfig.present.color,
      absentColor: chartConfig.absent.color,
    };
  }, []);
};