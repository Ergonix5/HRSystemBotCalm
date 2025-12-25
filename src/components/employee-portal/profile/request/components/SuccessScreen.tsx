import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface SuccessScreenProps {
  duration: number;
  startDate: string;
  endDate: string;
  onReset: () => void;
}

export function SuccessScreen({ duration, startDate, endDate, onReset }: SuccessScreenProps) {
  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-4 md:p-6 font-sans">
      <Card className="max-w-md w-full p-6 md:p-10 text-center animate-in zoom-in-95 duration-500">
        <div className="w-16 h-16 md:w-24 md:h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
             <CheckCircle2 className="h-6 w-6 md:h-10 md:w-10 text-white" />
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 tracking-tight">Request Sent!</h2>
        <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-6 md:mb-8">
          Your <span className="font-bold text-gray-900">{duration}-day</span> vacation is pending approval from your manager.
        </p>
        <div className="bg-gray-50 rounded-2xl p-4 md:p-5 mb-6 md:mb-8 border border-gray-100 space-y-3">
           <div className="flex justify-between text-xs md:text-sm">
              <span className="text-gray-400">Reference</span>
              <span className="font-mono font-bold text-gray-700">#LR-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
           </div>
           <div className="flex justify-between text-xs md:text-sm">
              <span className="text-gray-400">Timeline</span>
              <span className="font-bold text-gray-700">{startDate} to {endDate}</span>
           </div>
        </div>
        <Button 
          onClick={onReset}
          className="w-full py-3 md:py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all active:scale-[0.98] text-sm md:text-base"
        >
          Go to Dashboard
        </Button>
      </Card>
    </div>
  );
}