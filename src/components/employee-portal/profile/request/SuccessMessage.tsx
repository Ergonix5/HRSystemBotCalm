import { CheckCircle2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface SuccessMessageProps {
  duration: number;
  selectedLeaveType: string;
  startDate: string;
  endDate: string;
  onReset: () => void;
}

const Card = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={`bg-white rounded-2xl shadow-lg border border-gray-100 ${className}`}
  >
    {children}
  </div>
);



export default function SuccessMessage({
  duration,
  selectedLeaveType,
  startDate,
  endDate,
  onReset,
}: SuccessMessageProps) {
  return (
    <div className="flex justify-center mt-16 px-4">
      <Card className="max-w-xl w-full p-8 text-center animate-in fade-in zoom-in duration-300 -mt-90">
        
        {/* Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Request Submitted!
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          Your request for <strong>{duration} days</strong> of{" "}
          <strong>{selectedLeaveType}</strong> has been sent to your manager for
          approval.
        </p>

        {/* Details Card */}
        <div className="bg-gray-50 p-5 rounded-xl text-left mb-8 border border-gray-200">
          <div className="flex justify-between mb-3">
            <span className="text-sm text-gray-500">Dates</span>
            <span className="font-medium text-gray-900 text-sm">
              {startDate} → {endDate}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Leave Type</span>
            <span className="font-medium text-gray-900 text-sm">
              {selectedLeaveType}
            </span>
          </div>
        </div>

        {/* Action */}
        <Button 
          variant="custom" 
          onClick={onReset} 
          className="w-full py-3 rounded-xl text-sm"
        >
          Submit Another Request
        </Button>
      </Card>
    </div>
  );
}
