import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Mail, Headset, Lock } from "lucide-react";

interface Employee {
  email: string;
  phone: string;
}

interface ContactCardProps {
  employee: Employee;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hotline: string;
}

export function ContactCard({ employee, isEditing, onInputChange, hotline }: ContactCardProps) {
  return (
    <Card className="p-8 space-y-10">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-black/30 flex items-center gap-2">
              <Mail size={14}/> Communication
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-[#B91434] uppercase">Work Email</p>
                {isEditing ? (
                  <Input 
                    name="email" 
                    value={employee.email} 
                    onChange={onInputChange} 
                    className="text-sm font-bold bg-transparent border-b border-black/10 focus:outline-none py-1 border-0 border-b-2 rounded-none px-0" 
                  />
                ) : (
                  <p className="text-sm font-bold text-black">{employee.email}</p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-[#B91434] uppercase">Primary Phone</p>
                {isEditing ? (
                  <Input 
                    name="phone" 
                    value={employee.phone} 
                    onChange={onInputChange} 
                    className="text-sm font-bold bg-transparent border-b border-black/10 focus:outline-none py-1 border-0 border-b-2 rounded-none px-0" 
                  />
                ) : (
                  <p className="text-sm font-bold text-black">{employee.phone}</p>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 bg-black text-white rounded-xl space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
              <Headset size={14}/> Emergency Hotline
            </h3>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Support Line</p>
              <p className="text-2xl font-black tracking-tight">{hotline}</p>
            </div>
            <div className="items-center gap-2 text-[8px] font-black uppercase tracking-widest text-[#B91434] bg-white/10 py-1.5 px-3 rounded inline-flex border border-white/5">
              <Lock size={10} /> Secure Access
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}