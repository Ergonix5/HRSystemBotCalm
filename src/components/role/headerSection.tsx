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
    <div className="flex justify-between mb-6">
      <div><CardTitle className='font-bold text-2xl mb-2'>{title}</CardTitle>
          <CardDescription className='text-gray-700'>{description}</CardDescription></div>
          
      <Button variant="outline" onClick={onAddClick}>
        <Plus className="size-4 mr-2" />
        Add New Role
      </Button>
  </div>
  );
}
