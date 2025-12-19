import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";

export default function LeaveHistoryTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between p-3 bg-gray-50 rounded">
            <span>Vacation - Dec 20-25, 2024</span>
            <span className="text-green-600">Approved</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-50 rounded">
            <span>Sick Leave - Nov 15, 2024</span>
            <span className="text-green-600">Approved</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-50 rounded">
            <span>Personal - Oct 10, 2024</span>
            <span className="text-yellow-600">Pending</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}