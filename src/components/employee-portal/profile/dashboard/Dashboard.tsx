"use client";

import React, { useState, useEffect } from 'react';
import { 
  StatsGrid,
  ProfileCard,
  ContactCard,
  RecentActivity,
  UpcomingLeaves
} from './components';
import { useUser } from '@/src/contexts/UserContext';

export default function Dashboard() {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useUser();

  const [employee, setEmployee] = useState({
    email: user?.email || "",
    phone: user?.phone || "",
  });

  useEffect(() => {
    if (user) {
      setEmployee({
        email: user.email,
        phone: user.phone,
      });
    }
  }, [user]);

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
            <ProfileCard isEditing={isEditing} />
            <RecentActivity />
          </div>

          <div className="lg:col-span-7 space-y-6">
            <ContactCard 
              employee={employee} 
              isEditing={isEditing} 
              onInputChange={handleInputChange} 
              hotline={user?.hotline || ""} 
            />
            <UpcomingLeaves />
          </div>
        </div>
      </div>
    </div>
  );
}