"use client"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Clock, Calendar, TrendingUp } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

const weeklyData = [
  { day: "Mon", hours: 8 },
  { day: "Tue", hours: 7.5 },
  { day: "Wed", hours: 8 },
  { day: "Thu", hours: 8.5 },
  { day: "Fri", hours: 0 },
  { day: "Sat", hours: 0 },
  { day: "Sun", hours: 0 }
]

const timeEntries = [
  { date: "2024-12-11", day: "Thursday", checkIn: "09:00 AM", checkOut: "05:30 PM", hours: "8.5 hrs" },
  { date: "2024-12-10", day: "Wednesday", checkIn: "09:00 AM", checkOut: "05:00 PM", hours: "8.0 hrs" },
  { date: "2024-12-09", day: "Tuesday", checkIn: "09:15 AM", checkOut: "05:00 PM", hours: "7.5 hrs" }
]

export default function WorkHours() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900">Work Hours</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">This Week</CardTitle>
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900">32 hrs</div>
              <div className="text-sm text-gray-500">out of 40 hours</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gray-900 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
              <Calendar className="w-4 h-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900">142 hrs</div>
              <div className="text-sm text-gray-500">out of 160 hours</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gray-900 h-2 rounded-full" style={{ width: '89%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Average Daily</CardTitle>
              <TrendingUp className="w-4 h-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900">8.0 hrs</div>
              <div className="text-sm text-gray-500">per day</div>
              <Badge className="bg-green-100 text-green-800 text-xs">On track</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Hours Chart */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Weekly Hours Overview</CardTitle>
          <p className="text-sm text-gray-500">Your work hours for this week</p>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  domain={[0, 12]}
                />
                <Bar 
                  dataKey="hours" 
                  fill="#EF4444" 
                  radius={[2, 2, 0, 0]}
                  barSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Time Entries */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Recent Time Entries</CardTitle>
          <p className="text-sm text-gray-500">Your recent work hours logged</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Day</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Check In</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Check Out</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600 text-sm">Hours</th>
                </tr>
              </thead>
              <tbody>
                {timeEntries.map((entry, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{entry.date}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{entry.day}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{entry.checkIn}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{entry.checkOut}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium">{entry.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}