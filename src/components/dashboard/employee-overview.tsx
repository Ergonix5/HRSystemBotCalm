import { Card, CardContent, CardHeader, CardTitle, CardAction } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Clock, Phone, MapPin, Mail } from "lucide-react"
import Link from "next/link"

interface Employee {
  id: string
  name: string
  empId: string
  role: string
  email: string
  phone: string
  company: string
  checkIn: string
  status: "Present" | "Late" | "Half Day"
  isActive: boolean
  avatar: string
}

const employees: Employee[] = [
  {
    id: "1",
    name: "John Doe",
    empId: "EMP-001",
    role: "Software Engineer",
    email: "john.doe@techsolutions.com",
    phone: "+1-555-0101",
    company: "Tech Solutions Inc.",
    checkIn: "09:00 AM",
    status: "Present",
    isActive: true,
    avatar: "JD"
  },
  {
    id: "2",
    name: "Jane Smith",
    empId: "EMP-002",
    role: "Senior Developer",
    email: "jane.smith@techsolutions.com",
    phone: "+1-555-0102",
    company: "Tech Solutions Inc.",
    checkIn: "09:15 AM",
    status: "Late",
    isActive: true,
    avatar: "JS"
  },
  {
    id: "3",
    name: "Michael Johnson",
    empId: "EMP-003",
    role: "Project Manager",
    email: "michael.j@globalinnovations.com",
    phone: "+1-555-0103",
    company: "Global Innovations",
    checkIn: "08:45 AM",
    status: "Present",
    isActive: true,
    avatar: "MJ"
  },
  {
    id: "4",
    name: "Emily Brown",
    empId: "EMP-004",
    role: "UI/UX Designer",
    email: "emily.brown@globalinnovations.com",
    phone: "+1-555-0104",
    company: "Global Innovations",
    checkIn: "10:00 AM",
    status: "Half Day",
    isActive: true,
    avatar: "EB"
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Present": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-100"
    case "Late": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 hover:bg-yellow-100"
    case "Half Day": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-100"
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 hover:bg-gray-100"
  }
}

const getAvatarColor = (name: string) => {
  const colors = [
    "bg-blue-500",
    "bg-green-500", 
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-orange-500"
  ]
  return colors[name.length % colors.length]
}

export function EmployeeOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Employee Overview</CardTitle>
        <p className="text-sm text-muted-foreground">Real-time attendance and employee status</p>
        <CardAction>
       
            <Button variant="custom">View All Employees</Button>
          
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {employees.map((employee) => (
          <div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-4">
              <Avatar className={`h-12 w-12 ${getAvatarColor(employee.name)}`}>
                <AvatarFallback className="text-white font-semibold">
                  {employee.avatar}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold">{employee.name}</h3>
                  <Badge variant="secondary" className="text-xs">{employee.empId}</Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center">
                  <span className="mr-2"></span>
                  {employee.role}
                </p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <Mail className="w-3 h-3 mr-1" />
                    {employee.email}
                  </span>
                  <span className="flex items-center">
                    <Phone className="w-3 h-3 mr-1" />
                    {employee.phone}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {employee.company}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              <Badge className={getStatusColor(employee.status)}>
                {employee.status}
              </Badge>
              <Badge className={employee.isActive ? "bg-blue-100 text-blue-800 dark:bg-green-900 dark:text-green-300" : ""} variant={employee.isActive ? "secondary" : "secondary"}>
                {employee.isActive ? "Active" : "Inactive"}
              </Badge>
              <p className="text-xs text-muted-foreground flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Check-in: {employee.checkIn}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}