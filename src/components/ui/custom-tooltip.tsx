import React from 'react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const presentData = payload.find((p: any) => p.dataKey === 'present');
    const absentData = payload.find((p: any) => p.dataKey === 'absent');
    const presentValue = presentData ? presentData.value : 0;
    const absentValue = absentData ? absentData.value : 0;
    const total = presentValue + absentValue;
    const presenceRate = total > 0 ? ((presentValue / total) * 100).toFixed(1) : 0;

    return (
      <div className="bg-white dark:bg-gray-700 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg text-sm">
        <p className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">{label}</p>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-medium" style={{ color: '#1F4E79' }}>Present:</span> {presentValue} days
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-medium" style={{ color: '#D54830' }}>Absent:</span> {absentValue} days
        </p>
        <p className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-600 font-bold text-gray-800 dark:text-gray-100">
          Rate: {presenceRate}% (of Total {total})
        </p>
      </div>
    );
  }
  return null;
};