import React, { useState, useRef } from 'react';
import { 
  User, Mail, Phone, Building, MapPin, 
  Camera, Briefcase, Edit2, Shield, 
  Save, GraduationCap, Plus, Trash2, X,
  Info, Lock
} from 'lucide-react';

// --- Simulated shadcn/ui-like Components ---
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white border border-black/10 shadow-sm rounded-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = "default", onRemove, isEditing }: {
  children: React.ReactNode;
  variant?: "default" | "outline" | "accent";
  onRemove?: () => void;
  isEditing?: boolean;
}) => {
  const styles: Record<string, string> = {
    default: "bg-black text-white",
    outline: "border border-black/10 text-black",
    accent: "bg-[#B91434] text-white",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1 ${styles[variant]}`}>
      {children}
      {isEditing && onRemove && (
        <button onClick={onRemove} className="hover:text-black/50 transition-colors">
          <X size={10} />
        </button>
      )}
    </span>
  );
};

const Button = ({ children, onClick, variant = "primary", className = "" }: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost" | "danger";
  className?: string;
}) => {
  const variants: Record<string, string> = {
    primary: "bg-black text-white hover:bg-black/90",
    outline: "border border-black/20 hover:bg-black/5 text-black",
    ghost: "hover:bg-black/5 text-black",
    danger: "bg-[#B91434] text-white hover:bg-[#B91434]/90"
  };
  return (
    <button 
      onClick={onClick} 
      className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default function App() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Core identifiers (Locked - simulate backend data)
  const systemData = {
    name: "Alex Rivera",
    employeeId: "CORP-9921-X",
    company: "Global Solutions Inc."
  };

  const [employee, setEmployee] = useState({
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

  const updateListValue = (field: keyof typeof employee, index: number, value: string) => {
    const newList = [...employee[field]];
    newList[index] = value;
    setEmployee(prev => ({ ...prev, [field]: newList }));
  };

  const updateObjectList = (field: 'experience' | 'education', index: number, subfield: string, value: string) => {
    const newList = [...employee[field]];
    newList[index] = { ...newList[index], [subfield]: value };
    setEmployee(prev => ({ ...prev, [field]: newList }));
  };

  const addListItem = (field: keyof typeof employee, defaultValue: any) => {
    setEmployee(prev => ({ ...prev, [field]: [...(prev[field] as any[]), defaultValue] }));
  };

  const removeListItem = (field: keyof typeof employee, index: number) => {
    setEmployee(prev => ({ ...prev, [field]: (employee[field] as any[]).filter((_, i) => i !== index) }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 px-4 text-black selection:bg-[#B91434] selection:text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Profile Header Card */}
        <Card className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border border-black/10 bg-white overflow-hidden shadow-inner">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover grayscale" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-black/5 text-black/20">
                    <User size={64} strokeWidth={1} />
                  </div>
                )}
                {isEditing && (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full"
                  >
                    <Camera size={20} />
                  </button>
                )}
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="space-y-2">
                {/* Employee Name is NOT editable (System Property) */}
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h1 className="text-3xl font-bold tracking-tight">{systemData.name}</h1>
                  <div title="System Locked Field">
                    <Lock size={14} className="text-black/20" />
                  </div>
                </div>
                
                <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                  {isEditing ? (
                    <>
                      <input 
                        name="position" 
                        value={employee.position} 
                        onChange={handleInputChange} 
                        className="text-xs font-semibold uppercase bg-white border border-black/20 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-black" 
                        placeholder="Position"
                      />
                      <input 
                        name="department" 
                        value={employee.department} 
                        onChange={handleInputChange} 
                        className="text-xs font-semibold uppercase bg-white border border-black/20 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-black" 
                        placeholder="Department"
                      />
                    </>
                  ) : (
                    <>
                      <Badge variant="accent">{employee.position}</Badge>
                      <Badge variant="outline">{employee.department}</Badge>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-black/60 font-medium">
                {isEditing ? (
                  <div className="flex gap-4 w-full">
                    <div className="flex items-center gap-1">
                      <MapPin size={14}/>
                      <input name="location" value={employee.location} onChange={handleInputChange} className="bg-transparent border-b border-black/10 focus:outline-none" placeholder="Location" />
                    </div>
                    {/* Employee ID is NOT editable */}
                    <div className="flex items-center gap-1 opacity-50">
                      <Shield size={14}/>
                      <span>{systemData.employeeId}</span>
                      <Lock size={10} />
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="flex items-center gap-1"><MapPin size={14}/> {employee.location}</span>
                    <span className="flex items-center gap-1"><Shield size={14}/> {systemData.employeeId}</span>
                  </>
                )}
              </div>
            </div>

            <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "primary" : "outline"}>
              {isEditing ? <><Save size={16} /> Save</> : <><Edit2 size={16} /> Edit Profile</>}
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4 flex items-center gap-2">
                <Info size={14}/> Contact
              </h3>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: "Email", value: employee.email, name: "email" },
                  { icon: Phone, label: "Phone", value: employee.phone, name: "phone" }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="text-[10px] font-bold text-[#B91434] uppercase tracking-tighter">{item.label}</p>
                    {isEditing ? (
                      <input name={item.name} value={item.value} onChange={handleInputChange} className="text-xs font-medium w-full border-b border-black/10 focus:border-black focus:outline-none py-1" />
                    ) : (
                      <p className="text-sm font-semibold truncate">{item.value}</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-black/40">Core Skills</h3>
                {isEditing && (
                  <button onClick={() => addListItem('skills', 'New Skill')} className="text-[#B91434] hover:bg-black/5 p-1 rounded">
                    <Plus size={14}/>
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {employee.skills.map((skill, i) => (
                  isEditing ? (
                    <div key={i} className="flex items-center bg-black/5 rounded-full px-2 py-0.5 border border-black/10">
                      <input 
                        value={skill} 
                        onChange={(e) => updateListValue('skills', i, e.target.value)} 
                        className="bg-transparent text-[11px] font-semibold uppercase w-16 focus:outline-none"
                      />
                      <button onClick={() => removeListItem('skills', i)} className="text-[#B91434] ml-1">
                        <X size={10} />
                      </button>
                    </div>
                  ) : (
                    <Badge key={i} variant="outline">{skill}</Badge>
                  )
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-black/40">Education</h3>
                {isEditing && (
                  <button onClick={() => addListItem('education', { degree: "Degree", school: "School", year: "Year" })} className="text-[#B91434] hover:bg-black/5 p-1 rounded">
                    <Plus size={14}/>
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {employee.education.map((edu, i) => (
                  <div key={i} className="relative">
                    {isEditing ? (
                      <div className="space-y-1 p-2 bg-black/5 rounded border border-dashed border-black/20">
                        <input value={edu.degree} onChange={(e) => updateObjectList('education', i, 'degree', e.target.value)} className="text-xs font-bold w-full bg-transparent focus:outline-none" placeholder="Degree" />
                        <input value={edu.school} onChange={(e) => updateObjectList('education', i, 'school', e.target.value)} className="text-[10px] w-full bg-transparent focus:outline-none" placeholder="Institution" />
                        <div className="flex justify-between items-center">
                          <input value={edu.year} onChange={(e) => updateObjectList('education', i, 'year', e.target.value)} className="text-[10px] font-bold text-[#B91434] bg-transparent focus:outline-none" placeholder="Year" />
                          <button onClick={() => removeListItem('education', i)} className="text-[#B91434]"><Trash2 size={12}/></button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <div className="shrink-0 mt-1"><GraduationCap size={16} className="text-black/30"/></div>
                        <div>
                          <p className="text-xs font-bold leading-tight">{edu.degree}</p>
                          <p className="text-[10px] text-black/50">{edu.school}</p>
                          <p className="text-[10px] font-bold text-[#B91434] mt-0.5">{edu.year}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="text-sm font-bold mb-4">Professional Bio</h3>
              {isEditing ? (
                <textarea 
                  name="bio" 
                  value={employee.bio} 
                  onChange={handleInputChange} 
                  rows={3} 
                  className="w-full text-sm font-medium p-3 border border-black/10 rounded-md focus:border-black focus:outline-none bg-white" 
                />
              ) : (
                <p className="text-sm text-black/80 leading-relaxed font-medium italic">"{employee.bio}"</p>
              )}
            </Card>

            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold">Experience Timeline</h3>
                {isEditing && <Button onClick={() => addListItem('experience', { role: "New Role", company: "Company", period: "2024", desc: "" })} variant="ghost" className="p-1"><Plus size={18}/></Button>}
              </div>
              <div className="space-y-6">
                {employee.experience.map((exp, i) => (
                  <div key={i} className="group relative pl-6 border-l border-black/10 space-y-1">
                    <div className="absolute -left-1.25 top-1 w-2 h-2 rounded-full bg-black group-hover:bg-[#B91434] transition-colors" />
                    {isEditing ? (
                      <div className="space-y-2 p-4 bg-black/5 rounded-md border border-black/5">
                        <div className="flex justify-between gap-4">
                          <input value={exp.role} onChange={(e) => updateObjectList('experience', i, 'role', e.target.value)} className="font-bold text-sm w-full bg-transparent border-b border-black/10 focus:outline-none" placeholder="Role Name" />
                          <button onClick={() => removeListItem('experience', i)} className="text-[#B91434] shrink-0"><Trash2 size={16}/></button>
                        </div>
                        <div className="flex gap-2">
                          <input value={exp.company} onChange={(e) => updateObjectList('experience', i, 'company', e.target.value)} className="text-xs text-[#B91434] font-bold w-full bg-transparent border-b border-black/10 focus:outline-none" placeholder="Company" />
                          <input value={exp.period} onChange={(e) => updateObjectList('experience', i, 'period', e.target.value)} className="text-xs font-bold text-black/40 w-24 bg-transparent border-b border-black/10 focus:outline-none" placeholder="Dates" />
                        </div>
                        <textarea value={exp.desc} onChange={(e) => updateObjectList('experience', i, 'desc', e.target.value)} className="text-xs w-full bg-transparent focus:outline-none h-16" placeholder="Job description..." />
                      </div>
                    ) : (
                      <>
                        <h4 className="text-sm font-bold">{exp.role}</h4>
                        <div className="flex items-center justify-between text-[11px] font-bold text-black/50">
                          <span className="text-[#B91434]">{exp.company}</span>
                          <span>{exp.period}</span>
                        </div>
                        <p className="text-xs text-black/70 font-medium leading-relaxed mt-2">{exp.desc}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* System Footer */}
        <div className="flex justify-between items-center py-6 border-t border-black/5 text-[10px] font-bold uppercase tracking-widest text-black/30">
          {/* Company Name is NOT editable (System Property) */}
          <div className="flex items-center gap-2">
            <span>{systemData.company}</span>
            <Lock size={10} className="opacity-50" />
          </div>
          <div className="flex gap-4 text-black/30">
            <span className="text-[#B91434]">Verified Secure</span>
            <span>2025</span>
          </div>
        </div>
      </div>
    </div>
  );
}