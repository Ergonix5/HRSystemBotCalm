import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Plus, X } from "lucide-react";

interface SkillsCardProps {
  skills: string[];
  isEditing: boolean;
  onUpdateSkill: (index: number, value: string) => void;
  onAddSkill: () => void;
  onRemoveSkill: (index: number) => void;
}

export function SkillsCard({ skills, isEditing, onUpdateSkill, onAddSkill, onRemoveSkill }: SkillsCardProps) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-black/40">Core Skills</h3>
        {isEditing && (
          <Button variant="ghost" size="sm" onClick={onAddSkill} className="text-[#B91434] hover:bg-black/5 p-1 h-auto">
            <Plus size={14}/>
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill, i) => (
          isEditing ? (
            <div key={i} className="flex items-center bg-black/5 rounded-full px-2 py-0.5 border border-black/10">
              <Input 
                value={skill} 
                onChange={(e) => onUpdateSkill(i, e.target.value)} 
                className="bg-transparent text-[11px] font-semibold uppercase w-16 h-auto p-0 border-0 focus:ring-0"
              />
              <Button variant="ghost" size="sm" onClick={() => onRemoveSkill(i)} className="text-[#B91434] ml-1 h-auto p-0">
                <X size={10} />
              </Button>
            </div>
          ) : (
            <Badge key={i} variant="outline">{skill}</Badge>
          )
        ))}
      </div>
    </Card>
  );
}