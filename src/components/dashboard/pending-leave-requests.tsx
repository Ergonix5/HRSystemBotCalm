"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Calendar, Clock, Check, X } from "lucide-react"

interface LeaveRequest {
  id: string
  employeeName: string
  empId: string
  leaveType: string
  startDate: string
  duration: string
  appliedDate: string
  reason: string
  avatar: string
}

const leaveRequests: LeaveRequest[] = [
  {
    id: "1",
    employeeName: "Jane Smith",
    empId: "EMP-002",
    leaveType: "Annual Leave",
    startDate: "Dec 20-27",
    duration: "8 days",
    appliedDate: "2 days ago",
    reason: "Family vacation during Christmas holidays",
    avatar: "JS"
  },
  {
    id: "2",
    employeeName: "Sarah Davis",
    empId: "EMP-006",
    leaveType: "Sick Leave",
    startDate: "Dec 14-16",
    duration: "3 days",
    appliedDate: "1 day ago",
    reason: "Medical checkup and treatment required",
    avatar: "SD"
  },
  {
    id: "3",
    employeeName: "John Doe",
    empId: "EMP-001",
    leaveType: "Annual Leave",
    startDate: "Dec 23-30",
    duration: "8 days",
    appliedDate: "3 days ago",
    reason: "Year-end vacation with family",
    avatar: "JD"
  }
]

const getLeaveTypeColor = (type: string) => {
  switch (type) {
    case "Annual Leave": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "Sick Leave": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    case "Personal Leave": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

const getAvatarColor = (name: string) => {
  const colors = [
    "bg-blue-500",
    "bg-green-500", 
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-red-500"
  ]
  return colors[name.length % colors.length]
}

export function PendingLeaveRequests() {
  const [requests, setRequests] = useState(leaveRequests)
  const [removingIds, setRemovingIds] = useState<string[]>([])

  const handleApprove = (id: string) => {
    setRemovingIds(prev => [...prev, id])
    setTimeout(() => {
      setRequests(prev => prev.filter(req => req.id !== id))
      setRemovingIds(prev => prev.filter(reqId => reqId !== id))
    }, 300)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Pending Leave Requests</CardTitle>
            <p className="text-sm text-muted-foreground">Requires your approval</p>
          </div>
          <Badge variant="destructive" className="bg-red-500 text-white">
            {requests.length} Pending
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {requests.map((request) => (
          <div 
            key={request.id} 
            className={`p-3 border rounded-lg space-y-2 transition-all duration-300 ${
              removingIds.includes(request.id) 
                ? 'opacity-0 scale-95 translate-x-full' 
                : 'opacity-100 scale-100 translate-x-0'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className={`h-10 w-10 ${getAvatarColor(request.employeeName)}`}>
                  <AvatarFallback className="text-white font-semibold text-sm">
                    {request.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-sm">{request.employeeName}</h4>
                  <p className="text-xs text-muted-foreground">{request.empId}</p>
                </div>
              </div>
              <Badge className={getLeaveTypeColor(request.leaveType)}>
                {request.leaveType}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-1" />
                  {request.startDate}
                </span>
                <span className="font-medium">{request.duration}</span>
              </div>
              
              <p className="text-xs text-muted-foreground flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Applied {request.appliedDate}
              </p>
              
              <p className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                {request.reason}
              </p>
            </div>




            <div className="flex space-x-2 pt-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="border-green-600 hover:bg-green-600 hover:text-white"
                onClick={() => handleApprove(request.id)}
              >
                <Check className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button size="sm" variant="outline" className="border-red-600 hover:bg-red-600 hover:text-white">
                <X className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}