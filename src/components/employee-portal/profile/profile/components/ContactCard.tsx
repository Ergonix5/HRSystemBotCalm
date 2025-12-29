import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Mail, Phone, Info } from "lucide-react";
import type { Employee } from "./types";

interface ContactCardProps {
  employee: Employee;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ContactCard({ employee, isEditing, onInputChange }: ContactCardProps) {
  const contactItems = [
    { icon: Mail, label: "Email", value: employee.email, name: "email" },
    { icon: Phone, label: "Phone", value: employee.phone, name: "phone" }
  ];

  return (
    <Card className="p-6">
      <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4 flex items-center gap-2">
        <Info size={14}/> Contact
      </h3>
      <div className="space-y-4">
        {contactItems.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <p className="text-[10px] font-bold text-[#B91434] uppercase tracking-tighter">{item.label}</p>
            {isEditing ? (
              <Input 
                name={item.name} 
                value={item.value} 
                onChange={onInputChange} 
                className="text-xs font-medium border-0 border-b border-black/10 rounded-none px-0 focus:border-black" 
              />
            ) : (
              <p className="text-sm font-semibold truncate">{item.value}</p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}