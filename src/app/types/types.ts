//Company Table
export type Company = {
  company_id: string
  company_name: string
  company_description: string
  status: "active" | "inactive"
}

//Designation Table
export type Designation = {
  designation_id: string   
  title: string            
  company_name: string   
  description?: string     
  status: "active" | "inactive" 
}


//Employee Table
export type Employee = {
  employee_id: string
  name: string
  email: string
  phone: string
  company_name: string
  designation: string
  join_date: string
  status: "active" | "inactive"
}