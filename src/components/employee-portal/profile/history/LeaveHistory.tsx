import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '../../../ui/card';
import { 
  PageHeader,
  LeaveStatsGrid,
  SearchAndFilter,
  LeaveHistoryTable,
  type LeaveRecord
} from './components';

const LeaveHistory = () => {
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const leaveHistory: LeaveRecord[] = [
    {
      id: 'LV-001',
      type: 'Annual Leave',
      startDate: '2023-12-10',
      endDate: '2023-12-15',
      days: 5,
      status: 'Approved',
      reason: 'Family Vacation',
      approver: 'Sarah Jenkins'
    },
    {
      id: 'LV-002',
      type: 'Sick Leave',
      startDate: '2023-11-02',
      endDate: '2023-11-03',
      days: 2,
      status: 'Approved',
      reason: 'Seasonal Flu',
      approver: 'Sarah Jenkins'
    },
    {
      id: 'LV-003',
      type: 'Personal Leave',
      startDate: '2023-10-15',
      endDate: '2023-10-15',
      days: 1,
      status: 'Rejected',
      reason: 'Urgent Bank Work',
      approver: 'Mike Ross'
    },
    {
      id: 'LV-004',
      type: 'Annual Leave',
      startDate: '2024-01-20',
      endDate: '2024-01-22',
      days: 3,
      status: 'Pending',
      reason: 'Friend\'s Wedding',
      approver: 'Pending'
    }
  ];

  const filteredHistory = useMemo(() => {
    return leaveHistory.filter(item => {
      const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
      const matchesSearch = item.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           item.reason.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [filterStatus, searchTerm]);

  return (
    <div className="space-y-6 p-6">
      <PageHeader />
      <LeaveStatsGrid />
      
      <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardHeader>
          <SearchAndFilter 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
          />
        </CardHeader>
        <CardContent className="p-0">
          <LeaveHistoryTable data={filteredHistory} />
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveHistory;