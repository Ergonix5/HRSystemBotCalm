export interface Employee {
  email: string;
  phone: string;
  department: string;
  position: string;
  location: string;
  bio: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  desc: string;
}

export interface Education {
  degree: string;
  school: string;
  year: string;
}

export interface SystemData {
  name: string;
  employeeId: string;
  company: string;
}