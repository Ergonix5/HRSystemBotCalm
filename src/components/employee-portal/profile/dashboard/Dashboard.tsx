"use client";

import React, { useState, useRef, ReactNode } from 'react';
import { 
  User, Mail, Phone, 
  Camera, Edit2, Shield, 
  Save, Lock, Headset, 
  Building2,
  Calendar, FileText, Clock, BarChart3
} from 'lucide-react';

// --- Types ---
interface ComponentWithChildren {
  children: ReactNode;
  className?: string;
}

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "outline" | "accent";
  className?: string;
}

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline";
  className?: string;
}

interface StatsCardProps {
  icon: any; // Using any for Lucide icon component type compatibility
  current: number;
  total: number;
  label: string;
  value: number;
  unit: string;
  percentage: number;
}

// --- Reusable UI Components ---
const Card = ({ children, className = "" }: ComponentWithChildren) => (
  <div className={`bg-white border border-black/10 shadow-sm rounded-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = "default", className = "" }: BadgeProps) => {
  const styles = {
    default: "bg-black text-white",
    outline: "border border-black/10 text-black",
    accent: "bg-[#B91434] text-white",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Button = ({ children, onClick, variant = "primary", className = "" }: ButtonProps) => {
  const variants = {
    primary: "bg-black text-white hover:bg-black/90",
    outline: "border border-black/20 hover:bg-black/5 text-black",
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

// --- Dashboard Sub-Components ---

function StatsCard({ icon: Icon, current, total, label, value, unit, percentage }: StatsCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-black/3 rounded-lg">
          <Icon className="h-5 w-5 text-[#B91434]" />
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-black/30 uppercase tracking-widest leading-none mb-1">{label}</p>
          <p className="text-2xl font-black text-black leading-none">{value} <span className="text-[10px] text-black/30 font-bold uppercase">{unit}</span></p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <p className="text-[10px] font-bold text-black/40 tracking-tight">{current} / {total} Total</p>
          <p className="text-[10px] font-black text-[#B91434]">{percentage}%</p>
        </div>
        <div className="bg-black/5 rounded-full h-1.5 overflow-hidden">
          <div className="bg-black rounded-full h-full transition-all duration-700" style={{width: `${percentage}%`}}></div>
        </div>
      </div>
    </Card>
  );
}

function UpcomingLeaves() {
  const leaves = [
    { type: "Vacation", date: "2024-12-20", days: 3, status: "Approved" },
    { type: "Personal", date: "2024-12-24", days: 1, status: "Approved" }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold text-black tracking-tight">Upcoming Leaves</h3>
          <p className="text-[10px] text-black/40 font-medium uppercase tracking-wider">Your approved time off</p>
        </div>
        <Calendar size={16} className="text-black/10" />
      </div>
      
      <div className="space-y-4">
        {leaves.map((leave, i) => (
          <div key={i} className="flex justify-between items-center pb-4 border-b border-black/3 last:border-0 last:pb-0">
            <div>
              <p className="text-xs font-bold text-black">{leave.type}</p>
              <p className="text-[10px] text-black/40 font-medium">{leave.date}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-black mb-1">{leave.days} days</p>
              <span className="text-[8px] font-black uppercase tracking-widest bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100">
                {leave.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function RecentActivity() {
  const activities = [
    { title: "Leave request approved", meta: "2024-12-10 • Vacation" },
    { title: "Submitted leave request", meta: "2024-12-08 • Personal" },
    { title: "Logged 8 hours", meta: "2024-12-05 • Work Hours" },
    { title: "Leave request approved", meta: "2024-12-03 • Sick Leave" }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold text-black tracking-tight">Recent Activity</h3>
          <p className="text-[10px] text-black/40 font-medium uppercase tracking-wider">Your latest actions</p>
        </div>
        <Clock size={16} className="text-black/10" />
      </div>
      
      <div className="space-y-5">
        {activities.map((act, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="w-1.5 h-1.5 bg-[#B91434] rounded-full mt-1.5 shrink-0 shadow-[0_0_8px_rgba(185,20,52,0.4)]"></div>
            <div>
              <p className="text-xs font-bold text-black leading-none mb-1">{act.title}</p>
              <p className="text-[10px] text-black/40 font-medium">{act.meta}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// --- Main Application ---

export default function App() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const systemData = {
    name: "Alex Rivera",
    employeeId: "BC-6557-Z",
    company: "BotCalm Private Limited",
    department: "Operations & Strategy",
    position: "Senior Project Manager",
    hotline: "0412246557",
  };

  const [employee, setEmployee] = useState({
    email: "a.rivera@botcalm.com",
    phone: "07123456789",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployee(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 px-4 text-black selection:bg-[#B91434] selection:text-white font-sans">
      <div className="max-w-6xl mx-auto space-y-8">


        {/* Dashboard Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            icon={Calendar} current={18} total={25} label="Remaining Leave" 
            value={18} unit="days" percentage={72} 
          />
          <StatsCard 
            icon={Clock} current={32} total={40} label="Weekly Hours" 
            value={32} unit="hours" percentage={80} 
          />
          <StatsCard 
            icon={BarChart3} current={142} total={160} label="Monthly Progress" 
            value={142} unit="hours" percentage={89} 
          />
          <StatsCard 
            icon={FileText} current={5} total={7} label="Approved Apps" 
            value={5} unit="docs" percentage={71} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Identity */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-8">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-2xl border border-black/10 bg-white overflow-hidden shadow-inner ring-4 ring-black/2">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover grayscale" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black/5 text-black/20">
                        <User size={48} strokeWidth={1} />
                      </div>
                    )}
                    {isEditing && (
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Camera size={20} />
                      </button>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setProfileImage(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }} 
                  />
                </div>

                <div className="space-y-2">
                  <h1 className="text-2xl font-bold tracking-tight text-black">{systemData.name}</h1>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge variant="accent">{systemData.position}</Badge>
                    <Badge variant="outline">{systemData.department}</Badge>
                  </div>
                </div>

                <div className="w-full pt-6 border-t border-black/5 space-y-4 text-left">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-black/40 uppercase tracking-widest">Employee ID</span>
                    <span className="text-black font-black">{systemData.employeeId}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-black/40 uppercase tracking-widest">Company</span>
                    <span className="text-black font-black">{systemData.company}</span>
                  </div>
                </div>
              </div>
            </Card>

            <RecentActivity />
          </div>

          {/* Right Column: Contact & Support */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-8 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-black/30 flex items-center gap-2">
                    <Mail size={14}/> Communication
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-[#B91434] uppercase">Work Email</p>
                      {isEditing ? (
                        <input 
                          name="email" 
                          value={employee.email} 
                          onChange={handleInputChange} 
                          className="text-sm font-bold w-full bg-transparent border-b border-black/10 focus:outline-none py-1" 
                        />
                      ) : (
                        <p className="text-sm font-bold text-black">{employee.email}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-[#B91434] uppercase">Primary Phone</p>
                      {isEditing ? (
                        <input 
                          name="phone" 
                          value={employee.phone} 
                          onChange={handleInputChange} 
                          className="text-sm font-bold w-full bg-transparent border-b border-black/10 focus:outline-none py-1" 
                        />
                      ) : (
                        <p className="text-sm font-bold text-black">{employee.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-black text-white rounded-xl space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
                    <Headset size={14}/> Emergency Hotline
                  </h3>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Support Line</p>
                    <p className="text-2xl font-black tracking-tight">{systemData.hotline}</p>
                  </div>
                  <div className="items-center gap-2 text-[8px] font-black uppercase tracking-widest text-[#B91434] bg-white/10 py-1.5 px-3 rounded inline-flex border border-white/5">
                    <Lock size={10} /> Secure Access
                  </div>
                </div>
              </div>
            </Card>

            <UpcomingLeaves />
          </div>
        </div>
      </div>
    </div>
  );
}