import { Card } from "@/src/components/ui/card";
import { Textarea } from "@/src/components/ui/textarea";

interface BioCardProps {
  bio: string;
  isEditing: boolean;
  onBioChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function BioCard({ bio, isEditing, onBioChange }: BioCardProps) {
  return (
    <Card className="p-6">
      <h3 className="text-sm font-bold mb-4">Professional Bio</h3>
      {isEditing ? (
        <Textarea 
          name="bio" 
          value={bio} 
          onChange={onBioChange} 
          rows={3} 
          className="w-full text-sm font-medium" 
        />
      ) : (
        <p className="text-sm text-black/80 leading-relaxed font-medium italic">"{bio}"</p>
      )}
    </Card>
  );
}