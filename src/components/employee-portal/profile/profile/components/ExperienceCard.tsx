import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import type { Experience } from "./types";

interface ExperienceCardProps {
  experience: Experience[];
  isEditing: boolean;
  onUpdateExperience: (index: number, field: string, value: string) => void;
  onAddExperience: () => void;
  onRemoveExperience: (index: number) => void;
}

export function ExperienceCard({ experience, isEditing, onUpdateExperience, onAddExperience, onRemoveExperience }: ExperienceCardProps) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold">Experience Timeline</h3>
        {isEditing && (
          <Button variant="ghost" onClick={onAddExperience} className="p-1 h-auto">
            <Plus size={18}/>
          </Button>
        )}
      </div>
      <div className="space-y-6">
        {experience.map((exp, i) => (
          <div key={i} className="group relative pl-6 border-l border-black/10 space-y-1">
            <div className="absolute -left-1.25 top-1 w-2 h-2 rounded-full bg-black group-hover:bg-[#B91434] transition-colors" />
            {isEditing ? (
              <div className="space-y-2 p-4 bg-black/5 rounded-md border border-black/5">
                <div className="flex justify-between gap-4">
                  <Input 
                    value={exp.role} 
                    onChange={(e) => onUpdateExperience(i, 'role', e.target.value)} 
                    className="font-bold text-sm border-0 border-b border-black/10 rounded-none px-0" 
                    placeholder="Role Name" 
                  />
                  <Button variant="ghost" size="sm" onClick={() => onRemoveExperience(i)} className="text-[#B91434] shrink-0 h-auto p-0">
                    <Trash2 size={16}/>
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input 
                    value={exp.company} 
                    onChange={(e) => onUpdateExperience(i, 'company', e.target.value)} 
                    className="text-xs text-[#B91434] font-bold border-0 border-b border-black/10 rounded-none px-0" 
                    placeholder="Company" 
                  />
                  <Input 
                    value={exp.period} 
                    onChange={(e) => onUpdateExperience(i, 'period', e.target.value)} 
                    className="text-xs font-bold text-black/40 w-24 border-0 border-b border-black/10 rounded-none px-0" 
                    placeholder="Dates" 
                  />
                </div>
                <Textarea 
                  value={exp.desc} 
                  onChange={(e) => onUpdateExperience(i, 'desc', e.target.value)} 
                  className="text-xs h-16" 
                  placeholder="Job description..." 
                />
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
  );
}