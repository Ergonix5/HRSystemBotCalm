export interface LeaveRecord {
  id: string;
  type: "Vacation" | "Sick Leave" | "Personal" | "Bereavement";
  startDate: string;
  endDate: string;
  days: number;
  status: "approved" | "pending" | "rejected";
  appliedDate: string;
  reason?: string;
}