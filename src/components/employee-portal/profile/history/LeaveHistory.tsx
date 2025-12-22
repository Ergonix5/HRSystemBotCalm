import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Download,
  Plus,
  Calendar
} from 'lucide-react';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
// import { Progress } from '../../../ui/progress';
import { Card, CardContent, CardHeader } from '../../../ui/card';
import { Input } from '../../../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../ui/table';

const LeaveHistory = () => {
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const leaveStats = [
    { label: 'Annual Leave', used: 12, total: 20 },
    { label: 'Sick Leave', used: 4, total: 10 },
    { label: 'Personal Leave', used: 2, total: 5 },
  ];

  const leaveHistory = [
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle2 className="mr-1 h-3 w-3" />;
      case 'Rejected': return <XCircle className="mr-1 h-3 w-3" />;
      case 'Pending': return <Clock className="mr-1 h-3 w-3" />;
      default: return <AlertCircle className="mr-1 h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Leave History</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Manage your time off requests and view balance.</p>
        </div>
       <Button variant="custom">View All Employees</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {leaveStats.map((stat, i) => (
          <Card key={i} className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stat.used}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">/ {stat.total} days</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">
                {stat.total - stat.used} days available
              </p>
              {/* <Progress value={(stat.used / stat.total) * 100} className="bg-slate-200 dark:bg-slate-700" /> */}
            </CardContent>
          </Card>
        ))}
      </div>

  

      <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search requests..."
                className="pl-9 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-1.5">
              {['All', 'Approved', 'Pending', 'Rejected'].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? 'secondary' : 'ghost'}
                  size="sm"
                  className={filterStatus === status ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}
                  onClick={() => setFilterStatus(status)}
                >
                  {status}
                </Button>
              ))}
              <div className="h-4 w-px bg-slate-300 dark:bg-slate-600 mx-1" />
              <Button variant="outline" size="icon" className="border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200 dark:border-slate-700">
                <TableHead className="text-slate-600 dark:text-slate-400 font-medium">Type</TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 font-medium">Period</TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 font-medium">Status</TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 font-medium">Approver</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
                  <TableRow key={item.id} className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <TableCell>
                      <div className="font-medium text-slate-800 dark:text-slate-100">{item.type}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.reason}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-slate-800 dark:text-slate-100">
                        {new Date(item.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(item.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {item.days} {item.days === 1 ? 'Day' : 'Days'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={item.status === 'Approved' ? 'default' : item.status === 'Rejected' ? 'destructive' : 'secondary'}
                        className={
                          item.status === 'Approved' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                            : item.status === 'Rejected' 
                            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                        }
                      >
                        {getStatusIcon(item.status)}
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-xs font-medium text-slate-700 dark:text-slate-300">
                          {item.approver[0]}
                        </div>
                        <span className="text-sm text-slate-700 dark:text-slate-300">{item.approver}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-500 dark:text-slate-400">
                    No results found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveHistory;