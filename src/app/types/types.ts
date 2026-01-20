import { id } from "zod/v4/locales"

//Company Table
export type Company = {
  _id: string
  company_id: string
  company_name: string
  company_description: string
  company_logo?: string
  status: "Active" | "Inactive"
}

//Designation Table
export type Designation = {
  _id: string
  designation_id: string   
  title: string            
  company_name: string   
  description?: string     
  status: "Active" | "Inactive"
}


//Employee Table
export type Employee = {
  _id: string
  employee_id: string
  organization: string
  role: string
  designation: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  date_of_birth: string
  join_date: string
  profile_pic?: string
  employment_status: "Active"   | "Inactive"
}


export type Role= {
  _id?: string;
  organization?: string;
  organizationName?: string;
  role_id: string; 
  roleName: string;
  description: string;
  status: 'Active' | 'Inactive';
  userCount: number;
  permissions: string[];
  color: string;
  createdAt: string;
  updatedAt: string;
}

export type Permission ={
  id: string;
  name: string;
  description: string;
  category: 'Role' | 'Employee' | 'Announcement' | 'Leave' | 'Company' | 'Designation' | 'Leave' | 'Reports' | 'Settings' |"Profile"| 'Dashboard'
}

//Resusableform types
export type FormField = {
  id: string
  name: string
  label: string
  placeholder?: string
  type: "input" | "textarea" | "select" |"permissions"
  inputType?: string
  required?: boolean
  defaultValue?: any
  options?: { value: string; label: string }[]
  onChange?: (value: string) => void
}