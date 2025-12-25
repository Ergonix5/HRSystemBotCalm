import { useRef } from "react";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/src/components/ui/avatar";
import { User, Camera, MapPin, Shield, Lock, Edit2, Save } from "lucide-react";
import type { Employee, SystemData } from "./types";

interface ProfileHeaderProps {
  employee: Employee;
  systemData: SystemData;
  isEditing: boolean;
  profileImage: string | null;
  onToggleEdit: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileHeader({ 
  employee, 
  systemData, 
  isEditing, 
  profileImage, 
  onToggleEdit, 
  onInputChange, 
  onImageUpload 
}: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card className="p-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="relative">
          <Avatar className="w-32 h-32 border border-black/10 shadow-inner">
            <AvatarImage src={profileImage || ""} alt="Profile" className="grayscale" />
            <AvatarFallback className="bg-black/5 text-black/20">
              <User size={64} strokeWidth={1} />
            </AvatarFallback>
            {isEditing && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full"
              >
                <Camera size={20} />
              </button>
            )}
          </Avatar>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onImageUpload} />
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{systemData.name}</h1>
              <div title="System Locked Field">
                <Lock size={14} className="text-black/20" />
              </div>
            </div>
            
            <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
              {isEditing ? (
                <>
                  <Input 
                    name="position" 
                    value={employee.position} 
                    onChange={onInputChange} 
                    className="text-xs font-semibold uppercase w-auto min-w-32" 
                    placeholder="Position"
                  />
                  <Input 
                    name="department" 
                    value={employee.department} 
                    onChange={onInputChange} 
                    className="text-xs font-semibold uppercase w-auto min-w-32" 
                    placeholder="Department"
                  />
                </>
              ) : (
                <>
                  <Badge className="bg-[#B91434] text-white">{employee.position}</Badge>
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
                  <Input 
                    name="location" 
                    value={employee.location} 
                    onChange={onInputChange} 
                    className="bg-transparent border-0 border-b border-black/10 rounded-none px-0 focus:border-black" 
                    placeholder="Location" 
                  />
                </div>
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

        <Button onClick={onToggleEdit} variant={isEditing ? "default" : "outline"}>
          {isEditing ? <><Save size={16} /> Save</> : <><Edit2 size={16} /> Edit Profile</>}
        </Button>
      </div>
    </Card>
  );
}