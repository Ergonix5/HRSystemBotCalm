import { CheckCircle2 } from "lucide-react";

interface SuccessMessageProps {
  duration: number;
  selectedLeaveType: string;
  startDate: string;
  endDate: string;
  onReset: () => void;
}

const Card = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
    {children}
  </div>
);

const Button = ({ className = "", children, onClick }: { className?: string; children: React.ReactNode; onClick?: () => void }) => (
  <button 
    onClick={onClick} 
    className={`inline-flex items-center justify-center font-medium transition-all duration-200 bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg ${className}`}
  >
    {children}
  </button>
);

export default function SuccessMessage({ duration, selectedLeaveType, startDate, endDate, onReset }: SuccessMessageProps) {
  return (
    <Card className="max-w-xl mx-auto p-10 text-center animate-in fade-in zoom-in duration-300">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="h-10 w-10 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
      <p className="text-gray-600 mb-8">
        Your request for <strong>{duration} days</strong> of {selectedLeaveType} has been sent to your manager for approval.
      </p>
      <div className="bg-gray-50 p-4 rounded-lg text-left mb-8 border border-gray-100">
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">Dates:</span>
          <span className="font-medium text-gray-900">{startDate} to {endDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Type:</span>
          <span className="font-medium text-gray-900">{selectedLeaveType}</span>
        </div>
      </div>
      <Button onClick={onReset} className="w-full py-3 rounded-lg">
        Submit Another Request
      </Button>
    </Card>
  );
}