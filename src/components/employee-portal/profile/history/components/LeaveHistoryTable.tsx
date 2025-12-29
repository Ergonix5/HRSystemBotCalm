import { Badge } from "@/src/components/ui/badge";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export interface LeaveRecord {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: string;
  reason: string;
  approver: string;
}

interface LeaveHistoryTableProps {
  data: LeaveRecord[];
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Approved': return <CheckCircle2 className="mr-1 h-3 w-3" />;
    case 'Rejected': return <XCircle className="mr-1 h-3 w-3" />;
    case 'Pending': return <Clock className="mr-1 h-3 w-3" />;
    default: return <AlertCircle className="mr-1 h-3 w-3" />;
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Approved': return 'default';
    case 'Rejected': return 'destructive';
    default: return 'secondary';
  }
};

const getStatusClassName = (status: string) => {
  switch (status) {
    case 'Approved': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
    case 'Rejected': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
    default: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
  }
};

export function LeaveHistoryTable({ data }: LeaveHistoryTableProps) {
  return (
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
        {data.length > 0 ? (
          data.map((item) => (
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
                  variant={getStatusVariant(item.status)}
                  className={getStatusClassName(item.status)}
                >
                  {getStatusIcon(item.status)}
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-slate-200 dark:bg-slate-600 text-xs font-medium text-slate-700 dark:text-slate-300">
                      {item.approver[0]}
                    </AvatarFallback>
                  </Avatar>
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
  );
}