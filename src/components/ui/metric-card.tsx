import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  style: React.CSSProperties;
  description: string;
}

export const MetricCard = ({ title, value, icon: Icon, style, description }: MetricCardProps) => (
  <div className="flex flex-col space-y-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{title}</span>
      <Icon className="h-4 w-4" style={style} />
    </div>
    <div className="text-2xl font-bold text-gray-900 dark:text-white">
      {value}
    </div>
    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{description}</p>
  </div>
);