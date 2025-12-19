interface LeaveTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export default function LeaveTypeSelector({ selectedType, onTypeChange }: LeaveTypeSelectorProps) {
  const leaveTypes = ["Vacation", "Sick Leave", "Personal", "Other"];

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Leave Type</label>
      <div className="grid grid-cols-2 gap-3">
        {leaveTypes.map((type) => (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
              selectedType === type
                ? "border-[#B91434] bg-[#B91434]/5 ring-1 ring-[#B91434]"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${
              type === selectedType ? "bg-[#B91434]" : "bg-gray-300"
            }`}></div>
            <span className={`text-sm font-medium ${
              selectedType === type ? "text-[#B91434]" : "text-gray-700"
            }`}>{type}</span>
          </button>
        ))}
      </div>
    </div>
  );
}