"use client";

import { Shield, Plus } from 'lucide-react';
import { CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';

interface HeaderSectionProps {
  title: string;
  description: string;
  onAddClick: () => void;
}

export default function HeaderSection({ title, description, onAddClick }: HeaderSectionProps) {
  return (
    <div className="flex justify-between mb-6 p-3">
      <div><CardTitle className='text-3xl font-bold text-gray-900'>{title}</CardTitle>
          <CardDescription className='text-gray-500 text-md italic'>{description}</CardDescription></div>
          
      <Button variant="outline" onClick={onAddClick} className='border-[#B91434] text-[#B91434] hover:bg-[#B91434] hover:text-white transition-colors'>
        <Plus className="size-4 mr-2" />
        Add New Role
      </Button>
  </div>
  );
}
