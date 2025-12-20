"use client"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Clock, User, FileText, CheckCircle, AlertCircle, UserPlus, Calendar } from "lucide-react"

interface Activity {
  id: string
  type: "leave_approved" | "user_added" | "system_update" | "document_uploaded" | "meeting_scheduled"
  title: string
  description: string
  user?: string
  timestamp: string
  avatar?: string
}

const activities: Activity[] = [
  {
    id: "1",
    type: "leave_approved",
    title: "Leave Request Approved",
    description: "Annual leave for Mike Johnson (Dec 20-27) has been approved",
    user: "HR Manager",
    timestamp: "2 minutes ago",
    avatar: "HM"
  },
  {
    id: "2",
    type: "system_update",
    title: "System Maintenance",
    description: "Scheduled maintenance completed successfully",
    timestamp: "1 hour ago"
  },
  {
    id: "3",
    type: "user_added",
    title: "New Employee Added",
    description: "Emma Wilson joined as Software Developer",
    user: "Admin",
    timestamp: "3 hours ago",
    avatar: "AD"
  },
  {
    id: "4",
    type: "document_uploaded",
    title: "Policy Document Updated",
    description: "Employee handbook v2.1 has been uploaded",
    user: "HR Team",
    timestamp: "5 hours ago",
    avatar: "HR"
  },
  {
    id: "5",
    type: "meeting_scheduled",
    title: "Team Meeting Scheduled",
    description: "Weekly standup meeting for next Monday",
    user: "Project Manager",
    timestamp: "1 day ago",
    avatar: "PM"
  }
]

const getActivityIcon = (type: string) => {
  switch (type) {
    case "leave_approved": return <CheckCircle className="w-4 h-4 text-green-600" />
    case "user_added": return <UserPlus className="w-4 h-4 text-blue-600" />
    case "system_update": return <AlertCircle className="w-4 h-4 text-orange-600" />
    case "document_uploaded": return <FileText className="w-4 h-4 text-purple-600" />
    case "meeting_scheduled": return <Calendar className="w-4 h-4 text-indigo-600" />
    default: return <User className="w-4 h-4 text-gray-600" />
  }
}

const getActivityColor = (type: string) => {
  switch (type) {
    case "leave_approved": return "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
    case "user_added": return "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
    case "system_update": return "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800"
    case "document_uploaded": return "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800"
    case "meeting_scheduled": return "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800"
    default: return "bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800"
  }
}

export function RecentActivities() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Activities</CardTitle>
            <p className="text-sm text-muted-foreground">Latest system updates and actions</p>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {activities.map((activity, index) => (
          <div 
            key={activity.id}
            className={`p-3 border rounded-lg transition-all duration-200 hover:shadow-sm ${getActivityColor(activity.type)}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start space-x-3">
              <div className="shrink-0 mt-1">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm truncate">{activity.title}</h4>
                  <span className="text-xs text-muted-foreground flex items-center ml-2">
                    <Clock className="w-3 h-3 mr-1" />
                    {activity.timestamp}
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {activity.description}
                </p>
                
                {activity.user && (
                  <div className="flex items-center mt-2">
                    <Avatar className="h-6 w-6 bg-gray-500">
                      <AvatarFallback className="text-white text-xs">
                        {activity.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground ml-2">by {activity.user}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}