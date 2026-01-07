import React, { useState, useEffect } from 'react';
import {
  ProfileHeader,
  ContactCard,
  SkillsCard,
  EducationCard,
  BioCard,
  ExperienceCard,
  SystemFooter,
  type Employee,
  type SystemData
} from './components';

interface EmployeeData {
  _id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  join_date: string;
  employment_status: string;
  organization: { name: string } | null;
  designation: { name: string } | null;
  role: { name: string } | null;
}

export default function App() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
  const [employee, setEmployee] = useState<Employee>({
    email: "",
    phone: "",
    department: "No Department",
    position: "No Position",
    location: "No Location",
    bio: "Professional employee with dedication to excellence and continuous improvement.",
    skills: ["Communication", "Team Work", "Problem Solving", "Time Management"],
    experience: [
      { role: "Current Role", company: "Current Company", period: "Present", desc: "Contributing to organizational goals and objectives." }
    ],
    education: [
      { degree: "Degree", school: "Institution", year: "Year" }
    ]
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (employeeData) {
      setEmployee(prev => ({
        ...prev,
        email: employeeData.email,
        phone: employeeData.phone || "",
        department: employeeData.designation?.name || "No Department",
        position: employeeData.role?.name || "No Position",
        location: employeeData.address || "No Location"
      }));
    }
  }, [employeeData]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/employee/profile');
      const data = await response.json();
      
      if (response.ok) {
        setEmployeeData(data.employee);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B91434]"></div>
      </div>
    );
  }

  const systemData: SystemData = {
    name: employeeData ? `${employeeData.first_name} ${employeeData.last_name}` : "User",
    employeeId: employeeData?.employee_id || "N/A",
    company: employeeData?.organization?.name || "No Company"
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const updateSkill = (index: number, value: string) => {
    const newSkills = [...employee.skills];
    newSkills[index] = value;
    setEmployee(prev => ({ ...prev, skills: newSkills }));
  };

  const addSkill = () => {
    setEmployee(prev => ({ ...prev, skills: [...prev.skills, 'New Skill'] }));
  };

  const removeSkill = (index: number) => {
    setEmployee(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 px-4 text-black selection:bg-[#B91434] selection:text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <ProfileHeader 
          employee={employee}
          systemData={systemData}
          isEditing={isEditing}
          profileImage={profileImage}
          onToggleEdit={() => setIsEditing(!isEditing)}
          onCancel={() => setIsEditing(false)}
          onInputChange={handleInputChange}
          onImageUpload={handleImageUpload}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <ContactCard 
              employee={employee}
              isEditing={isEditing}
              onInputChange={handleInputChange}
            />
            
            <SkillsCard 
              skills={employee.skills}
              isEditing={isEditing}
              onUpdateSkill={updateSkill}
              onAddSkill={addSkill}
              onRemoveSkill={removeSkill}
            />
            
            <EducationCard 
              education={employee.education}
              isEditing={isEditing}
              onUpdateEducation={(index, field, value) => {
                const newEducation = [...employee.education];
                newEducation[index] = { ...newEducation[index], [field]: value };
                setEmployee(prev => ({ ...prev, education: newEducation }));
              }}
              onAddEducation={() => setEmployee(prev => ({ ...prev, education: [...prev.education, { degree: "Degree", school: "School", year: "Year" }] }))}
              onRemoveEducation={(index) => setEmployee(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== index) }))}
            />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <BioCard 
              bio={employee.bio}
              isEditing={isEditing}
              onBioChange={handleInputChange}
            />
            
            <ExperienceCard 
              experience={employee.experience}
              isEditing={isEditing}
              onUpdateExperience={(index, field, value) => {
                const newExperience = [...employee.experience];
                newExperience[index] = { ...newExperience[index], [field]: value };
                setEmployee(prev => ({ ...prev, experience: newExperience }));
              }}
              onAddExperience={() => setEmployee(prev => ({ ...prev, experience: [...prev.experience, { role: "New Role", company: "Company", period: "2024", desc: "" }] }))}
              onRemoveExperience={(index) => setEmployee(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== index) }))}
            />
          </div>
        </div>

        <SystemFooter systemData={systemData} />
      </div>
    </div>
  );
}