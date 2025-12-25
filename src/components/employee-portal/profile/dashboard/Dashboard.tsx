"use client";

import React, { useState } from 'react';
import { 
  StatsGrid,
  ProfileCard,
  ContactCard,
  RecentActivity,
  UpcomingLeaves
} from './components';

export default function Dashboard() {
  const [isEditing, setIsEditing] = useState(false);

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


        <StatsGrid />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-5 space-y-6">
            <ProfileCard systemData={systemData} isEditing={isEditing} />
            <RecentActivity />
          </div>

          <div className="lg:col-span-7 space-y-6">
            <ContactCard 
              employee={employee} 
              isEditing={isEditing} 
              onInputChange={handleInputChange} 
              hotline={systemData.hotline} 
            />
            <UpcomingLeaves />
          </div>
        </div>
      </div>
    </div>
  );
}