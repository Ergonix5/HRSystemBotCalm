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
    case "Annual Leave": return "bg-blue-50 text-blue-700 border border-blue-200"
    case "Sick Leave": return "bg-red-50 text-red-700 border border-red-200"
    case "Personal Leave": return "bg-purple-50 text-purple-700 border border-purple-200"
    default: return "bg-gray-50 text-gray-700 border border-gray-200"
  }
}

const getAvatarColor = (name: string) => {
  const colors = [
    "bg-blue-600",
    "bg-green-600", 
    "bg-purple-600",
    "bg-pink-600",
    "bg-indigo-600",
    "bg-orange-600"
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
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">Pending Leave Requests</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Requires your approval</p>
          </div>
          <Badge className="bg-red-100 text-red-800 border border-red-200 font-medium">
            {requests.length} Pending
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
        {requests.map((request) => (
          <div 
            key={request.id} 
            className={`p-4 bg-white border border-gray-200 rounded-lg space-y-3 transition-all duration-300 hover:shadow-sm ${
              removingIds.includes(request.id) 
                ? 'opacity-0 scale-95 translate-x-full' 
                : 'opacity-100 scale-100 translate-x-0'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className={`h-11 w-11 ${getAvatarColor(request.employeeName)}`}>
                  <AvatarFallback className="text-white font-semibold text-sm">
                    {request.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-gray-900">{request.employeeName}</h4>
                  <p className="text-sm text-gray-500">{request.empId}</p>
                </div>
              </div>
              <Badge className={`${getLeaveTypeColor(request.leaveType)} font-medium px-3 py-1`}>
                {request.leaveType}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">{request.startDate}</span>
                </span>
                <span className="font-semibold text-gray-900">{request.duration}</span>
              </div>
              
              <p className="text-sm text-gray-500 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Applied {request.appliedDate}
              </p>
              
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border">
                {request.reason}
              </p>
            </div>




            <div className="flex space-x-3 pt-2">
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-4"
                onClick={() => handleApprove(request.id)}
              >
                <Check className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-red-300 text-red-700 hover:bg-red-50 font-medium px-4"
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}