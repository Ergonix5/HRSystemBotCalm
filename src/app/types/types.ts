import { id } from "zod/v4/locales"

//Company Table
export type Company = {
  company_id: string
  company_name: string
  company_description: string
  company_logo?: string
  status: "Active" | "Inactive"
}

//Designation Table
export type Designation = {
  designation_id: string   
  title: string            
  company_name: string   
  description?: string     
  status: "Active" | "Inactive"
}


//Employee Table
export type Employee = {
  employee_id: string
  company_id: string
  role_id: string
  designation_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  date_of_birth: string
  join_date: string
  profile_pic?: string
  status: "Active" | "Inactive"
}