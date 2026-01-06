import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { Label } from '@/src/components/ui/label';

interface ManualEntryProps {
  selectedDate: string;
  hours: string;
  description: string;
  onDateChange: (date: string) => void;
  onHoursChange: (hours: string) => void;
  onDescriptionChange: (description: string) => void;
  onSubmit: () => void;
}

export default function ManualEntry({
  selectedDate,
  hours,
  description,
  onDateChange,
  onHoursChange,
  onDescriptionChange,
  onSubmit
}: ManualEntryProps) {
  return (
    <Card>
      <CardContent>
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#717171] mb-6 flex items-center gap-2">
          <Plus size={14} /> Add Manual Entry
        </h3>
        <div className="space-y-5">
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-[#717171]">Work Date</Label>
            <Input 
              type="date" 
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-[#717171]">Hours</Label>
            <Input 
              type="number"
              step="0.25"
              placeholder="0.0"
              value={hours}
              onChange={(e) => onHoursChange(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-[#717171]">Description</Label>
            <Textarea 
              placeholder="Briefly describe your task..."
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <Button 
            onClick={onSubmit} 
            className="w-full"
            disabled={!hours || !description}
            variant="secondary"
          >
            Save Entry
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}