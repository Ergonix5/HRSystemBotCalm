import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Plus, Trash2, GraduationCap } from "lucide-react";
import type { Education } from "./types";

interface EducationCardProps {
  education: Education[];
  isEditing: boolean;
  onUpdateEducation: (index: number, field: string, value: string) => void;
  onAddEducation: () => void;
  onRemoveEducation: (index: number) => void;
}

export function EducationCard({ education, isEditing, onUpdateEducation, onAddEducation, onRemoveEducation }: EducationCardProps) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-black/40">Education</h3>
        {isEditing && (
          <Button variant="ghost" size="sm" onClick={onAddEducation} className="text-[#B91434] hover:bg-black/5 p-1 h-auto">
            <Plus size={14}/>
          </Button>
        )}
      </div>
      <div className="space-y-4">
        {education.map((edu, i) => (
          <div key={i} className="relative">
            {isEditing ? (
              <div className="space-y-1 p-2 bg-black/5 rounded border border-dashed border-black/20">
                <Input 
                  value={edu.degree} 
                  onChange={(e) => onUpdateEducation(i, 'degree', e.target.value)} 
                  className="text-xs font-bold bg-transparent border-0 p-0 h-auto" 
                  placeholder="Degree" 
                />
                <Input 
                  value={edu.school} 
                  onChange={(e) => onUpdateEducation(i, 'school', e.target.value)} 
                  className="text-[10px] bg-transparent border-0 p-0 h-auto" 
                  placeholder="Institution" 
                />
                <div className="flex justify-between items-center">
                  <Input 
                    value={edu.year} 
                    onChange={(e) => onUpdateEducation(i, 'year', e.target.value)} 
                    className="text-[10px] font-bold text-[#B91434] bg-transparent border-0 p-0 h-auto w-16" 
                    placeholder="Year" 
                  />
                  <Button variant="ghost" size="sm" onClick={() => onRemoveEducation(i)} className="text-[#B91434] h-auto p-0">
                    <Trash2 size={12}/>
                  </Button>
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
  );
}