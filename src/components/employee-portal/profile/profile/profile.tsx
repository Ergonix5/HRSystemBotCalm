import React, { useState } from 'react';
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

export default function App() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const systemData: SystemData = {
    name: "Alex Rivera",
    employeeId: "CORP-9921-X",
    company: "Global Solutions Inc."
  };

  const [employee, setEmployee] = useState<Employee>({
    email: "a.rivera@corporate.com",
    phone: "+1 (555) 987-6543",
    department: "Operations & Strategy",
    position: "Senior Project Manager",
    location: "Chicago, IL",
    bio: "Result-oriented professional with over 8 years of experience in cross-functional team leadership and process optimization. Driven by data and strategic efficiency.",
    skills: ["Project Management", "Strategic Planning", "Budgeting", "Team Leadership"],
    experience: [
      { role: "Senior Project Manager", company: "Global Solutions Inc.", period: "2021 - Present", desc: "Overseeing operational budgets and leading cross-functional teams." },
      { role: "Operations Specialist", company: "Metro Logistics", period: "2018 - 2021", desc: "Streamlined supply chain workflows reducing costs by 20%." }
    ],
    education: [
      { degree: "MBA", school: "University of Chicago", year: "2018" }
    ]
  });

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