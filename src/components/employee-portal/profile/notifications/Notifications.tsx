import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";

export default function Notifications() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="font-semibold">Leave Request Approved</p>
            <p className="text-sm text-gray-600">Your vacation request has been approved</p>
          </div>
          <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
            <p className="font-semibold">Timesheet Reminder</p>
            <p className="text-sm text-gray-600">Please submit your timesheet for this week</p>
          </div>
          <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
            <p className="font-semibold">Welcome Message</p>
            <p className="text-sm text-gray-600">Welcome to the employee portal!</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}