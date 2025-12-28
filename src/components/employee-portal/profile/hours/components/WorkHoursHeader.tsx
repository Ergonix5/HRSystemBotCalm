interface WorkHoursHeaderProps {
  totalHours: number;
  targetHours: number;
}

export default function WorkHoursHeader({ totalHours, targetHours }: WorkHoursHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">Track your working time on here</h1>
        <p className="text-[#717171] text-[14px] mt-1">Track and manage your weekly work hours</p>
      </div>
      <div className="flex items-center gap-8 bg-white p-4 rounded-xl border border-[#F0F0F0] shadow-sm">
        <div className="text-center px-4 border-r border-[#F0F0F0]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#717171] mb-1">Target</p>
          <p className="text-xl font-bold">{targetHours.toFixed(1)}</p>
        </div>
        <div className="text-center px-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#B91434] mb-1">Logged</p>
          <p className="text-xl font-bold text-[#B91434]">{totalHours.toFixed(1)}</p>
        </div>
      </div>
    </div>
  );
}