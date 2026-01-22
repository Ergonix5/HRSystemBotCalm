import { useState, useRef } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/src/components/ui/avatar";
import { User, Camera } from "lucide-react";

interface SystemData {
  name: string;
  employeeId: string;
  company: string;
  department: string;
  position: string;
}

interface ProfileCardProps {
  systemData: SystemData;
  isEditing: boolean;
}

export function ProfileCard({ systemData, isEditing }: ProfileCardProps) {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card className="p-8">
      <CardContent className="p-0">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative group">
            <Avatar className="w-32 h-32 rounded-2xl border border-black/10 bg-white shadow-inner ring-4 ring-black/2">
              <AvatarImage src={profileImage || ""} alt="Profile" className="grayscale" />
              <AvatarFallback className="bg-black/5 text-black/20">
                <User size={48} strokeWidth={1} />
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"
              >
                <Camera size={20} />
              </button>
            )}
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
              <Badge className="bg-[#B91434] text-white">{systemData.position}</Badge>
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
      </CardContent>
    </Card>
  );
}